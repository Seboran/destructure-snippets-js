import * as ts from 'typescript'
import * as vscode from 'vscode'
import * as path from 'path'

const scriptVersions: Record<string, number> = {}

export async function createLanguageService() {
  // Chemin vers votre fichier tsconfig.json
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
  if (!workspaceFolder) {
    throw new Error('No workspace folder')
  }
  const tsconfigPath = vscode.Uri.joinPath(workspaceFolder.uri, 'tsconfig.json')

  // Lisez votre fichier tsconfig.json
  const tsconfigFileBuffer = await vscode.workspace.fs.readFile(tsconfigPath)
  const tsconfigFile = ts.parseConfigFileTextToJson(
    tsconfigPath.fsPath,
    tsconfigFileBuffer.toString()
  ).config

  // Parsez votre fichier tsconfig.json pour obtenir les options de compilation et les noms de fichier
  const parsedCommandLine = ts.parseJsonConfigFileContent(
    tsconfigFile,
    ts.sys,
    path.dirname(tsconfigPath.fsPath)
  )

  const scriptSnapshots: Record<string, ts.IScriptSnapshot> = {}

  for (const fileName of parsedCommandLine.fileNames) {
    const fileContent = (
      await vscode.workspace.fs.readFile(vscode.Uri.file(fileName))
    ).toString()
    scriptSnapshots[fileName] = ts.ScriptSnapshot.fromString(fileContent)
  }

  // Créez un LanguageServiceHost avec les options de compilation et les noms de fichier
  const serviceHost: ts.LanguageServiceHost = {
    getCompilationSettings: () => parsedCommandLine.options,
    getScriptFileNames: () => parsedCommandLine.fileNames,
    getScriptVersion: (fileName) => {
      // mettre à jour la version du script
      return (scriptVersions[fileName] || 0).toString()
    },
    getScriptSnapshot: (fileName) => {
      return scriptSnapshots[fileName]
    },
    getCurrentDirectory: () => process.cwd(),
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: (filePath) => !!scriptSnapshots[filePath],
    readFile: (filePath) =>
      scriptSnapshots[filePath]?.getText(
        0,
        scriptSnapshots[filePath].getLength()
      ),
    readDirectory: ts.sys.readDirectory,
  }

  vscode.workspace.onDidChangeTextDocument(async (event) => {
    const fileName = event.document.fileName

    // Ignorez les changements de fichiers qui ne sont pas dans parsedCommandLine.fileNames
    if (!parsedCommandLine.fileNames.includes(fileName)) {
      return
    }

    // Mettez à jour scriptSnapshots avec le nouveau contenu du fichier
    const fileContent = event.document.getText()
    scriptSnapshots[fileName] = ts.ScriptSnapshot.fromString(fileContent)

    // Incrémentez la version du script
    if (scriptVersions[fileName] === undefined) {
      scriptVersions[fileName] = 0
    }
    scriptVersions[fileName]++
  })

  // Créez votre LanguageService avec le LanguageServiceHost
  const languageService = ts.createLanguageService(
    serviceHost,
    ts.createDocumentRegistry()
  )
  return languageService
}
