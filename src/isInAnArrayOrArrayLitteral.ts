import ts from 'typescript'

export function isInAnArrayOrArrayLitteral(node: ts.Node) {
  if (ts.isArrayLiteralExpression(node)) {
    return true
  }
  if (ts.isCallExpression(node)) {
    const type = node.typeArguments?.[0]
    if (type && ts.isArrayTypeNode(type)) {
      return true
    }
  }
  return false
}
