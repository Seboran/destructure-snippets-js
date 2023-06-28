import * as vscode from 'vscode'
import { DestructureProvider } from './DestructureProvider'

function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { pattern: '**/*.{js,ts}', scheme: 'file' },
      new DestructureProvider(),
      { providedCodeActionKinds: DestructureProvider.providedCodeActionKinds }
    )
  )
  context.subscriptions.push(vscode.commands.registerCommand('extension.destructureVariable', destructureVariable))
}

function destructureVariable(newText: string, wordRange: vscode.Range) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return
  }
  editor.insertSnippet(new vscode.SnippetString(newText), wordRange)
}

export { activate }
