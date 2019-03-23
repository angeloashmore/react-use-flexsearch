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

const store = {
  [documents[0].id]: documents[0],
  [documents[1].id]: documents[1],
  [documents[2].id]: documents[2],
}

beforeEach(() => {
  console.error = jest.fn()
})

afterEach(cleanup)
afterEach(() => {
  console.error.mockClear()
})

describe('useFlexSearch', () => {
  test('returns empty results if no query', () => {
    let objResults
    testHook(() => (objResults = useFlexSearch(null, index, store)))

    let exportedResults
    testHook(
      () => (exportedResults = useFlexSearch(null, exportedIndex, store)),
    )

    expect(objResults).toEqual([])
    expect(exportedResults).toEqual([])
  })

  test('returns empty results if query has no matches', () => {
    let objResults
    testHook(() => (objResults = useFlexSearch('nomatches', index, store)))

    let exportedResults
    testHook(
      () =>
        (exportedResults = useFlexSearch('nomatches', exportedIndex, store)),
    )

    expect(objResults).toEqual([])
    expect(exportedResults).toEqual([])
  })

  test('returns results if query has matches', () => {
    let objResults
    testHook(
      () => (objResults = useFlexSearch(documents[0].name, index, store)),
    )

    let exportedResults
    testHook(
      () =>
        (exportedResults = useFlexSearch(
          documents[0].name,
          exportedIndex,
          store,
        )),
    )

    expect(objResults).toEqual([documents[0]])
    expect(exportedResults).toEqual([documents[0]])
  })

  test('throws if index is missing', () => {
    expect(() => {
      testHook(() => useFlexSearch(documents[0].name, null, store))
    }).toThrow('index is required')

    expect(() => {
      testHook(() => useFlexSearch(documents[0].name, undefined, store))
    }).toThrow('index is required')
  })

  test('throws if store is missing', () => {
    expect(() => {
      testHook(() => useFlexSearch(documents[0].name, index, null))
    }).toThrow('store is required')

    expect(() => {
      testHook(() => useFlexSearch(documents[0].name, index, undefined))
    }).toThrow('store is required')
  })
})
