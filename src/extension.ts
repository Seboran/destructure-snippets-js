import * as vscode from 'vscode'
import * as ts from 'typescript'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.destructureVariable', () => {
      insertSnippet('destr')
    }),
    vscode.commands.registerCommand('extension.destructureArgument', () => {
      insertSnippet('destra')
    })
  )
}

function insertSnippet(snippetName: string) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return // Aucun éditeur ouvert
  }

  const document = editor.document
  const cursorPosition = editor.selection.active

  const sourceFile = ts.createSourceFile(
    document.fileName,
    document.getText(),
    ts.ScriptTarget.Latest,
    true
  )

  const offset = document.offsetAt(cursorPosition)
  const node = findNodeAtOffset(sourceFile, offset)
  if (!node) {
    vscode.window.showInformationMessage('Invalid location for this snippet')
    return
  }
  if (
    (!isNodeInFunctionParameter(node))
  ) {
    editor.insertSnippet(
      new vscode.SnippetString('const { $2 } = ${1:$TM_SELECTED_TEXT}')
    )
  } else {
    editor.insertSnippet(
      new vscode.SnippetString('{ $1 }')
    )
  }
}

function findNodeAtOffset(node: ts.Node, offset: number): ts.Node | undefined {
  if (offset >= node.getStart() && offset < node.getEnd()) {
    return ts.forEachChild(node, (c) => findNodeAtOffset(c, offset)) || node
  }
}

function isNodeInFunctionArgument(node: ts.Node): boolean {
  while (node) {
    if (
      ts.isCallExpression(node) &&
      node.arguments.some(
        (arg) =>
          arg.getStart() <= node.getStart() && arg.getEnd() > node.getEnd()
      )
    ) {
      return true
    }
    node = node.parent
  }
  return false
}

function isNodeInFunctionParameter(node: ts.Node): boolean {
  while (node) {
    if (ts.isParameter(node)) {
      return true
    }
    node = node.parent
  }
  return false
}

