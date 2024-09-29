import { ROMInfo, ROMOffset } from "@lib/gameData/romInfo"
import { parseTokens, ReferencePathValueComponent, SplitToken } from "@lib/generator/dataTokens"
import {
  AddressToken,
  Expression,
  type ExpressionComponent,
  ExpressionOperator,
  ExpressionToken,
  type ReferencePathComponent,
  ReferencePathIncludeComponent,
  ReferencePathIncludeComponentSpecifier,
  ReferencePathParentComponent,
  SumToken,
  type Token,
  ValueToken as ValueToken,
} from "@lib/generator/dataTokens"
import { DataHunk } from "@lib/generator/patch"
import { getYAML } from "@lib/utils/yamlUtils"
import { bytesFrom, compact, isNotNullish, isNullish, isNumber, isString, numberFrom, reduceDictionaryInto } from "@utils"
import path from "path"

export type ExtraInclude = {
  path: string
  extraIncludes: Dictionary<ExtraInclude | ExtraInclude[]>
  extraValues: Dictionary<string>
} | string

export class PatchInfo {
  
  static readonly maxIncludesPerKey = 255
  
  readonly parent?: PatchInfo
  readonly includePath: string
  readonly index?: number
  readonly includes: Dictionary<PatchInfo | PatchInfo[]>
  readonly values: Dictionary<any[]>
  readonly changes: ChangeInfo[]
  readonly freeLocations: FreeSpace[]
  
  constructor(
    filePath: string,
    extraIncludes: Dictionary<ExtraInclude | ExtraInclude[]> = {},
    extraValues: Dictionary<string> = {},
    parent?: PatchInfo,
    name?: string,
    index?: number,
  ) {
    const searchPaths = (relativePath: string) => {
      return [
        path.resolve(__dirname, "patchSpecs", relativePath),
      ]
    }
    
    const yaml = getYAML(searchPaths(filePath))
    
    while (yaml.extends) {
      const extended = getYAML(searchPaths(yaml.extends))
      yaml.extends = extended.extends
      yaml.includes = { ...extended.includes, ...yaml.includes }
      yaml.values = { ...extended.values, ...yaml.values }
      yaml.changes = [...extended.changes ?? [], ...yaml.changes ?? []]
      yaml.freeSpaces = [...extended.freeSpaces ?? [], ...yaml.freeSpaces ?? []]
    }
    
    this.parent = parent
    this.includePath = compact([parent?.includePath, name, index?.toString()]).join(".")
    this.index = index
    
    this.includes = reduceDictionaryInto(yaml.includes ?? {}, {}, (result, key, value) => {
      result[key] = new PatchInfo(value, {}, {}, this, key)
    })
    
    Object.entries(extraIncludes).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > PatchInfo.maxIncludesPerKey) {
          throw new Error(`Cannot have more than ${PatchInfo.maxIncludesPerKey} includes for key '${key}' of patch '${filePath}'.`)
        }
        
