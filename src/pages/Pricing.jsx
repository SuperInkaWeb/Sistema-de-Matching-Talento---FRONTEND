import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from '../context/AuthContext'
import { API_URL, buildHeaders } from '../services/auth.service'
import './Pricing.css'

const MONTHLY_PRICE = 19.90
const ANNUAL_PRICE = +(MONTHLY_PRICE * 12 * 0.85).toFixed(2)
const ANNUAL_MONTHLY = +(ANNUAL_PRICE / 12).toFixed(2)

export default function Pricing() {
  const navigate = useNavigate()
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const { role } = useAuth()
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPago, setShowPago] = useState(false)
  const [cardForm, setCardForm] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [payError, setPayError] = useState(null)

  const handleActivate = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setShowPago(true)
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const token = await getAccessTokenSilently()
      const res = await fetch(`${API_URL}/subscription/activate`, {
        method: 'POST',
        headers: { ...buildHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingCycle: billing }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      setShowPago(false)
      setTimeout(() => navigate(role === 'company' ? '/dashboard' : '/profile'), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pricing-page">
      <div className="container">

        <div className="pricing-hero">
          <h1 className="pricing-hero__title">
            Potencia tu experiencia con{' '}
            <span className="pricing-hero__accent">Premium</span>
          </h1>
          <p className="pricing-hero__subtitle">
            Más puntos, recomendaciones ilimitadas de IA y mayor visibilidad.
          </p>

          <div className="pricing-toggle">
            <button
              className={`pricing-toggle__btn ${billing === 'monthly' ? 'pricing-toggle__btn--active' : ''}`}
              onClick={() => setBilling('monthly')}
            >
              Mensual
            </button>
            <button
              className={`pricing-toggle__btn ${billing === 'annual' ? 'pricing-toggle__btn--active' : ''}`}
              onClick={() => setBilling('annual')}
            >
              Anual
              <span className="pricing-toggle__badge">-15%</span>
            </button>
          </div>
        </div>

        {success && (
          <div className="pricing-success">
            🎉 ¡Plan Premium activado! Redirigiendo...
          </div>
        )}

        <div className="pricing-cards">

          {/* Free */}
          <div className="pricing-card">
            <div className="pricing-card__header">
              <h2 className="pricing-card__name">Gratis</h2>
              <div className="pricing-card__price">
                <span className="pricing-card__amount">S/ 0</span>
                <span className="pricing-card__period">/mes</span>
              </div>
            </div>
            <ul className="pricing-card__features">
              <li>✓ Acceso a todas las vacantes</li>
              <li>✓ Postulaciones ilimitadas</li>
              <li>✓ Subir CV en PDF</li>
              <li>✓ Perfil de candidato completo</li>
              <li>✓ Estudios académicos</li>
              <li>✓ 1 recomendación de IA por día</li>
              <li>✓ Sistema de puntos base</li>
              <li>✗ Multiplicador de puntos x1.3</li>
              <li>✗ Recomendaciones IA ilimitadas</li>
              <li>✗ Mayor visibilidad en búsquedas</li>
              <li>✗ Badge Premium destacado</li>
            </ul>
            <button className="pricing-card__btn pricing-card__btn--ghost" disabled>
              Plan actual
            </button>
          </div>

          {/* Premium */}
          <div className="pricing-card pricing-card--premium">
            <div className="pricing-card__badge">⭐ Más popular</div>
            <div className="pricing-card__header">
              <h2 className="pricing-card__name">Premium</h2>
              <div className="pricing-card__price">
                <span className="pricing-card__amount">
                  S/ {billing === 'monthly' ? MONTHLY_PRICE.toFixed(2) : ANNUAL_MONTHLY.toFixed(2)}
                </span>
                <span className="pricing-card__period">/mes</span>
              </div>
              {billing === 'annual' && (
                <p className="pricing-card__annual-note">
                  S/ {ANNUAL_PRICE.toFixed(2)} al año · Ahorras S/ {(MONTHLY_PRICE * 12 - ANNUAL_PRICE).toFixed(2)}
                </p>
              )}
            </div>
            <ul className="pricing-card__features">
              <li>✓ Todo lo del plan Gratis</li>
              <li className="pricing-card__feature--highlight">✓ Recomendaciones IA ilimitadas</li>
              <li className="pricing-card__feature--highlight">✓ Multiplicador de puntos x1.3</li>
              <li className="pricing-card__feature--highlight">✓ Mayor visibilidad en búsquedas</li>
              <li className="pricing-card__feature--highlight">✓ Badge Premium ⭐ en tu perfil</li>
              <li>✓ Prioridad en recomendaciones de IA</li>
              <li>✓ Soporte prioritario</li>
              <li>✓ Válido para candidatos y empresas</li>
            </ul>
            <button
              className="pricing-card__btn pricing-card__btn--primary"
              onClick={handleActivate}
              disabled={loading}
            >
              {loading ? 'Procesando...' : `Activar Premium ${billing === 'annual' ? 'Anual' : 'Mensual'}`}
            </button>
          </div>
        </div>

        {/* Tabla comparativa */}
        <div className="pricing-comparison">
          <h2 className="pricing-comparison__title">Comparación detallada</h2>
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Característica</th>
                <th>Gratis</th>
                <th className="pricing-table__th--premium">Premium ⭐</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Vacantes disponibles', '✓', '✓'],
                ['Postulaciones', 'Ilimitadas', 'Ilimitadas'],
                ['Subir CV', '✓', '✓'],
                ['Estudios académicos', '✓', '✓'],
                ['Recomendaciones IA', '1 por día', '♾️ Ilimitadas'],
                ['Multiplicador puntos', 'x1.0', 'x1.3 ⭐'],
                ['Visibilidad en IA', 'Normal', 'Prioritaria'],
                ['Badge Premium', '—', '⭐ Sí'],
                ['Invitaciones', '5 (candidato)', 'Ilimitadas'],
                ['Soporte', 'Estándar', 'Prioritario'],
              ].map(([feat, free, premium]) => (
                <tr key={feat}>
                  <td>{feat}</td>
                  <td className="pricing-table__cell--center">{free}</td>
                  <td className="pricing-table__cell--center pricing-table__cell--premium">{premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="pricing-faq">
          <h2 className="pricing-comparison__title">Preguntas frecuentes</h2>
          <div className="pricing-faq__grid">
            {[
              ['¿Aplica para candidatos y empresas?', 'Sí, el plan Premium aplica a ambos roles. Las empresas obtienen mayor visibilidad en recomendaciones de IA y multiplicador en sus puntos.'],
              ['¿Puedo cancelar en cualquier momento?', 'Sí. Puedes cancelar tu suscripción desde tu perfil. El acceso Premium se mantiene hasta el fin del período pagado.'],
              ['¿Qué pasa con mis puntos al activar Premium?', 'Los puntos acumulados antes de activar Premium se mantienen. A partir de la activación, todas las nuevas acciones multiplican x1.3.'],
              ['¿El plan anual tiene descuento?', 'Sí, el plan anual tiene un 15% de descuento equivalente a casi 2 meses gratis.'],
            ].map(([q, a]) => (
              <div key={q} className="pricing-faq__item">
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pago modal */}
      {showPago && (
        <div className="modal-overlay" onClick={() => setShowPago(false)}>
          <div className="modal pricing-pago-modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">💳 Pago seguro con Pay-me</h2>
              <button className="modal__close" onClick={() => setShowPago(false)}>✕</button>
            </div>

            <div className="pricing-pago__plan">
              <p>Plan: <strong>Premium {billing === 'annual' ? 'Anual' : 'Mensual'}</strong></p>
              <p className="pricing-pago__price">
                S/ {billing === 'monthly' ? MONTHLY_PRICE.toFixed(2) : ANNUAL_PRICE.toFixed(2)}
                {billing === 'annual' ? '/año' : '/mes'}
              </p>
            </div>

            <form className="pricing-pago__form" onSubmit={async (e) => {
              e.preventDefault()
              setLoading(true)
              setPayError(null)
              try {
                const token = await getAccessTokenSilently()
                const res = await fetch(`${API_URL}/subscription/activate`, {
                  method: 'POST',
                  headers: { ...buildHeaders(token), 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    billingCycle: billing,
                    cardNumber: cardForm.number,
                    expiry: cardForm.expiry,
                    cvv: cardForm.cvv,
                    cardName: cardForm.name,
                  }),
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Error en el pago')
                setSuccess(true)
                setShowPago(false)
                setTimeout(() => navigate(role === 'company' ? '/dashboard' : '/profile'), 2000)
              } catch (err) {
                setPayError(err.message)
              } finally {
                setLoading(false)
              }
            }}>
              <div className="form-field">
                <label className="form-label">Número de tarjeta</label>
                <input className="form-input" required maxLength={19}
                  placeholder="4111 1111 1111 1111"
                  value={cardForm.number}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                    const formatted = val.match(/.{1,4}/g)?.join(' ') || val
                    setCardForm(p => ({ ...p, number: formatted }))
                  }} />
              </div>
              <div className="form-field">
                <label className="form-label">Nombre en la tarjeta</label>
                <input className="form-input" required
                  placeholder="PEDRO MIRANDA"
                  value={cardForm.name}
                  onChange={e => setCardForm(p => ({ ...p, name: e.target.value.toUpperCase() }))} />
              </div>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Vencimiento</label>
                  <input className="form-input" required maxLength={5}
                    placeholder="MM/AA"
                    value={cardForm.expiry}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                      const formatted = val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val
                      setCardForm(p => ({ ...p, expiry: formatted }))
                    }} />
                </div>
                <div className="form-field">
                  <label className="form-label">CVV</label>
                  <input className="form-input" required maxLength={4}
                    placeholder="123" type="password"
                    value={cardForm.cvv}
                    onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} />
                </div>
              </div>

              {payError && (
                <div className="form-error">✗ {payError}</div>
              )}

              <div className="pricing-pago__secure">
                🔒 Pago procesado de forma segura por <strong>Pay-me / Alignet</strong>
              </div>

              <button type="submit" className="form-save-btn" disabled={loading}>
                {loading ? 'Procesando...' : `Pagar S/ ${billing === 'monthly' ? MONTHLY_PRICE.toFixed(2) : ANNUAL_PRICE.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}