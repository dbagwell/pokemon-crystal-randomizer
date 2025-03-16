import type { DataHunk } from "@lib/generator/patch"
import { DataFormat } from "@lib/generator/patchInfo"
import { encounters } from "@shared/gameData/encounters"
import { itemLocationsMap } from "@shared/gameData/itemLocations"
import { mapObjectEvents } from "@shared/gameData/mapObjectEvents"
import { martsMap } from "@shared/gameData/marts"
import { oddEggs } from "@shared/gameData/oddEggs"
import { pokemonMap } from "@shared/gameData/pokemon"
import { teachableMovesMap } from "@shared/gameData/teachableMoves"
import { tradesMap } from "@shared/gameData/trades"
import { trainers } from "@shared/gameData/trainers"
import { eventPokemonMap } from "@shared/types/gameData/eventPokemon"
import type { GameData } from "@shared/types/gameData/gameData"
import { bytesFrom } from "@utils"

export class ROMInfo {
  
  emptyHunks: Hunk[]
  patchHunks: DataHunk[]
  gameData: GameData
  
  constructor(emptyHunks: Hunk[]) {
    this.emptyHunks = emptyHunks
    this.patchHunks = []
    this.gameData = {
      pokemon: JSON.parse(JSON.stringify(pokemonMap)),
      starters: {},
      encounters: JSON.parse(JSON.stringify(encounters)),
      oddEggs: JSON.parse(JSON.stringify(oddEggs)),
      eventPokemon: JSON.parse(JSON.stringify(eventPokemonMap)),
      trades: JSON.parse(JSON.stringify(tradesMap)),
      teachableMoves: JSON.parse(JSON.stringify(teachableMovesMap)),
      trainers: JSON.parse(JSON.stringify(trainers)),
      mapObjectEvents: JSON.parse(JSON.stringify(mapObjectEvents)),
      marts: JSON.parse(JSON.stringify(martsMap)),
      itemLocations: JSON.parse(JSON.stringify(itemLocationsMap)),
    }
  }
  
  static readonly vanillaMD5Hash = "301899b8087289a6436b0a241fbbb474"
  static readonly bankSize = 0x4000
  static readonly numberOfBanks = 128
  static readonly size = this.numberOfBanks * this.bankSize
  
