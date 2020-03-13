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
  console.warn = jest.fn()
})

afterEach(cleanup)
afterEach(() => {
  console.error.mockClear()
  console.warn.mockClear()
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

  test('warns if index and store are missing', () => {
    const message =
      'A FlexSearch index and store was not provided. Your search results will be empty.'

    testHook(() => useFlexSearch(documents[0].name, null, null))
    expect(console.warn).toHaveBeenLastCalledWith(message)

    console.warn.mockClear()
    testHook(() => useFlexSearch(documents[0].name, undefined, undefined))
    expect(console.warn).toHaveBeenLastCalledWith(message)
  })

  test('warns if index is missing', () => {
    const message =
      'A FlexSearch index was not provided. Your search results will be empty.'

    testHook(() => useFlexSearch(documents[0].name, null, store))
    expect(console.warn).toHaveBeenLastCalledWith(message)

    console.warn.mockClear()
    testHook(() => useFlexSearch(documents[0].name, undefined, store))
    expect(console.warn).toHaveBeenLastCalledWith(message)
  })

  test('warns if store is missing', () => {
    const message =
      'A FlexSearch store was not provided. Your search results will be empty.'

    testHook(() => useFlexSearch(documents[0].name, index, null))
    expect(console.warn).toHaveBeenLastCalledWith(message)

    console.warn.mockClear()
    testHook(() => useFlexSearch(documents[0].name, index, undefined))
    expect(console.warn).toHaveBeenLastCalledWith(message)
  })
})
