import {
  API_URL,
  buildHeaders
} from './auth.service'

export async function getVacancies(token) {
  const res = await fetch(`${API_URL}/vacancy/all`, { headers: buildHeaders(token) })
  if (!res.ok) throw new Error('Error fetching vacancies')
  return res.json()
}

export async function getVacancyById(id, token) {
  const res = await fetch(`${API_URL}/vacancy/${id}`, { headers: buildHeaders(token) })
  if (!res.ok) throw new Error('Error fetching vacancy')
  return res.json()
}

export const applyToVacancy = async (vacancyId, token) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const res = await fetch(`${API_URL}/apply/${vacancyId}`, {
      method: 'POST',
      headers: buildHeaders(token),
      signal: controller.signal
    })
    clearTimeout(timeout)
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Error al postular')
    }
    return await res.json()
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') throw new Error('La solicitud tardó demasiado. Intenta de nuevo.')
    throw err
  }
}

export async function getMyApplications(token) {
  const res = await fetch(`${API_URL}/apply/myvacancies`, {
    headers: buildHeaders(token),
  })
  if (!res.ok) throw new Error('Error fetching applications')
  return res.json()
}

export async function createVacancy(data, token) {
  const res = await fetch(`${API_URL}/vacancy/create`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error creating vacancy')
  return res.json()
}
