import { encounters } from "@shared/gameData/encounters"
import { itemLocationsMap } from "@shared/gameData/itemLocations"
import { itemsMap } from "@shared/gameData/items"
import { logicalAccessAreasMap } from "@shared/gameData/logicalAccessAreas"
import { mapObjectEvents } from "@shared/gameData/mapObjectEvents"
import { martGroupsMap } from "@shared/gameData/martGroups"
import { martsMap, specialShopsMap } from "@shared/gameData/marts"
import { oddEggs } from "@shared/gameData/oddEggs"
import { pokemonMap } from "@shared/gameData/pokemon"
import { teachableMovesMap } from "@shared/gameData/teachableMoves"
import { tradesMap } from "@shared/gameData/trades"
import { trainers } from "@shared/gameData/trainers"
import { warpsMap } from "@shared/gameData/warps"
import { DataFormat } from "@shared/romUtils/dataFormat"
import type { DataHunk } from "@shared/romUtils/dataHunk"
import { eventPokemonMap } from "@shared/types/gameData/eventPokemon"
import type { GameData } from "@shared/types/gameData/gameData"
import { bytesFrom } from "@utils"

export type ROMInfo = {
  emptyHunks: Hunk[]
  patchHunks: DataHunk[]
  gameData: GameData
}

export const romBankSize = 0x4000
const numberOfBanksInROM = 128
export const romSize = numberOfBanksInROM * romBankSize

