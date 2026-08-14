import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from './index.js'

async function createTestRouter(initialPath = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  await router.push(initialPath)
  await router.isReady()
  return router
}

describe('app routes', () => {
  it('redirects / to /about', async () => {
    const router = await createTestRouter('/')
    expect(router.currentRoute.value.path).toBe('/about')
  })

  it('resolves sidebar pages', async () => {
    const pages = [
      { path: '/about', name: 'about' },
      { path: '/motto', name: 'motto' },
      { path: '/focus', name: 'focus' },
      { path: '/agents', name: 'agents' },
      { path: '/form', name: 'form' },
    ]
    for (const page of pages) {
      const router = await createTestRouter(page.path)
      expect(router.currentRoute.value.path).toBe(page.path)
      expect(router.currentRoute.value.name).toBe(page.name)
    }
  })
})