        this.includes[key] = value.map((include: ExtraInclude, index: number) => {
          if (isString(include)) {
            return new PatchInfo(include, {}, {}, this, key, index)
          } else {
            return new PatchInfo(include.path, include.extraIncludes, include.extraValues, this, key, index)
          }
        })
      } else if (isString(value)) {
        return new PatchInfo(value, {}, {}, this, key, index)
      } else {
        return new PatchInfo(value.path, value.extraIncludes, value.extraValues, this, key, index)
      }
    })
    
    const combinedValues = {
      ...yaml.values ?? {},
      ...extraValues,
    }
    
    this.values = reduceDictionaryInto(combinedValues, {}, (result, key, value) => {
      try {
        result[key] = parseTokens(value)
      } catch (error) {
        throw `Error parsing value with name "${key}".\n\n${error}`
      }
    })
    
    this.changes = yaml.changes?.map((change: any) => {
      try {
        return new ChangeInfo(change)
      } catch (error) {
        throw `Error parsing change "${change.value}".\n\n${error}`
      }
    }) ?? []
    
    this.freeLocations = yaml.freeSpaces?.map((space: any) => {
      return new FreeSpace(space)
    }) ?? []
  }
  
  readonly hunks = (romInfo: ROMInfo): DataHunk[] => {
    this.freeLocations.forEach((location) => {
      romInfo.freeSpace(location.offset, location.size)
    })
    
    const hunkFormats = this.changes.flatMap((changeInfo) => { return this.hunkFormatFrom(romInfo, changeInfo) })
    
    const referenceAddresses: Dictionary<number> = {}
    hunkFormats.forEach((hunkFormat) => {
      Object.entries(hunkFormat.dataFormat.referenceOffsets).map(([key, value]) => {
        referenceAddresses[key] = hunkFormat.romOffsets[0].bankAddress() + value
      })
    })
    
    const hunks = hunkFormats.flatMap((hunkFormat) => {
      return hunkFormat.romOffsets.map((romOffset) => {
        return new DataHunk(romOffset, hunkFormat.dataFormat, referenceAddresses)
      })
    })
    
    const includeHunks = Object.values(this.includes).flat().flatMap((include) => { return include.hunks(romInfo) })
    
    return [...hunks, ...includeHunks]
  }
  
  readonly hunkFormatFrom = (romInfo: ROMInfo, changeInfo: ChangeInfo): HunkFormat[] => {
    const romOffsets: ROMOffset[] = []
    const dataFormat = this.dataFormatFromTokens(changeInfo.value)
    const farcalls: HunkFormat[] = []
    
    changeInfo.locations.forEach((location) => {
      if (location instanceof LocationInfo) {
        if (isNotNullish(location.maxSize)) {
          let changeSize = dataFormat.size()
          
          if (location.maxSize < changeSize) {
            const newOffset = romInfo.reserveSpace(dataFormat.size())
            const farcall = ROMInfo.farcall(newOffset)
            romOffsets.push(newOffset)
            
            if (location.freeUnused) {
              farcall.add(ROMInfo.returnInstruction())
            }
            
            changeSize = farcall.size()
            
            if (location.maxSize < changeSize) {
              throw new Error(`Cannot add a farcall to a location with a max size less than '${changeSize}'.`)
            }
            
            farcalls.push(new HunkFormat([location.offset], farcall))
          } else {
            romOffsets.push(location.offset)
          }
          
          if (location.freeUnused) {
            romInfo.freeSpace(new ROMOffset(location.offset.absoluteOffset + changeSize), location.maxSize - changeSize)
          }
        } else {
          romOffsets.push(location.offset)
        }
      } else {
        romOffsets.push(romInfo.reserveSpaceInBank(location, dataFormat.size()))
      }
    })
    
    return [
      new HunkFormat(romOffsets, dataFormat),
      ...farcalls,
    ]
  }

  readonly dataFormatFromTokens = (
    tokens: Token[],
    offset: number = 0
  ): DataFormat => {
    const result = new DataFormat()
    let updatedOffset = offset
    
    tokens.forEach((token) => {
      if (token instanceof SumToken || token instanceof SplitToken) {
        const dataFormat = this.dataFormatFromReference(token.operand.pathComponents, updatedOffset, token.operand, token)
        result.add(dataFormat)
        updatedOffset += dataFormat.size()
      } else if (token instanceof ExpressionToken) {
        result.values.push(...bytesFrom(this.numberFromExpression(token.expression), token.numberOfBytes))
        updatedOffset += token.numberOfBytes
      } else if (token instanceof AddressToken || token instanceof ValueToken) {
        const dataFormat = this.dataFormatFromReference(token.pathComponents, updatedOffset, token)
        result.add(dataFormat)
        updatedOffset += dataFormat.size()
      } else { // token instanceof ByteToken
        result.values.push(token.value)
        updatedOffset += 1
      }
    })
    
    return result
  }

  readonly dataFormatFromReference = (
    referencePath: ReferencePathComponent[],
    offset: number,
    token: ValueToken | AddressToken,
    parentToken?: SumToken | SplitToken,
  ): DataFormat => {
    const component = referencePath[0]
    if (component instanceof ReferencePathParentComponent) {
      if (isNullish(this.parent)) {
        throw new Error(`Attempting to get parent of patch with include path '${this.includePath}'.`)
      }
      
      return this.parent!.dataFormatFromReference(referencePath.slice(1), offset, token, parentToken)
    } else if (component instanceof ReferencePathIncludeComponent) {
      const include = this.includes[component.name]
      if (Array.isArray(include)) {
        switch (component.specifier) {
        case ReferencePathIncludeComponentSpecifier.first: {
          return include[0].dataFormatFromReference(referencePath.slice(1), offset, token, parentToken)
        }
        case ReferencePathIncludeComponentSpecifier.last: {
          return include[include.length - 1].dataFormatFromReference(referencePath.slice(1), offset, token, parentToken)
        }
        default: {
          if (parentToken instanceof SumToken) {
            const values = include.map((item) => {
              const dataFormat = item.dataFormatFromReference(referencePath.slice(1), 0, token)
              
              if (dataFormat.values.find((value) => { return !isNumber(value) })) {
                throw new Error(`Sum token with include path '${this.includePath}' is attempting to sum references that do not resolve to a number.`)
              }
              
              return numberFrom(dataFormat.values as number[])
            })
            
            const sum = values.reduce((a, b) => { return a + b }, 0)
            
            return new DataFormat(bytesFrom(sum, parentToken.numberOfBytes))
          } else {
            let updatedOffset = offset
            let resolvedSeparator: DataFormat
            
            return include.reduce<DataFormat>(
              (result, current, index) => {
                const dataFormat = current.dataFormatFromReference(referencePath.slice(1), updatedOffset, token)
                result.add(dataFormat)
                updatedOffset += dataFormat.size()
                
                if (parentToken instanceof SplitToken) {
                  if (isNullish(resolvedSeparator)) {
                    resolvedSeparator = this.dataFormatFromTokens(parentToken.separator, updatedOffset)
                  }
                  
                  if (index !== include.length - 1) {
                    result.add(resolvedSeparator)
                    updatedOffset += resolvedSeparator.size()
                  }
                }
                
                return result
              },
              new DataFormat(),
            )
          }
        }
        }
      } else {
        return include.dataFormatFromReference(referencePath.slice(1), offset, token, parentToken)
      }
    } else if (component instanceof ReferencePathValueComponent) {
      const path = [this.includePath, "values", component.name].join(".")
      if (token instanceof ValueToken) {
        if (isNullish(this.values[component.name])) {
          throw new Error(`No value provided for ${path}.`)
        }
        
        const result = this.dataFormatFromTokens(this.values[component.name], offset)
        result.referenceOffsets[path] = offset
        return result
      } else { // token instanceof AddressToken
        return new DataFormat([path])
      }
    } else { // component instanceof ReferencePathIndexComponent
      const path = [this.includePath, "index"].join(".")
      if (token instanceof ValueToken) {
        return new DataFormat(
          [this.index ?? 0],
          {
            [path]: offset,
          },
        )
      } else { // token instanceof AddressToken
        return new DataFormat([path])
      }
    }
  }

  readonly numberFromExpression = (expression: ExpressionComponent): number => {
    if (isNumber(expression)) {
      return expression
    } else if (expression instanceof Expression) {
      switch (expression.operator) {
      case ExpressionOperator.addition: {
        return this.numberFromExpression(expression.left) + this.numberFromExpression(expression.right)
      }
      case ExpressionOperator.subtraction: {
        return this.numberFromExpression(expression.left) - this.numberFromExpression(expression.right)
      }
      case ExpressionOperator.multiplication: {
        return this.numberFromExpression(expression.left) * this.numberFromExpression(expression.right)
      }
      case ExpressionOperator.division: {
        const divisor = this.numberFromExpression(expression.right)
        if (divisor === 0) {
          throw new Error("Attempt to divide by zero in expression.")
        }
        return this.numberFromExpression(expression.left) / divisor
      }
      case ExpressionOperator.bitShiftLeft: {
        return this.numberFromExpression(expression.left) << this.numberFromExpression(expression.right)
      }
      case ExpressionOperator.bitShiftRight: {
        return this.numberFromExpression(expression.left) >> this.numberFromExpression(expression.right)
      }
      default: {
        throw new Error(`Unknown operator '${expression.operator}' in expression.`)
      }
      }
    } else { // expression instanceof ValueToken
      const dataFormat = this.dataFormatFromReference(expression.pathComponents, 0, expression)
      
      dataFormat.values.forEach((value) => {
        if (!isNumber(value)) {
          throw new Error(`Found non-numerical value '${value}' in expression.`)
        }
      })
      
      return numberFrom(dataFormat.values as number[])
    }
  }
  
}

