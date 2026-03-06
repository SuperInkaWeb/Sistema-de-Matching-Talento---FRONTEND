import { useEffect, useState } from "react"
import { getVacancies } from "../services/vacancy.service.js"

function Vacancies() {

  const [vacancies, setVacancies] = useState([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadVacancies()
  }, [])

  const loadVacancies = async () => {
    try {
      const data = await getVacancies()
      setVacancies(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1>Vacantes</h1>

      {vacancies.map((vacancy) => (
        <div key={vacancy.id}>
          <h3>{vacancy.title}</h3>
          <p>{vacancy.description}</p>
        </div>
      ))}

    </div>
  )
}

export default Vacancies
