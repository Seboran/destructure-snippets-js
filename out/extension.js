"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const ts = __importStar(require("typescript"));
class DestructureProvider {
    provideCodeActions(document, range, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token) {
        const destructuringAction = this.createDestructuringAction(document, range);
        return destructuringAction ? [destructuringAction] : [];
    }
    createDestructuringAction(document, range) {
        const wordRange = document.getWordRangeAtPosition(range.start);
        if (!wordRange) {
            return;
        }
        const word = document.getText(wordRange);
        const action = new vscode.CodeAction(`Destructure '${word}'`, DestructureProvider.providedCodeActionKinds[0]);
        const sourceFile = ts.createSourceFile(document.fileName, document.getText(), ts.ScriptTarget.Latest, true);
        const offset = document.offsetAt(range.start);
        const node = findNodeAtOffset(sourceFile, offset);
        if (!node) {
            vscode.window.showInformationMessage('Invalid location for this snippet');
            return;
        }
        let newText;
        if (isNodeInFunctionParameter(node)) {
            newText = '{ $1 }';
        }
        else {
            newText = `const { $1 } = ${word}`;
        }
        action.command = {
            command: 'extension.destructureVariable',
            title: 'Destructure variable',
            arguments: [newText, wordRange]
        };
        action.isPreferred = true;
        return action;
    }
}
DestructureProvider.providedCodeActionKinds = [vscode.CodeActionKind.Refactor];
function activate(context) {
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider({ pattern: '**/*.{js,ts}', scheme: 'file' }, new DestructureProvider(), { providedCodeActionKinds: DestructureProvider.providedCodeActionKinds }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.destructureVariable', destructureVariable));
}
exports.activate = activate;
function destructureVariable(newText, wordRange) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    editor.insertSnippet(new vscode.SnippetString(newText), wordRange);
}
function findNodeAtOffset(node, offset) {
    if (offset >= node.getStart() && offset < node.getEnd()) {
        return ts.forEachChild(node, (c) => findNodeAtOffset(c, offset)) || node;
    }
}
function isNodeInFunctionParameter(node) {
    while (node) {
        if (ts.isParameter(node)) {
            return true;
        }
        node = node.parent;
    }
    return false;
}
