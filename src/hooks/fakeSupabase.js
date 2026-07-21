// This is a fake Supabase client for testing purposes. It simulates the behavior of Supabase's query builder and allows you to perform CRUD operations on an in-memory store
let idCounter = 1
const nextId = () => `id-${idCounter++}`
const now = () => new Date().toISOString()

export function createFakeSupabase() {
  const store = {
    tasted_countries: [],
    recipes: [],
    current_challenge: [],
  }

  function from(table) {
    let filters = []
    let mode = null
    let payload = null
    let selectCols = null
    let wantSingle = false
    let wantMaybeSingle = false

    const applyFilters = (rows) =>
      rows.filter((row) => filters.every(([col, val]) => row[col] === val))

    // Returns a promise that resolves to the result of executing the query
    const makeResult = (fn) => {
      const promise = Promise.resolve().then(fn)
      // Add the query builder methods to the promise so that they can be chained
      promise.select = (cols) => {
        selectCols = cols
        return promise
      }
      promise.single = () => {
        wantSingle = true
        return promise
      }
      promise.maybeSingle = () => {
        wantMaybeSingle = true
        return promise
      }
      return promise
    }

    const execute = () => {
      const table_rows = store[table]

      if (mode === 'insert') {
        const rows = Array.isArray(payload) ? payload : [payload]
        const inserted = rows.map((row) => {
          const entry = { id: nextId(), created_at: now(), ...row }
          if (table === 'recipes' && !entry.entry_number) {
            const userRecipes = store.recipes.filter(
              (r) => r.user_id === row.user_id,
            )
            entry.entry_number = userRecipes.length + 1
          }
          return entry
        })
        table_rows.push(...inserted)
        const result = wantSingle ? inserted[0] : inserted
        return { data: result, error: null }
      }

      if (mode === 'upsert') {
        const existingIndex = table_rows.findIndex(
          (row) => row.user_id === payload.user_id,
        )
        if (existingIndex >= 0) {
          table_rows[existingIndex] = {
            ...table_rows[existingIndex],
            ...payload,
          }
        } else {
          table_rows.push({ id: nextId(), created_at: now(), ...payload })
        }
        return { data: null, error: null }
      }

      if (mode === 'update') {
        const matched = applyFilters(table_rows)
        matched.forEach((row) => Object.assign(row, payload))
        return { data: matched, error: null }
      }

      if (mode === 'delete') {
        const toDelete = new Set(applyFilters(table_rows).map((r) => r.id))
        store[table] = table_rows.filter((row) => !toDelete.has(row.id))
        return { data: null, error: null }
      }

      // Select mode
      let result = applyFilters(table_rows)

      if (table === 'tasted_countries' && selectCols?.includes('recipes')) {
        result = result.map((row) => ({
          ...row,
          recipes: store.recipes
            .filter((r) => r.tasted_country_id === row.id)
            .map((r) => ({
              name: r.name,
              intro: r.intro ?? null,
              ingredients: r.ingredients ?? null,
              method: r.method ?? null,
              photo_url: r.photo_url ?? null,
              entry_number: r.entry_number ?? null,
              created_at: r.created_at,
            })),
        }))
      }

      if (wantSingle) return { data: result[0] ?? null, error: null }
      if (wantMaybeSingle) return { data: result[0] ?? null, error: null }
      return { data: result, error: null }
    }

    const api = {
      select(cols) {
        if (mode === null) mode = 'select'
        selectCols = cols
        return api
      },
      insert(rowOrRows) {
        mode = 'insert'
        payload = rowOrRows
        return api
      },
      update(values) {
        mode = 'update'
        payload = values
        return api
      },
      upsert(values) {
        mode = 'upsert'
        payload = values
        return api
      },
      delete() {
        mode = 'delete'
        return api
      },
      eq(col, val) {
        filters.push([col, val])
        return api
      },
      order() {
        return api
      },
      single() {
        wantSingle = true
        return Promise.resolve(execute())
      },
      maybeSingle() {
        wantMaybeSingle = true
        return Promise.resolve(execute())
      },
      then(resolve, reject) {
        return Promise.resolve(execute()).then(resolve, reject)
      },
    }

    return api
  }

  return { from, _store: store }
}
