import { useState, useEffect, useMemo } from 'react'
import FlexSearch from 'flexsearch'

const InvalidIndexError = new Error(
  'FlexSearch index is required. Check that your index exists and is valid.',
)
const InvalidStoreError = new Error(
  'FlexSearch store is required. Check that your store exists and is valid.',
)

export const useFlexSearch = (query, providedIndex, store, searchOptions) => {
  const [index, setIndex] = useState(null)

  useEffect(() => {
    if (!providedIndex) throw InvalidIndexError
    if (!store) throw InvalidStoreError
  }, [providedIndex, store])

  useEffect(() => {
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

    const rawResults = index.search(query, searchOptions)

    return rawResults.map(id => store[id])
  }, [query, index])
}
