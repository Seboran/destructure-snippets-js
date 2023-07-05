import { assert, describe, test } from 'vitest'
import { getNodeAssignation, languageService } from './getNodeAssignation'
import {
  isFunctionThatReturnsAnArray,
  isInAnArrayOrArrayLitteral,
} from '../isInAnArrayOrArrayLitteral'

const pathInAnArray = './fake-project/src/tableau_exemple.ts'
const checker = languageService.getProgram()?.getTypeChecker()
if (!checker) {
  assert.fail('Checker is undefined')
}
describe('isInArrayOrArrayLitteral', () => {
  test('should return true if the type is an array', () => {
    const offsetArgumentFonction = 10
    const node = getNodeAssignation(offsetArgumentFonction, pathInAnArray)

    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = isInAnArrayOrArrayLitteral(node, checker)
    assert.isTrue(result)
  })
  test('should return true if the node is a function returning an array', () => {
    const offsetArgumentFonction = 100
    const node = getNodeAssignation(offsetArgumentFonction, pathInAnArray)

    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = isInAnArrayOrArrayLitteral(node, checker)
    assert.isTrue(result)
  })
  test('should return false if the type is not an array', () => {
    const offsetArgumentFonction = 117
    const node = getNodeAssignation(offsetArgumentFonction, pathInAnArray)

    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = isInAnArrayOrArrayLitteral(node, checker)
    assert.isFalse(result)
  })
})

describe('isFunctionThatReturnsAnArray', () => {
  test('should return true if the node is a function returning an array', () => {
    const offsetArgumentFonction = 100
    const node = getNodeAssignation(offsetArgumentFonction, pathInAnArray)

    if (!node) {
      assert.fail('Node is undefined')
    }

    const result = isFunctionThatReturnsAnArray(node, checker)
    assert.isTrue(result)
  })
})
