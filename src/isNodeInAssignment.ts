import ts from 'typescript'

export function isNodeInAssignment(node: ts.Node): boolean {
  if (ts.isVariableDeclaration(node)) {
    return true
  }
  if (node.parent && ts.isVariableDeclaration(node.parent)) {
    return true
  }
  return false
}
