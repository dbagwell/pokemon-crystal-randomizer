export const martIds = [
  "CHERRYGROVE_1",
  "CHERRYGROVE_2",
  "VIOLET",
  "AZALEA",
  "CIANWOOD",
  "GOLDENROD_2F_1",
  "GOLDENROD_2F_2",
  "GOLDENROD_3F",
  "GOLDENROD_4F",
  "GOLDENROD_5F_1",
  "GOLDENROD_5F_2",
  "GOLDENROD_5F_3",
  "GOLDENROD_5F_4",
  "OLIVINE",
  "ECRUTEAK",
  "MAHOGANY_1",
  "MAHOGANY_2",
  "BLACKTHORN",
  "VIRIDIAN",
  "PEWTER",
  "CERULEAN",
  "LAVENDER",
  "VERMILION",
  "CELADON_2F_1",
  "CELADON_2F_2",
  "CELADON_3F",
  "CELADON_4F",
  "CELADON_5F_1",
  "CELADON_5F_2",
  "FUCHSIA",
  "SAFFRON",
  "MT_MOON",
  "INDIGO_PLATEAU",
  "UNDERGROUND",
  "GOLDENROD_5F_5",
  "GOLDENROD_5F_6",
  "GOLDENROD_5F_7",
  "GOLDENROD_5F_8",
] as const

export type MartId = typeof martIds[number]

export const isMartId = (value: string): value is MartId => {
  return (martIds as readonly string[]).includes(value)
}

export const specialShopIds = [
  "GOLDENROD_VENDING_MACHINES",
  "CELADON_VENDING_MACHINES",
  "UNDERGROUND_BARGAIN_SHOP",
  "GOLDENROD_ROOFTOP_VENDOR_1",
  "GOLDENROD_ROOFTOP_VENDOR_2",
  "MOOMOO_FARM",
  "MAHOGANY_STREET_VENDOR",
  "GOLDENROD_GAME_CORNER",
  "CELADON_GAME_CORNER",
  "BLUE_CARD_REWARD_LADY",
] as const

export type SpecialShopId = typeof specialShopIds[number]

export const isSpecialShopId = (value: string): value is SpecialShopId => {
  return (specialShopIds as readonly string[]).includes(value)
}