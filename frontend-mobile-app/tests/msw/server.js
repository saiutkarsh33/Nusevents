import { setupServer } from 'msw'
import { handlers } from './handlers'

export const server = setupServer(handlers)