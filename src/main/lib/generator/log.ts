import { encountersGroupedByType } from "@lib/generator/dataConverters/encounters"
import type { Settings } from "@shared/appData/settingsFromViewModel"
import { gameMapsMap } from "@shared/gameData/gameMaps"
import { itemsMap } from "@shared/gameData/items"
import { movesMap } from "@shared/gameData/moves"
import { oddEggs } from "@shared/gameData/oddEggs"
import { pokemonMap } from "@shared/gameData/pokemon"
import { starterLocationsMap } from "@shared/gameData/starterLocations"
import { trainerClassesMap } from "@shared/gameData/trainerClasses"
import { trainerGroupsMap } from "@shared/gameData/trainerGroups"
import { eventPokemonMap } from "@shared/types/gameData/eventPokemon"
import type { GameData } from "@shared/types/gameData/gameData"
import { eventPokemonIds } from "@shared/types/gameDataIds/eventPokemon"
import { fishingGroupIds } from "@shared/types/gameDataIds/fishingGroups"
import { fishingRodIds } from "@shared/types/gameDataIds/fishingRods"
import { badgeLocationIds, fruitTreeLocationIds, hmGiftLocationIds, hmItemBallLocationIds, keyItemGiftLocationIds, keyItemHiddenItemLocationIds, keyItemItemBallLocationIds, menuItemGiftLocationIds, regularGiftLocationIds, regularHiddenItemLocationIds, regularItemBallLocationIds, tmGiftLocationIds, tmItemBallLocationIds } from "@shared/types/gameDataIds/itemLocations"
import { isItemId, tmItemIds } from "@shared/types/gameDataIds/items"
import { type MartId, martIds, specialShopIds } from "@shared/types/gameDataIds/marts"
import { isMoveId } from "@shared/types/gameDataIds/moves"
import { isPokemonId, pokemonIds } from "@shared/types/gameDataIds/pokemon"
import { starterLocationIds } from "@shared/types/gameDataIds/starterLocations"
import { moveTutorIds } from "@shared/types/gameDataIds/teachableMoves"
import { trainerClassIds } from "@shared/types/gameDataIds/trainerClasses"
import { treeGroupIds } from "@shared/types/gameDataIds/treeGroups"
import type { UnownSetId } from "@shared/types/gameDataIds/unownSets"
import { compact, isNotNullish } from "@shared/utils"
import { app } from "electron"
import yaml from "yaml"

