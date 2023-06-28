import * as ts from 'typescript'


export function isNodeInFunctionParameter(node: ts.Node): boolean {
  while (node) {
    if (ts.isParameter(node)) {
      return true
    }
    node = node.parent
  }
  return false
}
