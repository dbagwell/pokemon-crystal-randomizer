import type { ROMInfo } from "@lib/gameData/romInfo"
import type { SettingsFromAppViewModel } from "@shared/appData/settingsFromAppViewModel"
import { pokemonMap } from "@shared/gameData/pokemon"
import { trainerGroupsMap } from "@shared/gameData/trainerGroups"
import type { Pokemon } from "@shared/types/gameData/pokemon"
import { pokemonTypeIds } from "@shared/types/gameDataIds/pokemonTypes"
import { isNullish } from "@shared/utils"

export const updateTrainers = (
  settings: SettingsFromAppViewModel,
  romInfo: ROMInfo,
  randomInt: (min: number, max: number) => number,
) => {
  if (!settings.RANDOMIZE_TRAINER_POKEMON.VALUE) { return }
  
  const randomTeamsSettings = settings.RANDOMIZE_TRAINER_POKEMON.SETTINGS
    
  romInfo.gameData.trainers.forEach((trainer) => {
    const nonBannedPokemon = (Object.values(pokemonMap) as Pokemon[]).filter((pokemon) => {
      return !randomTeamsSettings.BAN.includes(pokemon.id)
    })
      
    const availableTypes = pokemonTypeIds.filter((typeId) => {
      return typeId !== "NONE"
    })
      
    const typeFilter = randomTeamsSettings.TYPE_THEME_TEAMS ? availableTypes[randomInt(0, availableTypes.length - 1)] : undefined
      
    const nonBannedAndTypeFilteredPokemon = nonBannedPokemon.filter((pokemon) => {
      return !randomTeamsSettings.BAN.includes(pokemon.id) && (isNullish(typeFilter) || pokemon.types.includes(typeFilter))
    })
      
    trainer.pokemon.forEach((pokemon, index) => {
      const availablePokemon = randomTeamsSettings.FORCE_FULLY_EVOLVED_ABOVE_LEVEL.VALUE && pokemon.level > randomTeamsSettings.FORCE_FULLY_EVOLVED_ABOVE_LEVEL.SETTINGS.THRESHOLD ? nonBannedAndTypeFilteredPokemon.filter((pokemon) => {
        return isNullish(pokemon.evolutions)
      }) : nonBannedAndTypeFilteredPokemon
        
      if (trainerGroupsMap[trainer.groupId].classId !== "RIVAL" || !randomTeamsSettings.INGORE_RIVALS_STARTER || index !== trainer.pokemon.length - 1) {
        pokemon.id = availablePokemon[randomInt(0, availablePokemon.length - 1)].id
      }
        
      pokemon.moves = []
    })
  })
}