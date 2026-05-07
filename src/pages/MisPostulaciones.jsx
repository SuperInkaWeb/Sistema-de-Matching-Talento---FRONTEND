import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { API_URL, buildHeaders } from '../services/auth.service'
import PostulacionModal from '../components/PostulationDetails.jsx'
import './MisPostulaciones.css'

const STATUS_MAP = {
  pending:   { label: 'En proceso', cls: 'postulacion-status--pending',   icon: '⏳' },
  accepted:  { label: 'Aceptado',   cls: 'postulacion-status--accepted',  icon: '✓' },
  rejected:  { label: 'Rechazado',  cls: 'postulacion-status--rejected',  icon: '✗' },
  cancelled: { label: 'Cancelada',  cls: 'postulacion-status--cancelled', icon: '—' },
}

export default function MisPostulaciones() {
  const { getAccessTokenSilently } = useAuth0()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getAccessTokenSilently()
        const res = await fetch(`${API_URL}/apply/myvacancies`, {
          headers: buildHeaders(token)
        })
        if (res.ok) {
          const data = await res.json()
          setApplications(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleCancel = async (vacancyId) => {
    if (!confirm('¿Cancelar tu postulación? Esta acción no se puede deshacer.')) return
    try {
      const token = await getAccessTokenSilently()
      const res = await fetch(`${API_URL}/apply/cancel/${vacancyId}`, {
        method: 'DELETE',
        headers: buildHeaders(token)
      })
      if (!res.ok) throw new Error('Error al cancelar')
      setApplications(prev => prev.map(a =>
        a.vacancy_id === vacancyId ? { ...a, status: 'cancelled' } : a
      ))
      setSelected(prev => prev?.vacancy_id === vacancyId
        ? { ...prev, status: 'cancelled' }
        : prev
      )
    } catch (err) {
      console.error(err)
      alert('No se pudo cancelar la postulación')
    }
  }

  if (loading) return <div className="route-loading"><div className="route-loading__spinner" /></div>

  return (
    <main className="mis-postulaciones">
      <div className="container">
        <h1 className="mis-postulaciones__title">Mis Postulaciones</h1>
        <p className="mis-postulaciones__count">
          {applications.length} postulación{applications.length !== 1 ? 'es' : ''}
        </p>

        {applications.length === 0 ? (
          <p className="mis-postulaciones__empty">
            Aún no te has postulado a ninguna vacante.
          </p>
        ) : (
          <div className="mis-postulaciones__list">
            {applications.map((app) => {
              const statusInfo = STATUS_MAP[app.status] || STATUS_MAP.pending
              return (
                <div
                  key={app.id}
                  className="postulacion-card"
                  onClick={() => setSelected(app)}
                >
                  <div className="postulacion-card__main">
                    <div className="postulacion-card__company-avatar">
                      {(app.company_name || 'E')}
                    </div>
                    <div>
                      <h3 className="postulacion-card__title">{app.title || 'Vacante'}</h3>
                      <p className="postulacion-card__meta">
                        {app.company_name || ''}{app.location ? ` · ${app.location}` : ''}
                      </p>
                      <div className="postulacion-card__tags">
                        {app.modality && <span className="tag--modality">{app.modality}</span>}
                        {app.work_schedule && <span className="tag--schedule">{app.work_schedule}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="postulacion-card__right">
                    <span className={`postulacion-status ${statusInfo.cls}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                    <p className="postulacion-card__date">
                      {app.applied_at
                        ? new Date(app.applied_at).toLocaleDateString('es', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : ''}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <PostulacionModal
        app={selected}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
      />
    </main>
  )
}