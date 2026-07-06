const VITE_API_URL = import.meta.env.VITE_API_URL as string
const VITE_DEFAULT_MODEL = (import.meta.env.VITE_DEFAULT_MODEL as string | undefined) ?? 'gpt-4o-mini'
const VITE_ENAMAD_ID = import.meta.env.VITE_ENAMAD_ID as string | undefined
const VITE_ENAMAD_CODE = import.meta.env.VITE_ENAMAD_CODE as string | undefined

if (!VITE_API_URL) throw new Error('Missing env: VITE_API_URL')

export const env = { VITE_API_URL, VITE_DEFAULT_MODEL, VITE_ENAMAD_ID, VITE_ENAMAD_CODE }
