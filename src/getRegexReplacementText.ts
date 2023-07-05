import * as ts from 'typescript'
import { isNodeInFunctionParameter } from './isNodeInFunctionParameter'
import { isNodeInAssignment } from './isNodeInAssignment'

export function getRegexReplacementText(node: ts.Node, word: string) {
  let newText
  if (isNodeInFunctionParameter(node)) {
    newText = '{ $1 }'
  } // add condition is node is a variable assignment
  else if (isNodeInAssignment(node)) {
    newText = '{ $1 }'
  } else {
    newText = `const { $1 } = ${word}`
  }
  return newText
}
