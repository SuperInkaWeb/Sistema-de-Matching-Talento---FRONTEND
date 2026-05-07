import './PostulationDetails.css'

const STATUS_MAP = {
  pending:   { label: 'En proceso', cls: 'postulacion-status--pending',   icon: '⏳' },
  accepted:  { label: 'Aceptado',   cls: 'postulacion-status--accepted',  icon: '✓' },
  rejected:  { label: 'Rechazado',  cls: 'postulacion-status--rejected',  icon: '✗' },
  cancelled: { label: 'Cancelada',  cls: 'postulacion-status--cancelled', icon: '—' },
}

export default function PostulacionModal({ app, onClose, onCancel }) {
  if (!app) return null

  const statusInfo = STATUS_MAP[app.status] || STATUS_MAP.pending

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal postulacion-modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div>
            <h2 className="modal__title">{app.title}</h2>
            <p className="postulacion-modal__company">{app.company_name}</p>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="postulacion-modal__body">

          <div className="postulacion-modal__status-row">
            <span className={`postulacion-status ${statusInfo.cls}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
            <span className="postulacion-modal__date">
              Postulado el {app.applied_at
                ? new Date(app.applied_at).toLocaleDateString('es', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })
                : '—'}
            </span>
          </div>

          <div className="postulacion-modal__grid">
            {app.location && (
              <div className="postulacion-modal__field">
                <span className="postulacion-modal__label">📍 Ubicación</span>
                <span className="postulacion-modal__value">{app.location}</span>
              </div>
            )}
            {app.modality && (
              <div className="postulacion-modal__field">
                <span className="postulacion-modal__label">💼 Modalidad</span>
                <span className="postulacion-modal__value">{app.modality}</span>
              </div>
            )}
            {app.work_schedule && (
              <div className="postulacion-modal__field">
                <span className="postulacion-modal__label">🕐 Jornada</span>
                <span className="postulacion-modal__value">{app.work_schedule}</span>
              </div>
            )}
            {(app.salary_min || app.salary_max) && (
              <div className="postulacion-modal__field">
                <span className="postulacion-modal__label">💰 Salario</span>
                <span className="postulacion-modal__value">
                  S/ {app.salary_min} — S/ {app.salary_max}
                </span>
              </div>
            )}
          </div>

          {app.description && (
            <div className="postulacion-modal__section">
              <span className="postulacion-modal__label">Descripción del puesto</span>
              <p className="postulacion-modal__desc">{app.description}</p>
            </div>
          )}

          {app.languages?.length > 0 && (
            <div className="postulacion-modal__section">
              <span className="postulacion-modal__label">Idiomas requeridos</span>
              <div className="postulacion-modal__tags">
                {(typeof app.languages === 'string'
                  ? app.languages.split(',')
                  : app.languages
                ).map((l, i) => (
                  <span key={i} className="vacancy-skill">🌐 {l.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {app.status === 'pending' && (
            <button
              className="apply-cancel-btn apply-cancel-btn--full"
              onClick={() => onCancel(app.vacancy_id)}
            >
              Cancelar postulación
            </button>
          )}
        </div>
      </div>
    </div>
  )
}