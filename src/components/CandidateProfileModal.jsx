import './CandidateProfileModal.css'

export default function CandidateProfileModal({ candidate, onClose, onViewCV }) {
    if (!candidate) return null

    const parseList = (val) =>
        typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : val || []

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal candidate-modal" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <div>
                        <h2 className="modal__title">{candidate.first_name} {candidate.last_name}</h2>
                        <p className="candidate-modal__location">{candidate.city}, {candidate.country}</p>
                    </div>
                    <button className="modal__close" onClick={onClose}>✕</button>
                </div>

                <div className="candidate-modal__body">

                    <div className="candidate-modal__grid">
                        <div className="candidate-modal__field">
                            <span className="candidate-modal__label">Experiencia</span>
                            <span className="candidate-modal__value">{candidate.experience_years} años</span>
                        </div>
                        {candidate.linkedin_url && (
                            <div className="candidate-modal__field">
                                <span className="candidate-modal__label">LinkedIn</span>
                                <a href={candidate.linkedin_url} target="_blank" rel="noreferrer"
                                    className="candidate-modal__link">
                                    Ver perfil →
                                </a>
                            </div>
                        )}
                        {candidate.portfolio_url && (
                            <div className="candidate-modal__field">
                                <span className="candidate-modal__label">Portafolio</span>
                                <a href={candidate.portfolio_url} target="_blank" rel="noreferrer"
                                    className="candidate-modal__link">
                                    Ver portafolio →
                                </a>
                            </div>
                        )}
                    </div>

                    {parseList(candidate.skills).length > 0 && (
                        <div className="candidate-modal__section">
                            <span className="candidate-modal__label">Habilidades</span>
                            <div className="candidate-modal__tags">
                                {parseList(candidate.skills).map((s, i) => (
                                    <span key={i} className="candidate-modal__tag candidate-modal__tag--skill">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {parseList(candidate.languages).length > 0 && (
                        <div className="candidate-modal__section">
                            <span className="candidate-modal__label">Idiomas</span>
                            <div className="candidate-modal__tags">
                                {parseList(candidate.languages).map((l, i) => (
                                    <span key={i} className="candidate-modal__tag candidate-modal__tag--lang">🌐 {l}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {candidate.candidate_profile_id && (
                        <button
                            className="dash-btn dash-btn--primary candidate-modal__cv-btn"
                            onClick={() => onViewCV(candidate.candidate_profile_id)}
                        >
                            📄 Ver CV completo
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
