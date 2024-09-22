import type { Trade } from "@shared/types/gameData/trade"
import type { TradeId } from "@shared/types/gameDataIds/trades"

export const tradesMap: IdMap<TradeId, Trade> = {
  MIKE: {
    id: "MIKE",
    askPokemonId: "ABRA",
    offerPokemonId: "MACHOP",
  },
  KYLE: {
    id: "KYLE",
    askPokemonId: "BELLSPROUT",
    offerPokemonId: "ONIX",
  },
  TIM: {
    id: "TIM",
    askPokemonId: "KRABBY",
    offerPokemonId: "VOLTORB",
  },
  EMY: {
    id: "EMY",
    askPokemonId: "DRAGONAIR",
    offerPokemonId: "DODRIO",
  },
  CHRIS: {
    id: "CHRIS",
    askPokemonId: "HAUNTER",
    offerPokemonId: "XATU",
  },
  KIM: {
    id: "KIM",
    askPokemonId: "CHANSEY",
    offerPokemonId: "AERODACTYL",
  },
  FOREST: {
    id: "FOREST",
    askPokemonId: "DUGTRIO",
    offerPokemonId: "MAGNETON",
  },
}