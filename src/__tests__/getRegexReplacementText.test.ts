import { assert, describe, expect, test } from 'vitest'
import { getRegexReplacementText } from '../getRegexReplacementText'
import { getNodeAssignation, languageService } from './getNodeAssignation'

const pathGetRegexIndex = './fake-project/src/index.ts'
const checker = languageService.getProgram()?.getTypeChecker()
if (!checker) {
  assert.fail('Checker is undefined')
}
describe('getRegexReplacementText', () => {
  test('should return the replacement text of a parameter in a function', async () => {
    const offsetArgumentFonction = 20
    const node = getNodeAssignation(offsetArgumentFonction, pathGetRegexIndex)
    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = getRegexReplacementText(node, 'argument', checker)

    expect(result).toBe('{ $1 }')
  })
  test('should return the replacement text of a variable assignment', async () => {
    const offsetAssignation = 71
    const node = getNodeAssignation(offsetAssignation, pathGetRegexIndex)
    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = getRegexReplacementText(node, 'argument', checker)

    expect(result).toBe('const { $1 } = argument')
  })
  test('should return the replacement text of a variable declaration', async () => {
    const offsetAssignation = 140
    const node = getNodeAssignation(offsetAssignation, pathGetRegexIndex)
    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = getRegexReplacementText(node, 'argument', checker)

    expect(result).toBe('{ $1 }')
  })
  test('should return the replacement text of a direct call to a function returning an array', async () => {
    const offsetAssignation = 239
    const node = getNodeAssignation(offsetAssignation, pathGetRegexIndex)
    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = getRegexReplacementText(node, 'argument', checker)

    expect(result).toBe('const [ $1 ] = argument()')
  })
})
