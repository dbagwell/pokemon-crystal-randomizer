const grayF0 = "#F0F0F0"
const grayEE = "#EEEEEE"
const grayDD = "#DDDDDD"
const grayCC = "#CCCCCC"
const grayAA = "#AAAAAA"
const gray77 = "#777777"
const gray44 = "#444444"
const gray28 = "#282828"
const gray25 = "#252525"
const gray18 = "#181818"
const gray0A = "#0A0A0A"

const crystalPurple = "#8828B0"
const crystalPurpleHighlight = "#9848F8"
const crystalRed = "#980000"
const crystalPink = "#F80868"
const crystalGold = "#D0A800"

export const lightThemeColors = {
  activeTint: crystalPurple,
  appBackground: grayAA,
  background: grayF0,
  deemphasizedText: gray28,
  destructiveHighlight: crystalPink,
  destructiveTint: crystalRed,
  highlightedBackround: grayDD,
  inactiveTabBackground: grayDD,
  inactiveTint: gray44,
  primaryButtonBackground: crystalPurple,
  primaryButtonForeground: grayF0,
  primaryButtonHighlightedBackground: crystalPurpleHighlight,
  progressIndicator: crystalPurple,
  progressIndicatorHighlight: crystalGold,
  separator: gray44,
  text: gray0A,
  tooltipBackground: grayDD,
}

export const darkThemeColors = {
  activeTint: crystalPurple,
  appBackground: gray0A,
  background: gray18,
  deemphasizedText: grayCC,
  destructiveHighlight: crystalPink,
  destructiveTint: crystalRed,
  highlightedBackround: gray25,
  inactiveTabBackground: gray28,
  inactiveTint: gray77,
  primaryButtonBackground: crystalPurple,
  primaryButtonForeground: grayF0,
  primaryButtonHighlightedBackground: crystalPurpleHighlight,
  progressIndicator: crystalPurple,
  progressIndicatorHighlight: crystalGold,
  separator: gray77,
  text: grayEE,
  tooltipBackground: gray28,
} satisfies typeof lightThemeColors

export let colors = darkThemeColors

export const updateColors = () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    colors = lightThemeColors
  } else {
    colors = darkThemeColors
  }
}