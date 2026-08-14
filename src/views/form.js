const FIELD_MESSAGES = {
  name: '请填写姓名',
  phone: '请填写电话',
  address: '请填写住址',
  occupation: '请填写职业',
  hobby: '请填写爱好',
}

const PHONE_PATTERN = /^1[3-9]\d{9}$/

export function emptyForm() {
  return {
    name: '',
    phone: '',
    address: '',
    occupation: '',
    hobby: '',
  }
}

export function validateForm(form) {
  const errors = {}

  for (const [field, message] of Object.entries(FIELD_MESSAGES)) {
    if (!String(form[field] ?? '').trim()) {
      errors[field] = message
    }
  }

  if (!errors.phone && !PHONE_PATTERN.test(String(form.phone).trim())) {
    errors.phone = '请填写有效电话'
  }

  return errors
}

export async function submitForm(form, request = fetch) {
  const errors = validateForm(form)
  if (Object.keys(errors).length) {
    return { ok: false, errors }
  }

  const payload = {
    name: form.name,
    phone: form.phone,
    address: form.address,
    occupation: form.occupation,
    hobby: form.hobby,
  }

  const res = await request('/api/form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) {
    const apiErrors =
      data.detail && typeof data.detail === 'object' && !Array.isArray(data.detail)
        ? data.detail
        : {}
    return { ok: false, errors: apiErrors, message: data.message }
  }
  return { ok: true, message: data.message, item: data.item }
}

export async function loadSubmissions(request = fetch) {
  const res = await request('/api/form')
  const data = await res.json()
  return data.items ?? []
}

export const formRules = {
  name: [{ required: true, whitespace: true, message: FIELD_MESSAGES.name, trigger: 'blur' }],
  phone: [
    { required: true, whitespace: true, message: FIELD_MESSAGES.phone, trigger: 'blur' },
    { pattern: PHONE_PATTERN, message: '请填写有效电话', trigger: 'blur' },
  ],
  address: [{ required: true, whitespace: true, message: FIELD_MESSAGES.address, trigger: 'blur' }],
  occupation: [{ required: true, whitespace: true, message: FIELD_MESSAGES.occupation, trigger: 'blur' }],
  hobby: [{ required: true, whitespace: true, message: FIELD_MESSAGES.hobby, trigger: 'blur' }],
}
