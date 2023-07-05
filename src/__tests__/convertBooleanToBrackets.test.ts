import { describe, expect, test } from 'vitest'
import { convertBooleanToBrackets } from '../convertBooleanToBrackets'

describe('convertNodeToBrackets', () => {
  test('should return [] brackets ', async () => {
    expect(convertBooleanToBrackets(true)).toEqual({
      left: '[',
      right: ']',
    })
  })
  test('should return {} brackets ', async () => {
    expect(convertBooleanToBrackets(false)).toEqual({
      left: '{',
      right: '}',
    })
  })
})
