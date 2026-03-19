import { useNavigate } from 'react-router-dom'
import './VacancyModal.css'

export default function VacancyModal({
  vacancy, onClose, onApply, applied,
  applying, applySuccess, showConfirm,
  setShowConfirm, candidateProfile,
  isAuthenticated, role
}) {
  const navigate = useNavigate()

  const parseLangs = (langs) => {
    if (!langs) return []
    return typeof langs === 'string' ? langs.split(',') : langs
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <div>
            <h2 className="modal__title">{vacancy.title}</h2>
            <p className="modal__subtitle">
              {vacancy.company_name}
              {(vacancy.company_city || vacancy.company_country) &&
                ` · ${[vacancy.company_city, vacancy.company_country].filter(Boolean).join(', ')}`}
              {vacancy.location && ` · ${vacancy.location}`}
            </p>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="vacancy-card__tags modal__tags">
          {vacancy.modality && <span className="vacancy-tag">{vacancy.modality}</span>}
          {vacancy.work_schedule && <span className="vacancy-tag">{vacancy.work_schedule}</span>}
        </div>

        {(vacancy.salary_min || vacancy.salary_max) && (
          <div className="modal__salary">
            <p className="modal__salary-label">Salario</p>
            <p className="modal__salary-value">
              {vacancy.salary_min && `S/ ${vacancy.salary_min}`}
              {vacancy.salary_min && vacancy.salary_max && ' — '}
              {vacancy.salary_max && `S/ ${vacancy.salary_max}`}
            </p>
          </div>
        )}

        {parseLangs(vacancy.languages).length > 0 && (
          <div className="modal__languages">
            <h3 className="modal__languages-title">Idiomas requeridos</h3>
            <div className="modal__languages-list">
              {parseLangs(vacancy.languages).map((lang, i) => (
                <span key={i} className="modal__language-tag">
                  🌐 {lang.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="modal__description">
          <h3 className="modal__description-title">Descripción</h3>
          <p>{vacancy.description}</p>
        </div>

        {applySuccess && (
          <div className="modal__success">✓ ¡Postulación enviada con éxito!</div>
        )}

        {!isAuthenticated ? (
          <button className="vacancy-card__apply-btn modal__btn-full" onClick={() => navigate('/login')}>
            Inicia sesión para postularte
          </button>
        ) : role === 'candidate' && !showConfirm ? (
          <button
            className={`vacancy-card__apply-btn modal__btn-full ${applied ? 'vacancy-card__apply-btn--applied' : ''}`}
            onClick={() => !applied && setShowConfirm(true)}
            disabled={applied}
          >
            {applied ? '✓ Ya postulado' : 'Postularme'}
          </button>
        ) : role === 'candidate' && showConfirm ? (
          <div className="modal__confirm">
            <h4 className="modal__confirm-title">Confirmar postulación</h4>
            <p><strong>Nombre:</strong> {candidateProfile?.first_name} {candidateProfile?.last_name}</p>
            <p><strong>Ciudad:</strong> {candidateProfile?.city}, {candidateProfile?.country}</p>
            <p><strong>Experiencia:</strong> {candidateProfile?.experience_years} años</p>
            {candidateProfile?.linkedin_url && (
              <p><strong>LinkedIn:</strong> {candidateProfile.linkedin_url}</p>
            )}
            <p className="modal__confirm-note">Se enviará tu perfil actual al empleador.</p>
            <div className="modal__confirm-actions">
              <button className="btn-retry" onClick={() => setShowConfirm(false)}>Cancelar</button>
              <button
                className="vacancy-card__apply-btn"
                onClick={() => onApply(vacancy.id)}
                disabled={applying}
                style={{ flex: 2 }}
              >
                {applying ? 'Enviando...' : 'Confirmar postulación'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}