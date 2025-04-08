import { colors } from "@scripts/colors"

const textStyles = [
  "title",
  "content",
  "item",
  "error",
] as const

export const textStyle = (element: HTMLElement, style: typeof textStyles[number]) => {
  switch (style) {
  case "title": {
    element.style.color = colors.text
    element.style.fontSize = "20px"
    break
  }
  case "content": {
    element.style.color = colors.text
    element.style.fontSize = "15px"
    break
  }
  case "item": {
    element.style.color = colors.text
    element.style.fontSize = "16px"
    break
  }
  case "error": {
    element.style.color = colors.destructiveTint
    element.style.fontSize = "14px"
    break
  }
  }
}