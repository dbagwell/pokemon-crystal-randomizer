export const getAdjustedEncounterRates = (rates: number[], max: number) => {
  let cumulativeValue = 0
    
  const adjustedRates = rates.map((rate) => {
    const adjustedRate = rate * max / 100
    cumulativeValue += Math.floor(adjustedRate)
    return cumulativeValue
  })
    
  if (cumulativeValue < max) {
    if (adjustedRates.length === 4) {
      adjustedRates[adjustedRates.length - 2]++
      adjustedRates[adjustedRates.length - 1]++
    } else {
      let remainingPoints = max - cumulativeValue
      let cumulativeAdjustment = 0
        
      for (let index = 0; index < adjustedRates.length; index++) {
        if (remainingPoints > 0) {
          cumulativeAdjustment++
          remainingPoints--
        }
          
        adjustedRates[index] += cumulativeAdjustment
      }
    }
  }
    
  return adjustedRates
}

export const bytesFromLandAndWaterEncounterRates = (landRates: number[], waterRates: number[]) => {
  return getAdjustedEncounterRates([...landRates, ...waterRates], 100).flatMap((rate, index) => {
    return [rate, index * 2]
  })
}