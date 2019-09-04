import React from 'react'
import { testHook, cleanup } from 'react-testing-library'
import FlexSearch from 'flexsearch'
import { useFlexSearch } from './index'

const documents = [
  {
    id: 0,
    name: 'FlexSearch',
    text: 'Next-Generation full text search library for Browser and Node.js.',
  },
  {
    id: 1,
    name: 'React',
    text: 'A JavaScript library for building user interfaces.',
  },
  {
    id: 2,
    name: 'Lodash',
    text:
      'A modern JavaScript utility library delivering modularity, performance & extras.',
  },
]

const index = FlexSearch.create()

documents.forEach(doc => {
  index.add(doc.id, JSON.stringify(doc))
})

const exportedIndex = index.export()

beforeEach(() => {
  console.error = jest.fn()
})

afterEach(cleanup)
afterEach(() => {
  console.error.mockClear()
})

describe('useFlexSearch', () => {
  test('returns empty results if no query', () => {
    let results
    testHook(() => (results = useFlexSearch(null, index)))

    expect(results).toEqual([])
  })

  test('returns empty results if query has no matches', () => {
    let results
    testHook(() => (results = useFlexSearch('nomatches', index)))

    expect(results).toEqual([])
  })

  test('returns results if query has matches', () => {
    let results
    testHook(() => (results = useFlexSearch(documents[0].name, index)))

    expect(results).toEqual([0])
  })

  test('returns same results using instance and exported index', () => {
    let instanceResults
    testHook(() => (instanceResults = useFlexSearch(documents[0].name, index)))

    let exportedResults
    testHook(
      () => (exportedResults = useFlexSearch(documents[0].name, exportedIndex)),
    )

    expect(instanceResults).toEqual([0])
    expect(instanceResults).toEqual(exportedResults)
  })

  test('returns results if query has matches using search options', () => {
    let results
    testHook(() => (results = useFlexSearch('JavaScript', index)))

    let limitedResults
    testHook(
      () => (limitedResults = useFlexSearch('JavaScript', index, { limit: 1 })),
    )

    expect(results).toEqual([1, 2])
    expect(limitedResults).toEqual([1])
  })

  test('throws if index is missing', () => {
    expect(() => {
      testHook(() => useFlexSearch(documents[0].name))
    }).toThrow('index is required')
  })
})