class ChangeInfo {
  
  readonly locations: (LocationInfo | number)[]
  readonly value: Token[]
  
  constructor(object: any) {
    this.locations = object.locations.map((item: any) => {
      if (isNotNullish(item.address)) {
        return new LocationInfo(item)
      } else {
        return item.bank
      }
    })
    this.value = parseTokens(object.value)
  }
  
}

class LocationInfo {
  
  readonly offset: ROMOffset
  readonly maxSize?: number
  readonly freeUnused: boolean
  
  constructor(object: any) {
    this.offset = ROMOffset.fromBankAddress(object.bank, object.address)
    this.maxSize = object.maxSize
    this.freeUnused = object.freeUnused ?? false
  }
  
}

class FreeSpace {
  
  readonly offset: ROMOffset
  readonly size: number
  
  constructor(object: any) {
    this.offset = ROMOffset.fromBankAddress(object.bank, object.address)
    this.size = object.size
  }
  
}

class HunkFormat {
  
  readonly romOffsets: ROMOffset[]
  readonly dataFormat: DataFormat
  
  constructor(
    romOffsets: ROMOffset[],
    dataFormat: DataFormat,
  ) {
    this.romOffsets = romOffsets
    this.dataFormat = dataFormat
  }
  
}

export class DataFormat {
  
  values: (number | string)[]
  referenceOffsets: Dictionary<number>
  
  constructor(values: (number | string)[] = [], referenceOffsets: Dictionary<number> = {}) {
    this.values = values
    this.referenceOffsets = referenceOffsets
  }
  
  readonly add = (dataFormat: DataFormat) => {
    this.values.push(...dataFormat.values)
    this.referenceOffsets = { ...dataFormat.referenceOffsets, ...this.referenceOffsets }
  }
  
  readonly size = (): number => {
    return this.values.reduce(
      (result: number, value) => {
        if (isNumber(value)) {
          return result + 1
        } else {
          return result + 2
        }
      },
      0,
    )
  }
  
  readonly toString = (): string => {
    return this.values.map((value) => { return value.toString(16).padStart(2, "0") }).join(" ").toUpperCase()
  }
  
}