  static readonly vanilla = (): ROMInfo => {
    return new ROMInfo([
      new Hunk(ROMOffset.fromBankAddress(0, 0x3fb5), 0x004B),
      new Hunk(ROMOffset.fromBankAddress(1, 0x747B), 0x0B85),
      new Hunk(ROMOffset.fromBankAddress(2, 0x7829), 0x07D7),
      new Hunk(ROMOffset.fromBankAddress(3, 0x7A0B), 0x05F5),
      new Hunk(ROMOffset.fromBankAddress(4, 0x7D96), 0x026A),
      new Hunk(ROMOffset.fromBankAddress(5, 0x74BA), 0x0B46),
      new Hunk(ROMOffset.fromBankAddress(6, 0x7DFE), 0x0202),
      new Hunk(ROMOffset.fromBankAddress(7, 0x7F6C), 0x0094),
      new Hunk(ROMOffset.fromBankAddress(8, 0x7F51), 0x00AF),
      new Hunk(ROMOffset.fromBankAddress(9, 0x7A2D), 0x05D3),
      new Hunk(ROMOffset.fromBankAddress(10, 0x7CEA), 0x0316),
      new Hunk(ROMOffset.fromBankAddress(11, 0x6F9F), 0x1061),
      new Hunk(ROMOffset.fromBankAddress(12, 0x73F0), 0x0C10),
      new Hunk(ROMOffset.fromBankAddress(13, 0x7EE2), 0x011E),
      new Hunk(ROMOffset.fromBankAddress(14, 0x7A67), 0x0599),
      new Hunk(ROMOffset.fromBankAddress(15, 0x7E86), 0x017A),
      new Hunk(ROMOffset.fromBankAddress(16, 0x7C5C), 0x03A4),
      new Hunk(ROMOffset.fromBankAddress(17, 0x4997), 0x3669),
      new Hunk(ROMOffset.fromBankAddress(18, 0x6E78), 0x1188),
      new Hunk(ROMOffset.fromBankAddress(19, 0x731C), 0x0CE4),
      new Hunk(ROMOffset.fromBankAddress(20, 0x7E2E), 0x01D2),
      new Hunk(ROMOffset.fromBankAddress(21, 0x7322), 0x0CDE),
      new Hunk(ROMOffset.fromBankAddress(22, 0x7712), 0x08EE),
      new Hunk(ROMOffset.fromBankAddress(23, 0x7099), 0x0F67),
      new Hunk(ROMOffset.fromBankAddress(24, 0x728E), 0x0D72),
      new Hunk(ROMOffset.fromBankAddress(25, 0x7308), 0x0CF8),
      new Hunk(ROMOffset.fromBankAddress(26, 0x7A67), 0x0599),
      new Hunk(ROMOffset.fromBankAddress(27, 0x76A4), 0x095C),
      new Hunk(ROMOffset.fromBankAddress(28, 0x76ED), 0x0913),
      new Hunk(ROMOffset.fromBankAddress(29, 0x7282), 0x0D7E),
      new Hunk(ROMOffset.fromBankAddress(30, 0x76A8), 0x0958),
      new Hunk(ROMOffset.fromBankAddress(31, 0x7628), 0x09D8),
      new Hunk(ROMOffset.fromBankAddress(32, 0x63C8), 0x1C38),
      new Hunk(ROMOffset.fromBankAddress(33, 0x68F7), 0x1709),
      new Hunk(ROMOffset.fromBankAddress(34, 0x7A24), 0x05DC),
      new Hunk(ROMOffset.fromBankAddress(35, 0x7F0D), 0x00F3),
      new Hunk(ROMOffset.fromBankAddress(36, 0x7A3D), 0x05C3),
      new Hunk(ROMOffset.fromBankAddress(37, 0x7F7E), 0x0082),
      new Hunk(ROMOffset.fromBankAddress(38, 0x7BF8), 0x0408),
      new Hunk(ROMOffset.fromBankAddress(39, 0x7BB2), 0x044E),
      new Hunk(ROMOffset.fromBankAddress(40, 0x5ECA), 0x2136),
      new Hunk(ROMOffset.fromBankAddress(41, 0x64AD), 0x1B53),
      new Hunk(ROMOffset.fromBankAddress(42, 0x7FAB), 0x0055),
      new Hunk(ROMOffset.fromBankAddress(43, 0x7F5A), 0x00A6),
      new Hunk(ROMOffset.fromBankAddress(44, 0x5B42), 0x24BE),
      new Hunk(ROMOffset.fromBankAddress(45, 0x7EA8), 0x0158),
      new Hunk(ROMOffset.fromBankAddress(46, 0x5E8B), 0x2175),
      new Hunk(ROMOffset.fromBankAddress(47, 0x6699), 0x1967),
      new Hunk(ROMOffset.fromBankAddress(48, 0x7FC0), 0x0040),
      new Hunk(ROMOffset.fromBankAddress(49, 0x7F80), 0x0080),
      new Hunk(ROMOffset.fromBankAddress(50, 0x7E2E), 0x01D2),
      new Hunk(ROMOffset.fromBankAddress(51, 0x7F04), 0x00FC),
      new Hunk(ROMOffset.fromBankAddress(52, 0x7C33), 0x03CD),
      new Hunk(ROMOffset.fromBankAddress(53, 0x6240), 0x1DC0),
      new Hunk(ROMOffset.fromBankAddress(54, 0x5C66), 0x239A),
      new Hunk(ROMOffset.fromBankAddress(55, 0x7D90), 0x0270),
      new Hunk(ROMOffset.fromBankAddress(56, 0x77F9), 0x0807),
      new Hunk(ROMOffset.fromBankAddress(57, 0x7A6D), 0x0593),
      new Hunk(ROMOffset.fromBankAddress(58, 0x7FC3), 0x003D),
      new Hunk(ROMOffset.fromBankAddress(59, 0x7EF5), 0x010B),
      new Hunk(ROMOffset.fromBankAddress(60, 0x7FB6), 0x004A),
      new Hunk(ROMOffset.fromBankAddress(61, 0x7EF3), 0x010D),
      new Hunk(ROMOffset.fromBankAddress(62, 0x7E91), 0x016F),
      new Hunk(ROMOffset.fromBankAddress(63, 0x51D2), 0x2E2E),
      new Hunk(ROMOffset.fromBankAddress(64, 0x789D), 0x0763),
      new Hunk(ROMOffset.fromBankAddress(65, 0x6DBD), 0x1243),
      new Hunk(ROMOffset.fromBankAddress(66, 0x7650), 0x09B0),
      new Hunk(ROMOffset.fromBankAddress(67, 0x7F5E), 0x00A2),
      new Hunk(ROMOffset.fromBankAddress(68, 0x7F84), 0x007C),
      new Hunk(ROMOffset.fromBankAddress(69, 0x7CE2), 0x031E),
      new Hunk(ROMOffset.fromBankAddress(70, 0x7C9E), 0x0362),
      new Hunk(ROMOffset.fromBankAddress(71, 0x7686), 0x097A),
      new Hunk(ROMOffset.fromBankAddress(72, 0x7FFA), 0x0006),
      new Hunk(ROMOffset.fromBankAddress(73, 0x7FFE), 0x0002),
      new Hunk(ROMOffset.fromBankAddress(74, 0x7FFE), 0x0002),
      new Hunk(ROMOffset.fromBankAddress(75, 0x7FF7), 0x0009),
      new Hunk(ROMOffset.fromBankAddress(80, 0x7FFB), 0x0005),
      new Hunk(ROMOffset.fromBankAddress(83, 0x7FE3), 0x001D),
      new Hunk(ROMOffset.fromBankAddress(85, 0x7FFA), 0x0006),
      new Hunk(ROMOffset.fromBankAddress(87, 0x7FFC), 0x0004),
      new Hunk(ROMOffset.fromBankAddress(89, 0x69D3), 0x162D),
      new Hunk(ROMOffset.fromBankAddress(90, 0x69D3), 0x162D),
      new Hunk(ROMOffset.fromBankAddress(91, 0x57FE), 0x2802),
      new Hunk(ROMOffset.fromBankAddress(92, 0x768C), 0x0974),
      new Hunk(ROMOffset.fromBankAddress(93, 0x7561), 0x0A9F),
      new Hunk(ROMOffset.fromBankAddress(94, 0x7639), 0x09C7),
      new Hunk(ROMOffset.fromBankAddress(95, 0x7F6C), 0x0094),
      new Hunk(ROMOffset.fromBankAddress(96, 0x71A2), 0x0E5E),
      new Hunk(ROMOffset.fromBankAddress(97, 0x647F), 0x1B81),
      new Hunk(ROMOffset.fromBankAddress(98, 0x7778), 0x0888),
      new Hunk(ROMOffset.fromBankAddress(99, 0x7441), 0x0BBF),
      new Hunk(ROMOffset.fromBankAddress(100, 0x7688), 0x0978),
      new Hunk(ROMOffset.fromBankAddress(101, 0x76C0), 0x0940),
      new Hunk(ROMOffset.fromBankAddress(102, 0x7AC7), 0x0539),
      new Hunk(ROMOffset.fromBankAddress(103, 0x7643), 0x09BD),
      new Hunk(ROMOffset.fromBankAddress(104, 0x70B1), 0x0F4F),
      new Hunk(ROMOffset.fromBankAddress(105, 0x7337), 0x0CC9),
      new Hunk(ROMOffset.fromBankAddress(106, 0x788A), 0x0776),
      new Hunk(ROMOffset.fromBankAddress(107, 0x6796), 0x186A),
      new Hunk(ROMOffset.fromBankAddress(108, 0x60B3), 0x1F4D),
      new Hunk(ROMOffset.fromBankAddress(109, 0x7633), 0x09CD),
      new Hunk(ROMOffset.fromBankAddress(110, 0x5ADB), 0x2525),
      new Hunk(ROMOffset.fromBankAddress(111, 0x608D), 0x1F73),
      new Hunk(ROMOffset.fromBankAddress(112, 0x5EC9), 0x2137),
      new Hunk(ROMOffset.fromBankAddress(113, 0x611E), 0x1EE2),
      new Hunk(ROMOffset.fromBankAddress(114, 0x6ECD), 0x1133),
      new Hunk(ROMOffset.fromBankAddress(115, 0x5B51), 0x24AF),
      new Hunk(ROMOffset.fromBankAddress(116, 0x5931), 0x26CF),
      new Hunk(ROMOffset.fromBankAddress(117, 0x7238), 0x0DC8),
      new Hunk(ROMOffset.fromBankAddress(120, 0x5000), 0x3000),
      new Hunk(ROMOffset.fromBankAddress(121, 0x4F02), 0x30FE),
      new Hunk(ROMOffset.fromBankAddress(124, 0x49D8), 0x3628),
      new Hunk(ROMOffset.fromBankAddress(125, 0x636A), 0x1C96),
      new Hunk(ROMOffset.fromBankAddress(126, 0x78A8), 0x0758),
      new Hunk(ROMOffset.fromBankAddress(127, 0x4000), 0x3DE0),
    ])
  }
  
