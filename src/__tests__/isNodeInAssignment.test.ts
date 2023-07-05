import { assert, describe, expect, test } from 'vitest'
import { isNodeInAssignment } from '../isNodeInAssignment'
import { getNodeAssignation } from './getNodeAssignation'

const pathAssignationFile = './fake-project/src/assignation.ts'
describe('isNodeInAssignment', () => {
  test('should return true if the node is in an assignment', async () => {
    const offsetAssignation = 15
    const node = getNodeAssignation(offsetAssignation, pathAssignationFile)

    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = isNodeInAssignment(node)
    expect(result).toBe(true)
  })
  test('should return false if the node is not in an assignment', async () => {
    const offsetAssignation = 70
    const node = getNodeAssignation(offsetAssignation, pathAssignationFile)

    if (!node) {
      assert.fail('Node is undefined')
    }
    const result = isNodeInAssignment(node)
    expect(result).toBe(false)
  })
})
