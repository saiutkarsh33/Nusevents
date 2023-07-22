import { rest } from 'msw'

export const handlers = [
    rest.post('https://your-supabase-url/rest/v1/events', (req, res, ctx) => {
      // Respond with a 200 status to indicate success
      return res(ctx.status(200))
    })
  ]

  