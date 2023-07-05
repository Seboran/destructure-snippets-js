import ts from 'typescript'

export function isInAnArrayOrArrayLitteral(
  node: ts.Node,
  checker: ts.TypeChecker
): boolean {
  if (ts.isArrayLiteralExpression(node)) {
    return true
  }

  if (ts.isCallExpression(node)) {
    const type = node.typeArguments?.[0]
    if (type && ts.isArrayTypeNode(type)) {
      return true
    }
  }

  if (ts.isIdentifier(node) && ts.isVariableDeclaration(node.parent)) {
    if (
      node.parent.initializer &&
      ts.isArrayLiteralExpression(node.parent.initializer)
    ) {
      return true
    }
  }

  if (isFunctionThatReturnsAnArray(node, checker)) {
    return true
  }

  return false
}

export function isFunctionThatReturnsAnArray(
  node: ts.Node,
  checker: ts.TypeChecker
) {
  while (node) {
    if (ts.isCallExpression(node)) {
      break
    }
    node = node.parent
  }
  if (!node) {
    return false
  }
  const signature = checker.getResolvedSignature(node)
  if (signature && signature.declaration && signature.declaration.type) {
    const returnType: ts.Type = checker.getTypeAtLocation(
      signature.declaration.type
    )
    if (returnType && checker.typeToString(returnType).endsWith('[]')) {
      return true
    }
  }
  return false
}
