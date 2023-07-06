import * as ts from 'typescript'
import * as vscode from 'vscode'
import { defaultTsconfigFile } from './defaultTsconfigFile'

export async function getTsconfigFile(tsconfigPath: vscode.Uri) {
  let tsconfigFile: ReturnType<typeof ts.parseConfigFileTextToJson>['config']
  try {
    const tsconfigFileBuffer = await vscode.workspace.fs.readFile(tsconfigPath)
    tsconfigFile = ts.parseConfigFileTextToJson(
      tsconfigPath.fsPath,
      tsconfigFileBuffer.toString()
    ).config
  } catch (error) {
    tsconfigFile = defaultTsconfigFile
  }
  return tsconfigFile
}