export const defaultROMInfo = (): ROMInfo => {
  return {
    emptyHunks: [
      { offset: romOffsetFromBankAddress(0, 0x0547), size: 11 },
      { offset: romOffsetFromBankAddress(0, 0x308D), size: 16 },
      { offset: romOffsetFromBankAddress(0, 0x3ED7), size: 19 },
      { offset: romOffsetFromBankAddress(0, 0x048C), size: 23 },
      { offset: romOffsetFromBankAddress(0, 0x392D), size: 24 },
      { offset: romOffsetFromBankAddress(0, 0x0A1B), size: 27 },
      { offset: romOffsetFromBankAddress(0, 0x3EFD), size: 35 },
      { offset: romOffsetFromBankAddress(0, 0x36F5), size: 35 },
      { offset: romOffsetFromBankAddress(0, 0x19B8), size: 49 },
      { offset: romOffsetFromBankAddress(0, 0x3D9F), size: 63 },
      { offset: romOffsetFromBankAddress(0, 0x3F88), size: 0x004B },
      { offset: romOffsetFromBankAddress(0, 0x0DFD), size: 77 },
      { offset: romOffsetFromBankAddress(1, 0x747B), size: 0x0B85 },
      { offset: romOffsetFromBankAddress(2, 0x7829), size: 0x07D7 },
      { offset: romOffsetFromBankAddress(3, 0x7A0B), size: 0x05F5 },
      { offset: romOffsetFromBankAddress(4, 0x7D96), size: 0x026A },
      { offset: romOffsetFromBankAddress(5, 0x74BA), size: 0x0B46 },
      { offset: romOffsetFromBankAddress(6, 0x7DFE), size: 0x0202 },
      { offset: romOffsetFromBankAddress(7, 0x7F6C), size: 0x0094 },
      { offset: romOffsetFromBankAddress(8, 0x7F51), size: 0x00AF },
      { offset: romOffsetFromBankAddress(9, 0x7A2D), size: 0x05D3 },
      { offset: romOffsetFromBankAddress(10, 0x7CEA), size: 0x0316 },
      { offset: romOffsetFromBankAddress(11, 0x6F9F), size: 0x1061 },
      { offset: romOffsetFromBankAddress(12, 0x73F0), size: 0x0C10 },
      { offset: romOffsetFromBankAddress(13, 0x7EE2), size: 0x011E },
      { offset: romOffsetFromBankAddress(14, 0x7A67), size: 0x0599 },
      { offset: romOffsetFromBankAddress(15, 0x7E86), size: 0x017A },
      { offset: romOffsetFromBankAddress(16, 0x7C5C), size: 0x03A4 },
      { offset: romOffsetFromBankAddress(17, 0x4997), size: 0x3669 },
      { offset: romOffsetFromBankAddress(18, 0x6E78), size: 0x1188 },
      { offset: romOffsetFromBankAddress(19, 0x731C), size: 0x0CE4 },
      { offset: romOffsetFromBankAddress(20, 0x7E2E), size: 0x01D2 },
      { offset: romOffsetFromBankAddress(21, 0x7322), size: 0x0CDE },
      { offset: romOffsetFromBankAddress(22, 0x7712), size: 0x08EE },
      { offset: romOffsetFromBankAddress(23, 0x7099), size: 0x0F67 },
      { offset: romOffsetFromBankAddress(24, 0x728E), size: 0x0D72 },
      { offset: romOffsetFromBankAddress(25, 0x7308), size: 0x0CF8 },
      { offset: romOffsetFromBankAddress(26, 0x7A67), size: 0x0599 },
      { offset: romOffsetFromBankAddress(27, 0x76A4), size: 0x095C },
      { offset: romOffsetFromBankAddress(28, 0x76ED), size: 0x0913 },
      { offset: romOffsetFromBankAddress(29, 0x7282), size: 0x0D7E },
      { offset: romOffsetFromBankAddress(30, 0x76A8), size: 0x0958 },
      { offset: romOffsetFromBankAddress(31, 0x7628), size: 0x09D8 },
      { offset: romOffsetFromBankAddress(32, 0x63C8), size: 0x1C38 },
      { offset: romOffsetFromBankAddress(33, 0x68F7), size: 0x1709 },
      { offset: romOffsetFromBankAddress(34, 0x7A24), size: 0x05DC },
      { offset: romOffsetFromBankAddress(35, 0x7F0D), size: 0x00F3 },
      { offset: romOffsetFromBankAddress(36, 0x7A3D), size: 0x05C3 },
      { offset: romOffsetFromBankAddress(37, 0x7F7E), size: 0x0082 },
      { offset: romOffsetFromBankAddress(38, 0x7BF8), size: 0x0408 },
      { offset: romOffsetFromBankAddress(39, 0x7BB2), size: 0x044E },
      { offset: romOffsetFromBankAddress(40, 0x5ECA), size: 0x2136 },
      { offset: romOffsetFromBankAddress(41, 0x64AD), size: 0x1B53 },
      { offset: romOffsetFromBankAddress(42, 0x7FAB), size: 0x0055 },
      { offset: romOffsetFromBankAddress(43, 0x7F5A), size: 0x00A6 },
      { offset: romOffsetFromBankAddress(44, 0x5B42), size: 0x24BE },
      { offset: romOffsetFromBankAddress(45, 0x7EA8), size: 0x0158 },
      { offset: romOffsetFromBankAddress(46, 0x5E8B), size: 0x2175 },
      { offset: romOffsetFromBankAddress(47, 0x6699), size: 0x1967 },
      { offset: romOffsetFromBankAddress(48, 0x7FC0), size: 0x0040 },
      { offset: romOffsetFromBankAddress(49, 0x7F80), size: 0x0080 },
      { offset: romOffsetFromBankAddress(50, 0x7E2E), size: 0x01D2 },
      { offset: romOffsetFromBankAddress(51, 0x7F04), size: 0x00FC },
      { offset: romOffsetFromBankAddress(52, 0x7C33), size: 0x03CD },
      { offset: romOffsetFromBankAddress(53, 0x6240), size: 0x1DC0 },
      { offset: romOffsetFromBankAddress(54, 0x5C66), size: 0x239A },
      { offset: romOffsetFromBankAddress(55, 0x7D90), size: 0x0270 },
      { offset: romOffsetFromBankAddress(56, 0x77F9), size: 0x0807 },
      { offset: romOffsetFromBankAddress(57, 0x7A6D), size: 0x0593 },
      { offset: romOffsetFromBankAddress(58, 0x7FC3), size: 0x003D },
      { offset: romOffsetFromBankAddress(59, 0x7EF5), size: 0x010B },
      { offset: romOffsetFromBankAddress(60, 0x7FB6), size: 0x004A },
      { offset: romOffsetFromBankAddress(61, 0x7EF3), size: 0x010D },
      { offset: romOffsetFromBankAddress(62, 0x7E91), size: 0x016F },
      { offset: romOffsetFromBankAddress(63, 0x51D2), size: 0x2E2E },
      { offset: romOffsetFromBankAddress(64, 0x789D), size: 0x0763 },
      { offset: romOffsetFromBankAddress(65, 0x6DBD), size: 0x1243 },
      { offset: romOffsetFromBankAddress(66, 0x7650), size: 0x09B0 },
      { offset: romOffsetFromBankAddress(67, 0x7F5E), size: 0x00A2 },
      { offset: romOffsetFromBankAddress(68, 0x7F84), size: 0x007C },
      { offset: romOffsetFromBankAddress(69, 0x7CE2), size: 0x031E },
      { offset: romOffsetFromBankAddress(70, 0x7C9E), size: 0x0362 },
      { offset: romOffsetFromBankAddress(71, 0x7686), size: 0x097A },
      { offset: romOffsetFromBankAddress(72, 0x7FFA), size: 0x0006 },
      { offset: romOffsetFromBankAddress(73, 0x7FFE), size: 0x0002 },
      { offset: romOffsetFromBankAddress(74, 0x7FFE), size: 0x0002 },
      { offset: romOffsetFromBankAddress(75, 0x7FF7), size: 0x0009 },
      { offset: romOffsetFromBankAddress(80, 0x7FFB), size: 0x0005 },
      { offset: romOffsetFromBankAddress(83, 0x7FE3), size: 0x001D },
      { offset: romOffsetFromBankAddress(85, 0x7FFA), size: 0x0006 },
      { offset: romOffsetFromBankAddress(87, 0x7FFC), size: 0x0004 },
      { offset: romOffsetFromBankAddress(89, 0x69D3), size: 0x162D },
      { offset: romOffsetFromBankAddress(90, 0x69D3), size: 0x162D },
      { offset: romOffsetFromBankAddress(91, 0x57FE), size: 0x2802 },
      { offset: romOffsetFromBankAddress(92, 0x768C), size: 0x0974 },
      { offset: romOffsetFromBankAddress(93, 0x7561), size: 0x0A9F },
      { offset: romOffsetFromBankAddress(94, 0x7639), size: 0x09C7 },
      { offset: romOffsetFromBankAddress(95, 0x7F6C), size: 0x0094 },
      { offset: romOffsetFromBankAddress(96, 0x71A2), size: 0x0E5E },
      { offset: romOffsetFromBankAddress(97, 0x647F), size: 0x1B81 },
      { offset: romOffsetFromBankAddress(98, 0x7778), size: 0x0888 },
      { offset: romOffsetFromBankAddress(99, 0x7441), size: 0x0BBF },
      { offset: romOffsetFromBankAddress(100, 0x7688), size: 0x0978 },
      { offset: romOffsetFromBankAddress(101, 0x76C0), size: 0x0940 },
      { offset: romOffsetFromBankAddress(102, 0x7AC7), size: 0x0539 },
      { offset: romOffsetFromBankAddress(103, 0x7643), size: 0x09BD },
      { offset: romOffsetFromBankAddress(104, 0x70B1), size: 0x0F4F },
      { offset: romOffsetFromBankAddress(105, 0x7337), size: 0x0CC9 },
      { offset: romOffsetFromBankAddress(106, 0x788A), size: 0x0776 },
      { offset: romOffsetFromBankAddress(107, 0x6796), size: 0x186A },
      { offset: romOffsetFromBankAddress(108, 0x60B3), size: 0x1F4D },
      { offset: romOffsetFromBankAddress(109, 0x7633), size: 0x09CD },
      { offset: romOffsetFromBankAddress(110, 0x5ADB), size: 0x2525 },
      { offset: romOffsetFromBankAddress(111, 0x608D), size: 0x1F73 },
      { offset: romOffsetFromBankAddress(112, 0x5EC9), size: 0x2137 },
      { offset: romOffsetFromBankAddress(113, 0x611E), size: 0x1EE2 },
      { offset: romOffsetFromBankAddress(114, 0x6ECD), size: 0x1133 },
      { offset: romOffsetFromBankAddress(115, 0x5B51), size: 0x24AF },
      { offset: romOffsetFromBankAddress(116, 0x5931), size: 0x26CF },
      { offset: romOffsetFromBankAddress(117, 0x7238), size: 0x0DC8 },
      { offset: romOffsetFromBankAddress(120, 0x5000), size: 0x3000 },
      { offset: romOffsetFromBankAddress(121, 0x4F02), size: 0x30FE },
      { offset: romOffsetFromBankAddress(124, 0x49D8), size: 0x3628 },
      { offset: romOffsetFromBankAddress(125, 0x636A), size: 0x1C96 },
      { offset: romOffsetFromBankAddress(126, 0x78A8), size: 0x0758 },
      { offset: romOffsetFromBankAddress(127, 0x4000), size: 0x3DE0 },
    ],
    patchHunks: [],
    gameData: {
      pokemon: JSON.parse(JSON.stringify(pokemonMap)),
      starters: {},
      starterItems: {},
      encounters: JSON.parse(JSON.stringify(encounters)),
      oddEggs: JSON.parse(JSON.stringify(oddEggs)),
      eventPokemon: JSON.parse(JSON.stringify(eventPokemonMap)),
      unownSets: {
        KABUTO_PUZZLE: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
        OMANYTE_PUZZLE: ["L", "M", "N", "O", "P", "Q", "R"],
        AERODACTYL_PUZZLE: ["S", "T", "U", "V", "W"],
        HO_OH_PUZZLE: ["X", "Y", "Z"],
      },
      showAndTellPokemon: {
        TOGEPI: "TOGEPI",
        MARILL: "MARILL",
        PIKACHU: "PIKACHU",
        CLEFAIRY: "CLEFAIRY",
        MAGIKARP: "MAGIKARP",
        LICKITUNG: "LICKITUNG",
        ODDISH: "ODDISH",
        STARYU: "STARYU",
        GROWLITHE: "GROWLITHE",
        PICHU: "PICHU",
      },
      dratiniMoves: {
        regular: [
          "WRAP",
          "LEER",
          "THUNDER_WAVE",
          "TWISTER",
        ],
        special: [
          "WRAP",
          "THUNDER_WAVE",
          "TWISTER",
          "EXTREMESPEED",
        ],
      },
      trades: JSON.parse(JSON.stringify(tradesMap)),
      teachableMoves: JSON.parse(JSON.stringify(teachableMovesMap)),
      trainers: JSON.parse(JSON.stringify(trainers)),
      mapObjectEvents: JSON.parse(JSON.stringify(mapObjectEvents)),
      martGroups: JSON.parse(JSON.stringify(martGroupsMap)),
      marts: JSON.parse(JSON.stringify(martsMap)),
      specialShops: JSON.parse(JSON.stringify(specialShopsMap)),
      moveTutorCost: 4000,
      numberOfMiltankBerries: 7,
      itemLocations: JSON.parse(JSON.stringify(itemLocationsMap)),
      warps: JSON.parse(JSON.stringify(warpsMap)),
      areas: JSON.parse(JSON.stringify(logicalAccessAreasMap)),
      numberOfBadgesForOak: 16,
      items: JSON.parse(JSON.stringify(itemsMap)),
    },
  }
}
  
