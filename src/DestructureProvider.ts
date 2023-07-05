import * as vscode from 'vscode'
import * as ts from 'typescript'
import { isNodeInFunctionParameter } from './isNodeInFunctionParameter'
import { findNodeAtOffset } from './findNodeAtOffset'
import { isNodeInAssignment } from './isNodeInAssignment'

// Suppose you have created a LanguageService instance named languageService
export class DestructureProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.Refactor]
  static languageService: ts.LanguageService

  static setLanguageService(languageService: ts.LanguageService) {
    DestructureProvider.languageService = languageService
  }

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

  private createDestructuringAction(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction | undefined {
    const wordRange = document.getWordRangeAtPosition(range.start)
    if (!wordRange) {
      return
    }

    const word = document.getText(wordRange)
    const action = new vscode.CodeAction(
      `Destructure '${word}'`,
      DestructureProvider.providedCodeActionKinds[0]
    )

    const documentPath = document.uri.path
    try {
      DestructureProvider.languageService
        .getProgram()
        ?.getSourceFile(documentPath)
    } catch (e) {
      console.log(e)
      return
    }
    const sourceFile = DestructureProvider.languageService
      .getProgram()
      ?.getSourceFile(documentPath)

    if (!sourceFile) {
      return
    }

    const offset = document.offsetAt(range.start)
    const node = findNodeAtOffset(sourceFile, offset)

    if (!node) {
      return
    }

    const regexReplacementText = this.getRegexReplacementText(node, word)

    action.command = {
      command: 'extension.destructureVariable',
      title: 'Destructure variable',
      arguments: [regexReplacementText, wordRange],
    }

    action.isPreferred = true

    return action
  }

  public getRegexReplacementText(node: ts.Node, word: string) {
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
}
