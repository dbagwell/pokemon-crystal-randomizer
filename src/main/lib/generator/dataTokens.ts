import dataFormatGrammar from "@lib/grammars/dataGrammar.mjs"
import { isNullish, isNumber } from "@utils"
import nearley from "nearley"

export const parseTokens = (value: string): Token[] => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(dataFormatGrammar))
  parser.feed(value)
  return tokensFrom(parser.results[0])
}

const tokensFrom = (tokens: any[]): Token[] => {
  return tokens.map((token) => { return tokenFrom(token) })
}

const tokenFrom = (token: any): Token => {
  switch (token.type) {
  case "sum": {
    return new SumToken(token)
  }
  case "split": {
    return new SplitToken(token)
  }
  case "expression": {
    return new ExpressionToken(token)
  }
  case "address": {
    return new AddressToken(token)
  }
  case "value": {
    return new ValueToken(token)
  }
  case "byte": {
    return new ByteToken(token)
  }
  default: {
    throw new Error(`Unexpected token type '${token.type}'.`)
  }
  }
}

export type Token = SumToken | SplitToken | ExpressionToken | ValueToken | AddressToken | ByteToken

export class SumToken {
  
  readonly numberOfBytes: number
  readonly operand: ValueToken
  
  constructor(object: any) {
    this.numberOfBytes = object.numberOfBytes
    this.operand = new ValueToken(object.operand)
  }
  
}

export class SplitToken {
  
  readonly separator: Token[]
  readonly operand: ValueToken | AddressToken
  
  constructor(object: any) {
    this.separator = tokensFrom(object.separator)
    try {
      this.operand = new ValueToken(object.operand)
    } catch {
      this.operand = new AddressToken(object.operand)
    }
  }
  
}

export class ExpressionToken {
  
  readonly numberOfBytes: number
  readonly expression: ExpressionComponent
  
  constructor(object: any) {
    this.numberOfBytes = object.numberOfBytes
    this.expression = expressionComponentFrom(object.expression)
  }

}

const expressionComponentFrom = (component: any): ExpressionComponent => {
  if (isNumber(component)) {
    return component
  } else if (isNullish(component.operator)) {
    return new ValueToken(component)
  } else {
    return new Expression(component)
  }
}

export type ExpressionComponent = number | ValueToken | Expression

export class Expression {
  
  readonly left: ExpressionComponent
  readonly operator: ExpressionOperator
  readonly right: ExpressionComponent
  
  constructor(object: any) {
    this.left = expressionComponentFrom(object.left)
    this.operator = object.operator
    this.right = expressionComponentFrom(object.right)
  }

}

export enum ExpressionOperator {
  addition = "+",
  subtraction = "-",
  multiplication = "*",
  division = "/",
  bitShiftLeft = "<<",
  bitShiftRight = ">>",
}

export class AddressToken {
  
  readonly pathComponents: ReferencePathComponent[]
  
  constructor(object: any) {
    this.pathComponents = referencePathComponentsFrom(object.path)
  }

}

export class ValueToken {

  readonly pathComponents: ReferencePathComponent[]
  
  constructor(object: any) {
    this.pathComponents = referencePathComponentsFrom(object.path)
  }

}

const referencePathComponentsFrom = (components: any[]) => {
  return components.map((component) => { return referencePathComponentFrom(component) })
}

const referencePathComponentFrom = (component: any) => {
  switch (component.type) {
  case "parent": {
    return new ReferencePathParentComponent()
  }
  case "include": {
    return new ReferencePathIncludeComponent(component)
  }
  case "index": {
    return new ReferencePathIndexComponent()
  }
  case "value": {
    return new ReferencePathValueComponent(component)
  }
  default: {
    throw new Error(`Unexpected reference path component type '${component.type}'.`)
  }
  }
}

export type ReferencePathComponent = ReferencePathParentComponent | ReferencePathIncludeComponent | ReferencePathValueComponent | ReferencePathIndexComponent

export class ReferencePathParentComponent {
  
  constructor() {}
  
}

export class ReferencePathIncludeComponent {
  
  readonly name: string
  readonly specifier?: ReferencePathIncludeComponentSpecifier
  
  constructor(object: any) {
    this.name = object.name
    this.specifier = object.specifier
  }
  
}

export enum ReferencePathIncludeComponentSpecifier {
  first = "first",
  last = "last",
}

export class ReferencePathValueComponent {
  
  readonly name: string
  
  constructor(object: any) {
    this.name = object.name
  }
  
}

export class ReferencePathIndexComponent {
  
  constructor() {}
  
}

export class ByteToken {
  
  readonly value: number
  
  constructor(object: any) {
    this.value = object.value
  }
  
}