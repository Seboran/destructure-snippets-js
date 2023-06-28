import * as vscode from 'vscode'
import * as ts from 'typescript'
import { isNodeInFunctionParameter } from './isNodeInFunctionParameter'
import { findNodeAtOffset } from './findNodeAtOffset'

export class DestructureProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.Refactor]

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: vscode.CodeActionContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const destructuringAction = this.createDestructuringAction(document, range)
    return destructuringAction ? [destructuringAction] : []
  }

  private createDestructuringAction(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction | undefined {
    const wordRange = document.getWordRangeAtPosition(range.start)
    if (!wordRange) {
      return
    }

    const word = document.getText(wordRange)
    const action = new vscode.CodeAction(`Destructure '${word}'`, DestructureProvider.providedCodeActionKinds[0])

    const sourceFile = ts.createSourceFile(
      document.fileName,
      document.getText(),
      ts.ScriptTarget.Latest,
      true
    )

    const offset = document.offsetAt(range.start)
    const node = findNodeAtOffset(sourceFile, offset)

    if (!node) {
      vscode.window.showInformationMessage('Invalid location for this snippet')
      return
    }

    let newText
    if (isNodeInFunctionParameter(node)) {
      newText = '{ $1 }'
    } else {
      newText = `const { $1 } = ${word}`
    }

    action.command = {
      command: 'extension.destructureVariable',
      title: 'Destructure variable',
      arguments: [newText, wordRange]
    }

    action.isPreferred = true

    return action
  }
}
