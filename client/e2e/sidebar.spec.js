import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

/** @type {import('@playwright/test').Page} */
let page

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:5173',
  })
  page = await context.newPage()
})

test.afterAll(async () => {
  await page.context().close()
})

const pages = [
  {
    menu: '简介',
    path: /\/about/,
    check: async () => {
      await expect(page.getByRole('heading', { name: '会飞的特洛伊' })).toBeVisible()
      await expect(page.getByRole('heading', { name: '个性速写' })).toBeVisible()
    },
  },
  {
    menu: '座右铭',
    path: /\/motto/,
    check: async () => {
      await expect(page.getByRole('heading', { name: '座右铭' })).toBeVisible()
      await expect(page.getByText('世上无难事，只要肯登攀')).toBeVisible()
    },
  },
  {
    menu: '方向',
    path: /\/focus/,
    check: async () => {
      await expect(page.getByRole('heading', { name: '正在做的事' })).toBeVisible()
      await expect(page.getByText('AI 开发').first()).toBeVisible()
    },
  },
  {
    menu: 'Agent',
    path: /\/agents/,
    check: async () => {
      await expect(page.getByRole('heading', { name: 'Agent 展示' })).toBeVisible()
      await expect(page.getByText('待更新')).toBeVisible()
    },
  },
  {
    menu: '表单填写',
    path: /\/form/,
    check: async () => {
      await expect(page.getByRole('heading', { name: '表单填写' })).toBeVisible()
      await expect(page.getByPlaceholder('请填写姓名')).toBeVisible()
      await expect(page.getByPlaceholder('请填写电话')).toBeVisible()
      await expect(page.getByPlaceholder('请填写住址')).toBeVisible()
      await expect(page.getByPlaceholder('请填写职业')).toBeVisible()
      await expect(page.getByPlaceholder('请填写爱好')).toBeVisible()
    },
  },
]

test('opens / and lands on about', async () => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/about/)
  await expect(page.getByRole('heading', { name: '会飞的特洛伊' })).toBeVisible()
})


for (const item of pages) {
    test(`sidebar navigates to ${item.menu}`, async () => {
      await page.getByRole('menuitem', { name: item.menu }).click()
      await expect(page).toHaveURL(item.path)
      await item.check()
    })
}

test('submits the profile form', async () => {
  await page.goto('/form')
  await page.getByPlaceholder('请填写姓名').click()
  await page.getByPlaceholder('请填写姓名').pressSequentially('张三', { delay: 150 })
  await page.getByPlaceholder('请填写电话').click()
  await page.getByPlaceholder('请填写电话').pressSequentially('13800138000', { delay: 80 })
  await page.getByPlaceholder('请填写住址').click()
  await page.getByPlaceholder('请填写住址').pressSequentially('上海市浦东新区', { delay: 80 })
  await page.getByPlaceholder('请填写职业').click()
  await page.getByPlaceholder('请填写职业').pressSequentially('工程师', { delay: 150 })
  await page.getByPlaceholder('请填写爱好').click()
  await page.getByPlaceholder('请填写爱好').pressSequentially('阅读', { delay: 150 })
  await page.getByRole('button', { name: '提交' }).click()
  await expect(page.getByText('提交成功')).toBeVisible()
  await expect(page.getByPlaceholder('请填写姓名')).toHaveValue('')
  await expect(page.getByRole('heading', { name: '已提交记录' })).toBeVisible()
  await expect(page.locator('.submission-item').filter({ hasText: '张三' }).first()).toBeVisible()
})