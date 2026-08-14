import { describe, it, expect } from 'vitest'
import { emptyForm, validateForm, submitForm, loadSubmissions } from './form.js'

const validForm = {
  name: '张三',
  phone: '13800138000',
  address: '上海市浦东新区',
  occupation: '工程师',
  hobby: '阅读',
}

describe('validateForm', () => {
  it('requires all fields', () => {
    const errors = validateForm(emptyForm())
    expect(errors.name).toBe('请填写姓名')
    expect(errors.phone).toBe('请填写电话')
    expect(errors.address).toBe('请填写住址')
    expect(errors.occupation).toBe('请填写职业')
    expect(errors.hobby).toBe('请填写爱好')
  })

  it('treats whitespace-only values as empty', () => {
    const errors = validateForm({
      name: '   ',
      phone: '  ',
      address: '\t',
      occupation: ' ',
      hobby: '  ',
    })
    expect(errors.name).toBe('请填写姓名')
    expect(errors.phone).toBe('请填写电话')
    expect(errors.address).toBe('请填写住址')
    expect(errors.occupation).toBe('请填写职业')
    expect(errors.hobby).toBe('请填写爱好')
  })

  it('rejects an invalid phone number', () => {
    const errors = validateForm({ ...validForm, phone: '123' })
    expect(errors.phone).toBe('请填写有效电话')
  })

  it('accepts a valid form', () => {
    expect(validateForm(validForm)).toEqual({})
  })
})

describe('submitForm', () => {
  it('does not succeed when the form is invalid', async () => {
    let called = false
    const request = async () => {
      called = true
      return { ok: true, json: async () => ({}) }
    }
    const result = await submitForm(emptyForm(), request)
    expect(result.ok).toBe(false)
    expect(result.errors.name).toBe('请填写姓名')
    expect(called).toBe(false)
  })

  it('posts a valid form to the api', async () => {
    let calledUrl
    let calledOptions
    const request = async (url, options) => {
      calledUrl = url
      calledOptions = options
      return {
        ok: true,
        json: async () => ({
          ok: true,
          message: '提交成功',
          item: { id: '1', ...validForm },
        }),
      }
    }
    const result = await submitForm(validForm, request)
    expect(calledUrl).toBe('/api/form')
    expect(calledOptions.method).toBe('POST')
    expect(JSON.parse(calledOptions.body)).toEqual(validForm)
    expect(result).toEqual({
      ok: true,
      message: '提交成功',
      item: { id: '1', ...validForm },
    })
  })

  it('returns errors when the api rejects the form', async () => {
    const request = async () => ({
      ok: false,
      json: async () => ({ detail: { phone: '请填写有效电话' } }),
    })
    const result = await submitForm(validForm, request)
    expect(result.ok).toBe(false)
    expect(result.errors.phone).toBe('请填写有效电话')
  })
})

describe('loadSubmissions', () => {
  it('loads submissions from the api', async () => {
    const request = async (url) => {
      expect(url).toBe('/api/form')
      return {
        ok: true,
        json: async () => ({ items: [{ id: '1', name: '张三' }] }),
      }
    }
    const items = await loadSubmissions(request)
    expect(items).toEqual([{ id: '1', name: '张三' }])
  })
})