export const markROMBytesAsUsed = (romInfo: ROMInfo, size: number): number => {
  const hunkIndex = romInfo.emptyHunks.slice().sort((a, b) => { return a.size - b.size }).findIndex((hunk) => { return size <= hunk.size })
      
  if (hunkIndex === -1) {
    throw new Error(`There are no empty hunks of size '${size}' or greater.`)
  }
    
  return markROMBytesInHunkAsUsed(romInfo, hunkIndex, size)
}
  
export const markROMBytesInBankAsUsed = (romInfo: ROMInfo, bank: number, size: number): number => {
  const hunkIndex = romInfo.emptyHunks.findIndex((hunk) => { return bankOfROMOffset(hunk.offset) === bank && size <= hunk.size })
      
  if (hunkIndex === -1) {
    throw new Error(`There are no empty hunks of size '${size}' or greater in bank '${bank}'.`)
  }
    
  return markROMBytesInHunkAsUsed(romInfo, hunkIndex, size)
}

const markROMBytesInHunkAsUsed = (romInfo: ROMInfo, hunkIndex: number, size: number): number => {
  const hunk = romInfo.emptyHunks[hunkIndex]
  romInfo.emptyHunks[hunkIndex] = { offset: hunk.offset + size, size: hunk.size - size }
  return hunk.offset
}

