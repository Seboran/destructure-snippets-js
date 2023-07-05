import { assert, describe, test } from 'vitest'
import { getNodeAssignation } from './getNodeAssignation'
import { isInAnArrayOrArrayLitteral } from '../isInAnArrayOrArrayLitteral'

const pathInAnArray = './fake-project/src/tableau_exemple.ts'
describe('isInArrayOrArrayLitteral', () => {
  test('should return true if the type is an array', () => {
    const offsetArgumentFonction = 20
    const node = getNodeAssignation(offsetArgumentFonction, pathInAnArray)

    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = isInAnArrayOrArrayLitteral(node)
    assert.isTrue(result)
  })
  test('should return false if the type is not an array', () => {
    const offsetArgumentFonction = 117
    const node = getNodeAssignation(offsetArgumentFonction, pathInAnArray)

    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = isInAnArrayOrArrayLitteral(node)
    assert.isFalse(result)
  })
})