  static readonly displayCharacterBytesFrom = (string: string): number[] => {
    return [...string].map((character: string) => {
      const number = parseInt(character)
      if (!isNaN(number)) {
        return 0xF6 + number
      } else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(character)) {
        return 0x80 + character.charCodeAt(0) - 65
      } else if ("abcdefghijklmnopqrstuvwxyz".includes(character)) {
        return 0xA0 + character.charCodeAt(0) - 97
      } else if (character === "(") {
        return 0x9A
      } else if (character === ")") {
        return 0x9B
      } else if (character === ":") {
        return 0x9C
      } else if (character === ";") {
        return 0x9D
      } else if (character === "[") {
        return 0x9E
      } else if (character === "]") {
        return 0x9F
      } else if (character === "<") { // PK
        return 0xE1
      } else if (character === ">") { // MN
        return 0xE2
      } else if (character === "-") {
        return 0xE3
      } else if (character === "?") {
        return 0xE6
      } else if (character === "!") {
        return 0xE7
      } else if (character === ".") {
        return 0xE8
      } else if (character === "×") {
        return 0xF1
      } else if (character === "/") {
        return 0xF3
      } else if (character === ",") {
        return 0xF4
      } else if (character === "@") {
        return 0x50
      } else {
        return 0x7F // Treat unmapped characters as spaces.
      }
    })
  }
  
  static readonly returnInstruction = () => {
    return new DataFormat([0xC9])
  }
  
  static readonly farcall = (offset: ROMOffset): DataFormat => {
    return new DataFormat([0xF5, 0xE5, 0x3E, offset.bank(), 0x21, ...bytesFrom(offset.bankAddress(), 2), 0xCF, 0xE1, 0xF1])
  }
  
  readonly reserveSpace = (size: number): ROMOffset => {
    const hunkIndex = this.emptyHunks.slice().sort((a, b) => { return a.size - b.size }).findIndex((hunk) => { return size <= hunk.size })
      
    if (hunkIndex === -1) {
      throw new Error(`There are no empty hunks of size '${size}' or greater.`)
    }
    
    return this.reserveSpaceFromHunk(hunkIndex, size)
  }
  
  readonly reserveSpaceInBank = (bank: number, size: number): ROMOffset => {
    const hunkIndex = this.emptyHunks.findIndex((hunk) => { return hunk.offset.bank() === bank && size <= hunk.size })
      
    if (hunkIndex === -1) {
      throw new Error(`There are no empty hunks of size '${size}' or greater in bank '${bank}'.`)
    }
    
    return this.reserveSpaceFromHunk(hunkIndex, size)
  }
  
  private readonly reserveSpaceFromHunk = (index: number, size: number): ROMOffset => {
    const hunk = this.emptyHunks[index]
    this.emptyHunks[index] = new Hunk(new ROMOffset(hunk.offset.absoluteOffset + size), hunk.size - size)
    return hunk.offset
  }
  
  readonly freeSpace = (offset: ROMOffset, size: number) => {
    const endOffset = new ROMOffset(offset.absoluteOffset + size)
    
    let currentOffset = offset
    
    while (currentOffset.absoluteOffset <= endOffset.absoluteOffset && currentOffset.absoluteOffset < ROMInfo.size) {
      const currentSize = Math.min(offset.absoluteOffset + size, ROMInfo.bankSize * currentOffset.bank() + ROMInfo.bankSize) - currentOffset.absoluteOffset
      const hunkIndex = this.emptyHunks.findIndex((hunk) => { return hunk.offset.bank() === currentOffset.bank() && hunk.overlapsWith(new Hunk(currentOffset, currentSize)) })
      
      if (hunkIndex !== -1) {
        const hunk = this.emptyHunks[hunkIndex]
        const newOffset = new ROMOffset(Math.min(hunk.offset.absoluteOffset, currentOffset.absoluteOffset))
        this.emptyHunks[hunkIndex] = new Hunk(newOffset, Math.max(hunk.offset.absoluteOffset + hunk.size, currentOffset.absoluteOffset + currentSize) - newOffset.absoluteOffset)
      } else {
        this.emptyHunks.push(new Hunk(currentOffset, currentSize))
      }
      
      currentOffset = ROMOffset.fromBankOffset(currentOffset.bank() + 1, 0)
    }
  }
  
}