export const markROMBytesAsUnused = (romInfo: ROMInfo, offset: number, size: number) => {
  const endOffset = offset + size
    
  let currentOffset = offset
    
  while (currentOffset <= endOffset && currentOffset < romSize) {
    const currentSize = Math.min(offset + size, romBankSize * bankOfROMOffset(currentOffset) + romBankSize) - currentOffset
    const hunkIndex = romInfo.emptyHunks.findIndex((hunk) => { return bankOfROMOffset(hunk.offset) === bankOfROMOffset(currentOffset) && areHunksOverlapping(hunk, { offset: currentOffset, size: currentSize }) })
      
    if (hunkIndex !== -1) {
      const hunk = romInfo.emptyHunks[hunkIndex]
      const newOffset = Math.min(hunk.offset, currentOffset)
      romInfo.emptyHunks[hunkIndex] = { offset: newOffset, size: Math.max(hunk.offset + hunk.size, currentOffset + currentSize) - newOffset }
    } else {
      romInfo.emptyHunks.push({ offset: currentOffset, size: currentSize })
    }
      
    currentOffset = romOffsetFromBankOffset(bankOfROMOffset(currentOffset) + 1, 0)
  }
}
  
export const returnInstructionDataFormat = () => {
  return new DataFormat([0xC9])
}
  
