import { useState, useEffect, useMemo } from 'react'
import FlexSearch from 'flexsearch'

export const useFlexSearch = (query, providedIndex, store, searchOptions) => {
  const [index, setIndex] = useState(null)

  useEffect(() => {
    if (!providedIndex && !store)
      console.warn(
        'A FlexSearch index and store was not provided. Your search results will be empty.',
      )
    else if (!providedIndex)
      console.warn(
        'A FlexSearch index was not provided. Your search results will be empty.',
      )
    else if (!store)
      console.warn(
        'A FlexSearch store was not provided. Your search results will be empty.',
      )
  }, [providedIndex, store])

  useEffect(() => {
    if (!providedIndex) {
      setIndex(null)
      return
    }

    if (providedIndex instanceof FlexSearch) {
      setIndex(providedIndex)
      return
    }

    const importedIndex = FlexSearch.create()
    importedIndex.import(providedIndex)

    setIndex(importedIndex)
  }, [providedIndex])

  return useMemo(() => {
    if (!query || !index || !store) return []

    var rawResults = index.search(query, searchOptions)
    
    if (typeof rawRestuls === 'object') {
      rawResults.result = rawResults.result.map(id => store[id])
    }
    else {
      rawResults = rawResults.map(id => store[id])
    }
    
    return rawResults
  }, [query, index, store])
}
