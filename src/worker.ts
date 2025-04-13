/// <reference types="@cloudflare/workers-types" />

import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export interface Env {
  HOBBY_LIST: KVNamespace
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    
    // APIエンドポイントの処理
    if (url.pathname.startsWith('/api/')) {
      switch (url.pathname) {
        case '/api/hobbies':
          if (request.method === 'GET') {
            const data = await env.HOBBY_LIST.get('hobbies')
            return new Response(data || '[]', {
              headers: { 'Content-Type': 'application/json' }
            })
          }
          if (request.method === 'POST') {
            const data = await request.json()
            await env.HOBBY_LIST.put('hobbies', JSON.stringify(data))
            return new Response('OK', { status: 200 })
          }
          return new Response('Method not allowed', { status: 405 })
        default:
          return new Response('Not found', { status: 404 })
      }
    }

    // 静的ファイルの処理
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.HOBBY_LIST,
          ASSET_MANIFEST: {},
        }
      )
    } catch (e) {
      return new Response(`"${url.pathname}" not found`, {
        status: 404,
        statusText: 'not found',
      })
    }
  },
} 