export const farcallDataFormat = (offset: number): DataFormat => {
  return new DataFormat([0xF5, 0xE5, 0x3E, bankOfROMOffset(offset), 0x21, ...bytesFrom(bankAddressOfROMOffset(offset), 2), 0xCF, 0xE1, 0xF1])
}

type Hunk = {
  readonly offset: number
  readonly size: number
}

const areHunksOverlapping = (hunk1: Hunk, hunk2: Hunk): boolean => {
  return hunk1.offset > hunk2.offset && hunk1.offset < hunk2.offset + hunk2.size
      || hunk2.offset > hunk1.offset && hunk2.offset < hunk1.offset + hunk1.size
}

const romOffsetFromBankOffset = (bank: number, bankOffset: number) => {
  return bank * romBankSize + bankOffset
}
  
export const romOffsetFromBankAddress = (bank: number, bankAddress: number) => {
  if (bank === 0) {
    return bankAddress
  } else {
    return bank * romBankSize + bankAddress - romBankSize
  }
}
  
export const bankOfROMOffset = (offset: number): number => {
  return Math.floor(offset / romBankSize)
}
  
export const bankAddressOfROMOffset = (offset: number): number => {
  if (bankOfROMOffset(offset) === 0) {
    return offset
  } else {
    return offset % romBankSize + romBankSize
  }
}