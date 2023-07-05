/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ts from 'typescript'
import fs from 'fs'
import path from 'path'

export function createLanguageService(tsconfigPath: URL) {
  const tsconfigFileBuffer = fs.readFileSync(tsconfigPath)

  const tsconfigFile = ts.parseConfigFileTextToJson(
    tsconfigPath.pathname,
    tsconfigFileBuffer.toString()
  ).config

  // Parsez votre fichier tsconfig.json pour obtenir les options de compilation et les noms de fichier
  const parsedCommandLine = ts.parseJsonConfigFileContent(
    tsconfigFile,
    ts.sys,
    path.dirname(tsconfigPath.pathname)
  )

  const scriptSnapshots: Record<string, ts.IScriptSnapshot> = {}

  // Create LanguageServiceHost
  const serviceHost: ts.LanguageServiceHost = {
    getCompilationSettings: () => parsedCommandLine.options,
    getScriptFileNames: () => parsedCommandLine.fileNames,
    getScriptVersion: () => '0',
    getScriptSnapshot: (fileName) => {
      if (!scriptSnapshots[fileName]) {
        const fileContent = fs.readFileSync(fileName).toString()
        scriptSnapshots[fileName] = ts.ScriptSnapshot.fromString(fileContent)
      }
      return scriptSnapshots[fileName]
    },
    getCurrentDirectory: () => '',
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    // Add these two methods
    readFile: (path, _encoding) => fs.readFileSync(path, 'utf8'),
    fileExists: fs.existsSync,
  }

  const languageService = ts.createLanguageService(
    serviceHost,
    ts.createDocumentRegistry()
  )

  return languageService
}