export class Hunk {
  
  readonly offset: ROMOffset
  readonly size: number
  
  constructor(offset: ROMOffset, size: number) {
    this.offset = offset
    this.size = size
  }
  
  readonly overlapsWith = (hunk: Hunk): boolean => {
    return this.offset.absoluteOffset > hunk.offset.absoluteOffset && this.offset.absoluteOffset < hunk.offset.absoluteOffset + hunk.size
      || hunk.offset.absoluteOffset > this.offset.absoluteOffset && hunk.offset.absoluteOffset < this.offset.absoluteOffset + this.size
  }
  
}

export class ROMOffset {
  
  readonly absoluteOffset: number
  
  constructor(absoluteOffset: number) {
    this.absoluteOffset = absoluteOffset
  }
  
  static readonly fromBankOffset = (bank: number, bankOffset: number) => {
    return new ROMOffset(bank * ROMInfo.bankSize + bankOffset)
  }
  
  static readonly fromBankAddress = (bank: number, bankAddress: number) => {
    if (bank === 0) {
      return new ROMOffset(bankAddress)
    } else {
      return new ROMOffset(bank * ROMInfo.bankSize + bankAddress - ROMInfo.bankSize)
    }
  }
  
  readonly bank = (): number => {
    return Math.floor(this.absoluteOffset / ROMInfo.bankSize)
  }
  
  readonly bankAddress = (): number => {
    if (this.bank() === 0) {
      return this.absoluteOffset
    } else {
      return this.absoluteOffset % ROMInfo.bankSize + ROMInfo.bankSize
    }
  }
  
}