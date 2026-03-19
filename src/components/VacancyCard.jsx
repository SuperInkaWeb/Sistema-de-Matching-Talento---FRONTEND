import './VacancyCard.css'

export default function VacancyCard({ vacancy, applied, onVerDetalles }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="vacancy-card">
      <div className="vacancy-card__header">
        <div className="vacancy-card__company-logo">
          {vacancy.company_name?.[0] || 'E'}
        </div>
        <div className="vacancy-card__meta">
          <p className="vacancy-card__company">{vacancy.company_name || 'Empresa'}</p>
          <p className="vacancy-card__date">{formatDate(vacancy.created_at)}</p>
        </div>
      </div>
      <h3 className="vacancy-card__title">{vacancy.title}</h3>
      {(vacancy.company_city || vacancy.company_country) && (
        <p className="vacancy-card__location">
          {[vacancy.company_city, vacancy.company_country].filter(Boolean).join(', ')}
        </p>
      )}
      <div className="vacancy-card__tags">
        {vacancy.modality && <span className="vacancy-tag">{vacancy.modality}</span>}
        {vacancy.work_schedule && <span className="vacancy-tag">{vacancy.work_schedule}</span>}
        {vacancy.location && <span className="vacancy-tag vacancy-tag--location">📍 {vacancy.location}</span>}
      </div>
      <p className="vacancy-card__desc vacancy-card__desc--clamp">{vacancy.description}</p>
      <div className="vacancy-card__footer">
        <button
          className={`vacancy-card__apply-btn ${applied ? 'vacancy-card__apply-btn--applied' : ''}`}
          onClick={() => onVerDetalles(vacancy)}
        >
          {applied ? '✓ Ya postulado' : 'Ver detalles'}
        </button>
      </div>
    </div>
  )
}