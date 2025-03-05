const grayF0 = "#F0F0F0"
const grayEE = "#EEEEEE"
const grayDD = "#DDDDDD"
const grayCC = "#CCCCCC"
const grayAA = "#AAAAAA"
const gray77 = "#777777"
const gray44 = "#444444"
const gray28 = "#282828"
const gray18 = "#181818"
const gray0A = "#0A0A0A"

const crystalPurple = "#8828B0"
const crystalPurpleHighlight = "#9848F8"
const crystalRed = "#980000"
const crystalPink = "#F80868"

export const lightThemeColors = {
  primarySurface: grayF0,
  secondarySurface: grayDD,
  tertiarySurface: grayAA,
  
  text: gray0A,
  subtleText: gray28,
  buttonText: grayF0,
  
  primaryTint: crystalPurple,
  secondaryTint: crystalPurpleHighlight,
  inactiveTint: gray44,
  destructiveTint: crystalRed,
  secondaryDestructiveTint: crystalPink,
}

export const darkThemeColors = {
  primarySurface: gray18,
  secondarySurface: gray28,
  tertiarySurface: gray0A,
  
  text: grayEE,
  subtleText: grayCC,
  buttonText: grayF0,
  
  primaryTint: crystalPurple,
  secondaryTint: crystalPurpleHighlight,
  inactiveTint: gray77,
  destructiveTint: crystalRed,
  secondaryDestructiveTint: crystalPink,
} satisfies typeof lightThemeColors

export let colors = darkThemeColors

export const updateColors = () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    colors = lightThemeColors
  } else {
    colors = darkThemeColors
  }
}