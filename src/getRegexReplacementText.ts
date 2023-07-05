import * as ts from 'typescript'
import { isNodeInFunctionParameter } from './isNodeInFunctionParameter'
import { isNodeInAssignment } from './isNodeInAssignment'
import { convertBooleanToBrackets } from './convertBooleanToBrackets'
import { isInAnArrayOrArrayLitteral } from './isInAnArrayOrArrayLitteral'

export function getRegexReplacementText(
  node: ts.Node,
  word: string,
  checker: ts.TypeChecker
) {
  const isSquareBracket = isInAnArrayOrArrayLitteral(node, checker)
  const { left, right } = convertBooleanToBrackets(isSquareBracket)
  let newText
  if (isNodeInFunctionParameter(node)) {
    newText = `${left} $1 ${right}`
  } // add condition is node is a variable assignment
  else if (isNodeInAssignment(node)) {
    newText = `${left} $1 ${right}`
  } else {
    newText = `const ${left} $1 ${right} = ${word}`
  }
  return newText
}
