# react-use-flexsearch

React hook to search a [FlexSearch][flexsearch] index.

## Status

[![npm version](https://badge.fury.io/js/react-use-flexsearch.svg)](http://badge.fury.io/js/react-use-flexsearch)

## Installation

```sh
npm install --save react-use-flexsearch
```

## API

```js
useFlexSearch(query: String, index: Index! | String!, store: Object!, options: Object) => Object[]
```

The `useFlexSearch` [hook][hooks] takes your search query, index, and store and
returns results as an array. Searches are memoized to ensure efficient
searching.

### Parameters

| Name          | Type              | Description                                                                                                                         |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **`query`**   | `String`          | The search query. As this value updates, the return value will be updated.                                                          |
| **`index`**   | `Index \| String` | **Required**. The FlexSearch index. This can be an instance of a FlexSearch index or one that has been exported via `Index.export`. |
| **`store`**   | `Object`          | **Required**. Object mapping a result `id` to an object of data.                                                                    |
| **`options`** | `Object`          | Search options passed to `Index.search`.                                                                                            |

### Example

The following example renders a text input and queries the FlexSearch index on
form submission.

Note: [Formik][formik] is used in the following example to handle form state,
but is not required. As long as your query is passed as the first parameter,
you can manage how to store it.

```js
import React, { useState } from 'react'
import { useFlexSearch } from 'react-use-flexsearch'
import { Formik, Form, Field } from 'formik'

const index = /* a FlexSearch index */
const store = {
  1: { id: 1, title: 'Document 1' },
  2: { id: 2, title: 'Document 2' },
  3: { id: 3, title: 'Document 3' },
}

const SearchBar = () => {
  const [query, setQuery] = useState(null)
  const results = useFlexSearch(query, index, store)

  return (
    <Formik
      initialValues={{ query: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setQuery(values.query)
        setSubmitting(false)
      }}
    >
      <Form>
        <Field name="query" />
      </Form>
      <h1>Results</h1>
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </Formik>
  )
}
```

[flexsearch]: https://github.com/nextapps-de/flexsearch
[hooks]: https://reactjs.org/docs/hooks-intro.html
[formik]: https://github.com/jaredpalmer/formik
