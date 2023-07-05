import { assert } from 'vitest'
import { findNodeAtOffset } from '../findNodeAtOffset'
import { createLanguageService } from './mockLanguageService'

// Exporter une instance de LanguageService qui pointe vers votre projet fake
export const languageService = createLanguageService(
  // Convert path to URL
  new URL('./fake-project/tsconfig.json', import.meta.url)
)

export function getNodeAssignation(
  offsetAssignation: number,
  pathAssignationFile: string
) {
  const pathToTableauExemple = new URL(pathAssignationFile, import.meta.url)
    .pathname
  const sourceFile = languageService
    .getProgram()
    ?.getSourceFile(pathToTableauExemple)

  if (!sourceFile) {
    assert.fail('Source file is undefined')
  }

  const node = findNodeAtOffset(sourceFile, offsetAssignation)
  return node
}
