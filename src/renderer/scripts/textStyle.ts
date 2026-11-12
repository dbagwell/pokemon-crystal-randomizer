import { colors } from "@scripts/colors"

type TextStyle =
  | "title"
  | "content"
  | "item"
  | "error"

export const textStyle = (element: HTMLElement, style: TextStyle) => {
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