export const generatorLog = (params: {
  seed: string
  checkValue: string
  settings: Settings
  gameData: GameData
}): string => {
  const {
    seed,
    checkValue,
    settings,
    gameData,
  } = params
  
  const basicInfos = [
    `Version: ${app.getVersion()}`,
    `Seed: ${seed}`,
    `CV: ${checkValue}`,
  ].join("\n")
  
  const sectionHeaders: string[] = []
  const sections: string[] = []
  
  const addSection = (params: {
    header: string
    content: string
  }) => {
    const {
      header,
      content,
    } = params
    
    sectionHeaders.push(header)
    
    sections.push([
      `----- ${header} -----`,
      content,
    ].join("\n\n"))
  }
  
  addSection({
    header: "SETTINGS",
    content: yaml.stringify(settings),
  })
  
  addSection({
    header: "STARTERS",
    content: logTable({
      headers: compact([
        "LOCATION",
        "POKEMON",
        "ITEM",
      ]),
      sections: [
        {
          rows: starterLocationIds.map((id) => {
            return compact([
              id,
              gameData.starters[id] ?? starterLocationsMap[id].pokemonId,
              gameData.starterItems[id] ?? "BERRY",
            ])
          }),
        },
      ],
    }),
  })
  
  addSection({
    header: "EVENT POKEMON",
    content: logTable({
      headers: [
        "ORIGINAL",
        "NEW",
      ],
      sections: [
        {
          rows: eventPokemonIds.map((id) => {
            return [
              eventPokemonMap[id],
              gameData.eventPokemon[id],
            ]
          }),
        },
      ],
    }),
  })
    
  addSection({
    header: "ODD EGG",
    content: logTable({
      headers: [
        "ORIGINAL",
        "NEW",
        "SHINY",
      ],
      sections: [
        {
          rows: oddEggs.map((egg, index) => {
            return [
              egg.pokemonId,
              gameData.oddEggs[index].pokemonId,
              index % 2 !== 0 ? "YES" : "NO",
            ]
          }),
        },
      ],
    }),
  })
  
  const encounterGroups = encountersGroupedByType(gameData.encounters)
  const encounterRatios = settings.CHANGE_POKEMON_ENCOUNTER_RATIOS.SETTINGS
  const showTimeColumn = !settings.RANDOMIZE_RANDOM_ENCOUNTERS.SETTINGS.REMOVE_TIME_BASED_ENCOUNTERS
    
  addSection({
    header: "LAND / WATER ENCOUNTERS",
    content: logTable({
      headers: compact([
        "LOCATION",
        "TYPE",
        showTimeColumn ? "TIME" : undefined,
        "POKEMON",
        "LEVEL",
        "CHANCE",
      ]),
      sections: [... new Set(encounterGroups.landAndWaterEncounters.map((encounter) => {
        return encounter.mapId
      }))].flatMap((mapId) => {
        return [
          "LAND",
          "WATER",
        ].flatMap((type) => {
          return [false, true].filter((isSwarm) => {
            return type === "LAND" || !isSwarm
          }).map((isSwarm) => {
            return encounterGroups.landAndWaterEncounters.filter((encounter) => {
              return encounter.mapId === mapId
                  && (encounter.type === "WATER" || encounter.time === "DAY" || showTimeColumn)
                  && encounter.type === type
                  && (encounter.type === "WATER" || (encounter.isSwarm ?? false) === isSwarm)
            })
          })
        })
      }).filter((encounterGroup) => {
        return encounterGroup.length > 0
      }).map((encounterGroup) => {
        return {
          rows: encounterGroup.map((encounter, index) => {
            const ratios = encounter.type === "LAND" ? encounterRatios.GRASS_AND_CAVES : encounterRatios.WATER
            return compact([
              index === 0 ? encounter.mapId : "",
              encounter.type,
              showTimeColumn ? encounter.type === "WATER" ? "ANY" : encounter.time : undefined,
              encounter.pokemonId,
              `Lv. ${encounter.level}`,
              `${ratios[encounter.slot]}% ${encounter.type === "LAND" && encounter.isSwarm ? " (SWARM)" : ""}`,
            ])
          }),
        }
      }),
    }),
  })
    
  addSection({
    header: "FISHING ENCOUNTERS",
    content: logTable({
      headers: compact([
        "ROD",
        showTimeColumn ? "TIME" : undefined,
        "POKEMON",
        "LEVEL",
        "CHANCE",
      ]),
      sections: fishingGroupIds.flatMap((groupId) => {
        return fishingRodIds.map((rodId) => {
          return encounterGroups.fishingEncounters.filter((encounter) => {
            return encounter.group === groupId && encounter.rod === rodId
          })
        })
      }).map((encounterGroup) => {
        const groupId = encounterGroup[0].group
        return {
          header: encounterGroup[0].rod !== "OLD" ? undefined
            : groupId === "REMORAID" || groupId === "REMORAID_SWARM" ? "UNUSED"
              : groupId === "QWILFISH_SWARM" ? "ROUTE_32 (SWARM)"
                : Object.values(gameMapsMap).filter((gameMap) => {
                  return gameMap.fishingGroup === groupId
                }).map((gameMap) => {
                  return gameMap.id
                }).join(" / "),
          rows: encounterGroup.flatMap((encounter) => {
            const ratios = encounter.rod === "OLD" ? encounterRatios.OLD_ROD
              : encounter.rod === "GOOD" ? encounterRatios.GOOD_ROD
                : encounterRatios.SUPER_ROD
                
            if (encounter.isTimeGroup) {
              return encounterGroups.fishingTimeGroupEncounters.filter((timeGroup) => {
                return timeGroup.timeGroupIndex === encounter.timeGroupIndex
                    && (showTimeColumn || timeGroup.time === "DAY")
              }).map((timeGroup) => {
                return compact([
                  encounter.rod,
                  showTimeColumn ? timeGroup.time : undefined,
                  timeGroup.pokemonId,
                  `Lv. ${timeGroup.level}`,
                  `${ratios[encounter.slot]}%`,
                ])
              })
            } else {
              return [
                compact([
                  encounter.rod,
                  showTimeColumn ? "ANY" : undefined,
                  encounter.pokemonId,
                  `Lv. ${encounter.level}`,
                  `${ratios[encounter.slot]}%`,
                ]),
              ]
            }
          }),
        }
      }),
    }),
  })
    
  addSection({
    header: "TREE ENCOUNTERS",
    content: logTable({
      headers: [
        "TYPE",
        "POKEMON",
        "LEVEL",
        "CHANCE",
      ],
      sections: treeGroupIds.map((groupId) => {
        return encounterGroups.treeEncounters.filter((encounter) => {
          return encounter.group === groupId
        })
      }).map((encounterGroup) => {
        const groupId = encounterGroup[0].group
        return {
          header: Object.values(gameMapsMap).filter((gameMap) => {
            return gameMap.treeGroup === groupId
          }).map((gameMap) => {
            return gameMap.id
          }).join(" / "),
          rows: encounterGroup.map((encounter) => {
            return [
              encounter.rarity,
              encounter.pokemonId,
              `Lv. ${encounter.level}`,
              `${encounterRatios.TREE[encounter.slot]}%`,
            ]
          }),
        }
      }),
    }),
  })
    
  addSection({
    header: "ROCK ENCOUNTERS",
    content: logTable({
      headers: [
        "POKEMON",
        "LEVEL",
        "CHANCE",
      ],
      sections: [
        {
          rows: encounterGroups.rockEnounters.map((encounter) => {
            return [
              encounter.pokemonId,
              `Lv. ${encounter.level}`,
              `${encounterRatios.ROCK[encounter.slot]}%`,
            ]
          }),
        },
      ],
    }),
  })
    
  addSection({
    header: "CONTEST ENCOUNTERS",
    content: logTable({
      headers: [
        "POKEMON",
        "LEVEL",
        "CHANCE",
      ],
      sections: [
        {
          rows: encounterGroups.contestEncounters.map((encounter) => {
            return [
              encounter.pokemonId,
              `Lv. ${encounter.minLevel}-${encounter.maxLevel}`,
              `${encounterRatios.CONTEST[encounter.slot]}%`,
            ]
          }),
        },
      ],
    }),
  })
    
  addSection({
    header: "UNOWN SETS",
    content: logTable({
      headers: [
        "SET",
        "LETTERS",
      ],
      sections: [
        {
          rows: Object.keys(gameData.unownSets).map((setId) => {
            return [
              setId,
              settings.CHANGE_UNOWN_SETS.VALUE && settings.CHANGE_UNOWN_SETS.SETTINGS.METHOD.VALUE === "SINGLE_SET" ? gameData.unownSets.KABUTO_PUZZLE.join(", ") : gameData.unownSets[setId as UnownSetId].join(", "),
            ]
          }),
        },
      ],
    }),
  })
  
  addSection({
    header: "IN GAME TRADES",
    content: logTable({
      headers: compact([
        "LOCATION",
        "REQUESTED",
        settings.RANDOMIZE_TRADES.SETTINGS.CHANGE_REQUESTED_GENDERS.SETTINGS.METHOD !== "NONE" ? "GENDER" : undefined,
        "OFFERED",
        "ATTACK DV",
        "DEFENCE DV",
        "SPEED DV",
        "SPECIAL DV",
        "ITEM",
      ]),
      sections: [
        {
          rows: Object.values(gameData.trades).map((trade) => {
            return compact([
              trade.mapId,
              trade.requestedPokémonId,
              settings.RANDOMIZE_TRADES.SETTINGS.CHANGE_REQUESTED_GENDERS.SETTINGS.METHOD !== "NONE" ? trade.genderId : undefined,
              trade.offeredPokemonId,
              `${trade.dvs.attack}`,
              `${trade.dvs.defence}`,
              `${trade.dvs.speed}`,
              `${trade.dvs.special}`,
              trade.heldItemId,
            ])
          }),
        },
      ],
    }),
  })
  
  addSection({
    header: "TRAINER POKEMON",
    content: logTable({
      headers: [
        "TRAINER",
        "POKEMON",
        "LEVEL",
      ],
      sections: trainerClassIds.flatMap((classId) => {
        return gameData.trainers.filter((trainer) => {
          return trainerGroupsMap[trainer.groupId].classId === classId
        })
      }).map((trainer) => {
        return {
          rows: trainer.pokemon.map((pokemon, index) => {
            return [
              index === 0 ? `${trainerClassesMap[trainerGroupsMap[trainer.groupId].classId].name} ${trainer.name}` : "",
              pokemon.id,
              `Lv. ${pokemon.level}`,
            ]
          }),
        }
      }),
    }),
  })
  
  addSection({
    header: "LEVEL UP MOVES",
    content: logTable({
      headers: [
        "POKEMON",
        "MOVE",
        "LEVEL",
      ],
      sections: pokemonIds.map((pokemonId) => {
        return {
          rows: gameData.pokemon[pokemonId].levelUpMoves.map((move, index) => {
            return [
              index === 0 ? pokemonId : "",
              move.moveId,
              `Lv. ${move.level}`,
            ]
          }),
        }
      }),
    }),
  })
  
  addSection({
    header: "TM MOVES",
    content: logTable({
      headers: [
        "TM",
        "MOVE",
      ],
      sections: [
        {
          rows: tmItemIds.map((tmId) => {
            return [
              tmId,
              gameData.teachableMoves[tmId].moveId,
            ]
          }),
        },
      ],
    }),
  })
  
  addSection({
    header: "MOVE TUTOR MOVES",
    content: logTable({
      headers: [
        "MOVE TUTOR MOVE",
        "MOVE",
        "COST",
      ],
      sections: [
        {
          rows: moveTutorIds.map((moveTutorId) => {
            return [
              moveTutorId,
              gameData.teachableMoves[moveTutorId].moveId,
              `${gameData.moveTutorCost}`,
            ]
          }),
        },
      ],
    }),
  })
  
  if (
    settings.RANDOMIZE_HM_COMPATIBILITY.VALUE && settings.RANDOMIZE_HM_COMPATIBILITY.SETTINGS.PERCENTAGE !== 0 && settings.RANDOMIZE_HM_COMPATIBILITY.SETTINGS.PERCENTAGE !== 100
    || settings.RANDOMIZE_TM_COMPATIBILITY.VALUE && settings.RANDOMIZE_TM_COMPATIBILITY.SETTINGS.PERCENTAGE !== 0 && settings.RANDOMIZE_TM_COMPATIBILITY.SETTINGS.PERCENTAGE !== 100
    || settings.RANDOMIZE_MOVE_TUTOR_COMPATIBILITY.VALUE && settings.RANDOMIZE_MOVE_TUTOR_COMPATIBILITY.SETTINGS.PERCENTAGE !== 0 && settings.RANDOMIZE_MOVE_TUTOR_COMPATIBILITY.SETTINGS.PERCENTAGE !== 100
  ) {
    addSection({
      header: "HM / TM / MOVE TUTOR COMPATIBILITY",
      content: logTable({
        headers: [
          "POKEMON",
          "HMS",
          "TMS",
          "MOVE TUTOR MOVES",
        ],
        sections: pokemonIds.map((pokemonId) => {
          const largestNumberOfMoves = Math.max(
            gameData.pokemon[pokemonId].hmMoves.length,
            gameData.pokemon[pokemonId].tmMoves.length,
            gameData.pokemon[pokemonId].moveTutorMoves.length,
          )
        
          return {
            rows: Array(largestNumberOfMoves).fill("").map((_, index) => {
              return [
                index === 0 ? pokemonId : "",
                isNotNullish(gameData.pokemon[pokemonId].hmMoves[index]) ? gameData.pokemon[pokemonId].hmMoves[index] : "",
                isNotNullish(gameData.pokemon[pokemonId].tmMoves[index]) ? gameData.pokemon[pokemonId].tmMoves[index] : "",
                isNotNullish(gameData.pokemon[pokemonId].moveTutorMoves[index]) ? gameData.pokemon[pokemonId].moveTutorMoves[index] : "",
              ]
            }),
          }
        }),
      }),
    })
  }
  
  addSection({
    header: "WILD POKEMON HELD ITEMS",
    content: logTable({
      headers: [
        "POKEMON",
        "COMMON",
        "RARE",
      ],
      sections: [
        {
          rows: Object.values(gameData.pokemon).map((pokemon) => {
            return [
              pokemon.id,
              pokemon.items[0] ?? "",
              pokemon.items[1] ?? "",
            ]
          }),
        },
      ],
    }),
  })
  
  addSection({
    header: "ITEM LOCATIONS",
    content: logTable({
      headers: [
        "LOCATION",
        "ITEM",
      ],
      sections: [
        badgeLocationIds,
        menuItemGiftLocationIds,
        keyItemItemBallLocationIds,
        keyItemHiddenItemLocationIds,
        keyItemGiftLocationIds,
        hmItemBallLocationIds,
        hmGiftLocationIds,
        tmItemBallLocationIds,
        tmGiftLocationIds,
        regularItemBallLocationIds,
        regularHiddenItemLocationIds,
        regularGiftLocationIds,
        fruitTreeLocationIds,
      ].map((group) => {
        return {
          rows: group.filter((id) => {
            return settings.CHANGE_MYSTERY_GIFT || id !== "GOLDENROD_DEPT_STORE_5F_MYSTERY_GIFT_GIRLS_GIFT"
          }).map((id) => {
            let displayId: string = id
            
            if (settings.SKIP_MAHOGANY_ROCKETS && id === "TEAM_ROCKET_BASE_B2F_CENTRAL_AREA_LANCES_GIFT") {
              if (settings.SKIP_GOLDENROD_ROCKETS) {
                displayId = "LAKE_OF_RAGE_LANCES_GIFT_1"
              } else {
                displayId = "LAKE_OF_RAGE_LANCES_GIFT"
              }
            }
            
            if (settings.SKIP_GOLDENROD_ROCKETS) {
              if (id === "RADIO_TOWER_5F_WEST_AREA_ROCKET_EXECUTIVES_GIFT") {
                if (settings.SKIP_MAHOGANY_ROCKETS) {
                  displayId = "LAKE_OF_RAGE_LANCES_GIFT_2"
                } else {
                  displayId = "LAKE_OF_RAGE_LANCES_GIFT_1"
                }
              } else if (id === "GOLDENROD_UNDERGROUND_WAREHOUSE_RADIO_DIRECTORS_GIFT") {
                if (settings.SKIP_MAHOGANY_ROCKETS) {
                  displayId = "LAKE_OF_RAGE_LANCES_GIFT_3"
                } else {
                  displayId = "LAKE_OF_RAGE_LANCES_GIFT_2"
                }
              } else if (id === "RADIO_TOWER_5F_EAST_AREA_DIRECTORS_GIFT") {
                if (settings.SKIP_MAHOGANY_ROCKETS) {
                  displayId = "LAKE_OF_RAGE_LANCES_GIFT_4"
                } else {
                  displayId = "LAKE_OF_RAGE_LANCES_GIFT_3"
                }
              }
            }
            
            if (settings.SKIP_CLAIR_BADGE_TEST && id === "DRAGON_SHRINE_BADGE") {
              displayId = "BLACKTHORN_GYM_BADGE"
            }
            
            return [
              displayId,
              gameData.itemLocations[id].itemId,
            ]
          }),
        }
      }),
    }),
  })
  
  addSection({
    header: "SHOP ITEMS",
    content: logTable({
      headers: [
        "SHOP",
        "ITEM",
        "PRICE",
      ],
      sections: [
        ...martIds.filter((martId) => {
          const ignoredMartIds: MartId[] = [
            "CHERRYGROVE_1",
            "GOLDENROD_5F_1",
            "GOLDENROD_5F_2",
            "GOLDENROD_5F_3",
            "GOLDENROD_5F_5",
            "GOLDENROD_5F_6",
            "GOLDENROD_5F_7",
            settings.BUYABLE_TM12 ? "GOLDENROD_5F_4" : "GOLDENROD_5F_8",
          ]
        
          return gameData.marts[martId].items.length > 0 && !ignoredMartIds.includes(martId)
        }).map((martId) => {
          const mart = gameData.marts[martId]
        
          return {
            rows: mart.items.map((itemId, index) => {
              return [
                index === 0 ? mart.groupId : "",
                itemId,
                `${gameData.items[itemId].price}`,
              ]
            }),
          }
        }),
        ...specialShopIds.map((shopId) => {
          const shop = gameData.specialShops[shopId]
        
          return {
            rows: shop.items.map((itemInfo, index) => {
              return [
                index === 0 ? shop.id : "",
                itemInfo.itemId,
                `${itemInfo.price}`,
              ]
            }),
          }
        }),
      ],
    }),
  })
  
  addSection({
    header: "OTHER",
    content: logTable({
      headers: [
        "SETTING",
        "VALUE",
      ],
      sections: [
        {
          rows: [
            ["BADGES REQUIRED FOR OAK/RED", `${gameData.numberOfBadgesForOak}`],
            ["BERRIES REQUIRED FOR MILTANK", `${gameData.numberOfMiltankBerries}`],
          ],
        },
      ],
    }),
  })
  
  return [
    basicInfos,
    "----- TABLE OF CONTENTS -----",
    sectionHeaders.join("\n"),
    ...sections,
  ].join("\n\n")
}

