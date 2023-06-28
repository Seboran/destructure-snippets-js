import * as ts from 'typescript'


export function findNodeAtOffset(node: ts.Node, offset: number): ts.Node | undefined {
  if (offset >= node.getStart() && offset < node.getEnd()) {
    return ts.forEachChild(node, (c) => findNodeAtOffset(c, offset)) || node
  }
}
