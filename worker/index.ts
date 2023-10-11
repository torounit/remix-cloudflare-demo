import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'

const app = new Hono()


app.use('*', logger())

app.get('/hello', async (c) => {
  return c.text('hello!');
});

app.get('/*',
  async (c) => {
    const url = new URL(c.req.url);

    if (!c.env?.ORIGIN) {
      throw new HTTPException(500, { message: 'Not defined vars' })
    }

    const newURL = url.href.replace(url.origin, c.env.ORIGIN as string);
    // @ts-ignore
    const cache = caches.default as Cache;
    let response = await cache.match(newURL);

    if (!response) {
      response = await fetch(newURL);
      response = new Response(response.body, response)
      response.headers.append('Cache-Control', 's-maxage=60')
      c.executionCtx.waitUntil(cache.put(newURL, response.clone()))
    }
    return response;

  })

export default app