const logTable = (params: {
  headers: string[]
  sections: {
    header?: string
    rows: string[][]
  }[]
}): string => {
  const {
    headers,
    sections,
  } = params
  
  sections.forEach((section) => {
    section.rows = section.rows.map((row) => {
      return row.map((value) => {
        if (isPokemonId(value)) {
          return pokemonMap[value].name.toUpperCase()
        } else if (isItemId(value) && !value.startsWith("TM")) {
          const name = itemsMap[value].name.toUpperCase()
          return name.replaceAll(/É/g, "E")
        } else if (isMoveId(value)) {
          return movesMap[value].name.toUpperCase()
        } else {
          return value
        }
      })
    })
  })
  
  const lenghtOfLongestValueInColumn = (rows: string[][], index: number): number => {
    return Math.max(...rows.map((row) => {
      if (row[index] === undefined) {
        return 0
      } else {
        return row[index].length
      }
    }))
  }
  
  const columnWidths = headers.map((header, index) => {
    return Math.max(header.length, lenghtOfLongestValueInColumn(sections.flatMap((section) => { return section.rows }), index))
  })
  
  const rowLength = columnWidths.reduce((result, value) => {
    return result + value
  }, 0) + (columnWidths.length - 1) * 3
  
  const separator = Array(rowLength).fill("-").join("")
  
  const rowText = (row: string[]): string => {
    return row.map((value, index) => {
      return value.padEnd(columnWidths[index], " ")
    }).join(" | ")
  }
  
  return [
    rowText(headers),
    ...sections.map((section) => {
      return compact([
        isNotNullish(section.header) ? section.header : undefined,
        isNotNullish(section.header) ? separator : undefined,
        ...section.rows.map((row) => {
          return rowText(row)
        }),
      ]).join("\n")
    }),
  ].join(`\n${separator}\n`)
}