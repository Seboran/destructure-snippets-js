export type BracketType = {
  left: string
  right: string
}

export function convertBooleanToBrackets(
  isSquareBracket: boolean
): BracketType {
  return {
    left: isSquareBracket ? '[' : '{',
    right: isSquareBracket ? ']' : '}',
  }
}
