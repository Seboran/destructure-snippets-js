import * as ts from 'typescript'
import * as vscode from 'vscode'
import { findNodeAtOffset } from './findNodeAtOffset'
import { getRegexReplacementText } from './getRegexReplacementText'

// Suppose you have created a LanguageService instance named languageService
export class DestructureProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.Refactor]

  constructor(private languageService: ts.LanguageService) {}

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

    const sourceFile = this.getDocumentSourceFile(document)

    if (!sourceFile) {
      return
    }

    const node = this.getNode(document, range, sourceFile)

    if (!node) {
      return
    }

    const word = document.getText(wordRange)

    const regexReplacementText = getRegexReplacementText(node, word)

    return this.createAction(word, regexReplacementText, wordRange)
  }

  private getDocumentSourceFile(document: vscode.TextDocument) {
    const documentPath = document.uri.path

    const sourceFile = this.languageService
      .getProgram()
      ?.getSourceFile(documentPath)
    return sourceFile
  }

  private getNode(
    document: vscode.TextDocument,
    range: vscode.Range,
    sourceFile: ts.SourceFile
  ) {
    const offset = document.offsetAt(range.start)
    const node = findNodeAtOffset(sourceFile, offset)
    return node
  }

  private createAction(
    word: string,
    regexReplacementText: string,
    wordRange: vscode.Range
  ) {
    const action = new vscode.CodeAction(
      `Destructure '${word}'`,
      DestructureProvider.providedCodeActionKinds[0]
    )
    action.command = {
      command: 'extension.destructureVariable',
      title: 'Destructure variable',
      arguments: [regexReplacementText, wordRange],
    }

    action.isPreferred = true

    return action
  }
}
