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
  const [payError, setPayError] = useState(null)

  const handleActivatePremium = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setLoading(true)
    setPayError(null)
    try {
      const token = await getAccessTokenSilently()
      const res = await fetch(`${API_URL}/subscription/checkout`, {
        method: 'POST',
        headers: { ...buildHeaders(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingCycle: billing }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al iniciar el pago')

      // Redirige a Mercado Pago Checkout
      window.location.href = data.checkoutUrl
    } catch (err) {
      setPayError(err.message)
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

        {payError && (
          <p className="form-error" style={{ textAlign: 'center', marginTop: 12, marginBottom: 12 }}>
            ✗ {payError}
          </p>
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
              onClick={handleActivatePremium}
              disabled={loading}
            >
              {loading ? 'Redirigiendo...' : `Activar Premium ${billing === 'annual' ? 'Anual' : 'Mensual'}`}
            </button>
            <p className="pricing-card__secure-note">
              🔒 Pago procesado de forma segura por <strong>Mercado Pago</strong>
            </p>
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
    </main>
  )
}