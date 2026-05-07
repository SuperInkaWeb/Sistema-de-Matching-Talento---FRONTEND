import { useNavigate } from 'react-router-dom'
import './VacancyRecommendations.css'

export default function VacancyRecommendations({ recommendations, vacancies, loading, limitReached, profileIncomplete, onSelect }) {
  const navigate = useNavigate()

  if (profileIncomplete) {
    return (
      <div className="recommendations-section">
        <h2 className="recommendations__title">✨ Recomendadas para ti</h2>
        <div className="recommendations__limit">
          <p>📝 Completa tu perfil para recibir recomendaciones personalizadas.</p>
          <p>Agrega tus <strong>habilidades e idiomas</strong> para que la IA pueda encontrar las mejores vacantes para ti.</p>
          <button className="recommendations__upgrade-btn" onClick={() => navigate('/profile')}>
            Completar mi perfil
          </button>
        </div>
      </div>
    )
  }

  if (limitReached) {
    return (
      <div className="recommendations-section">
        <h2 className="recommendations__title">✨ Recomendadas para ti</h2>
        <div className="recommendations__limit">
          <p>⭐ Has usado tu recomendación diaria gratuita.</p>
          <p>Actualiza a <strong>Premium</strong> para acceso ilimitado.</p>
          <button className="recommendations__upgrade-btn" onClick={() => navigate('/premium')}>
            Ver plan Premium
          </button>
        </div>
      </div>
    )
  }

  if (!loading && recommendations.length === 0) return null

  return (
    <div className="recommendations-section">
      <h2 className="recommendations__title">✨ Recomendadas para ti</h2>
      {loading ? (
        <div className="recommendations__skeletons">
          {[1, 2, 3].map(i => <div key={i} className="recommendation-skeleton" />)}
        </div>
      ) : (
        <div className="recommendations__list">
          {recommendations.map((rec) => {
            const vacancy = vacancies.find(v => v.id === rec.vacancy_id)
            if (!vacancy) return null
            return (
              <div key={rec.vacancy_id} className="recommendation-card" onClick={() => onSelect(vacancy)}>
                <div className="recommendation-card__score">{rec.score}% match</div>
                <h3 className="recommendation-card__title">{vacancy.title}</h3>
                <p className="recommendation-card__company">{vacancy.company_name}</p>
                <p className="recommendation-card__reason">{rec.reason}</p>
                <div className="recommendation-card__tags">
                  {vacancy.modality && <span className="vacancy-tag">{vacancy.modality}</span>}
                  {vacancy.work_schedule && <span className="vacancy-tag">{vacancy.work_schedule}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}