import api from "./api.js"

export const getVacancies = async () => {
  const res = await api.get("/vacancy/all")
  return res.data
}

export const createVacancy = async (data, token) => {
  const res = await api.post("/vacancy", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.data
}