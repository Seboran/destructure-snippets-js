import { assert, describe, expect, test } from 'vitest'
import { isNodeInFunctionParameter } from '../isNodeInFunctionParameter'
import { getNodeAssignation } from './getNodeAssignation'

const pathAppelFonction = './fake-project/src/appelFonction.ts'
describe('isNodeInFunctionParameter', () => {
  test('should return true if the node is a function parameter', async () => {
    const offsetArgumentFonction = 105
    const node = getNodeAssignation(offsetArgumentFonction, pathAppelFonction)

    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = isNodeInFunctionParameter(node)
    expect(result).toBe(true)
  })
  test('should return false if the node is not a function parameter', async () => {
    const offsetArgumentFonction = 10
    const node = getNodeAssignation(offsetArgumentFonction, pathAppelFonction)

    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = isNodeInFunctionParameter(node)
    expect(result).toBe(false)
  })
})
