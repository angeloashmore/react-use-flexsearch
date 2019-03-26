import { useState, useEffect, useMemo } from 'react'
import FlexSearch from 'flexsearch'

const InvalidIndexError = new Error(
  'FlexSearch index is required. Check that your index exists and is valid.',
)

export const useFlexSearch = (query, providedIndex, options) => {
  const [index, setIndex] = useState(null)

  useEffect(() => {
    if (!providedIndex) throw InvalidIndexError

    if (providedIndex instanceof FlexSearch) {
      setIndex(providedIndex)

      return
    }

    const importedIndex = FlexSearch.create()
    importedIndex.import(providedIndex)

    setIndex(importedIndex)
  }, [providedIndex])

  return useMemo(() => {
    if (!query || !index) return []

    return index.search(query, options)
  }, [query, index])
}
