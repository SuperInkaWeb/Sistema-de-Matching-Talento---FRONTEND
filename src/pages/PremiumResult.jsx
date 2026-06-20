import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function PremiumResult({ status }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const config = {
    success: { icon: '🎉', title: '¡Pago exitoso!', text: 'Tu plan Premium está siendo activado. Puede tardar unos segundos en reflejarse.' },
    failure: { icon: '✗', title: 'Pago rechazado', text: 'No se pudo procesar el pago. Intenta nuevamente o usa otro método.' },
    pending: { icon: '⏳', title: 'Pago pendiente', text: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.' },
  }[status]

  return (
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
      <div>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{config.icon}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>{config.title}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{config.text}</p>
        <button className="form-save-btn" onClick={() => navigate('/profile')}>
          Ir a mi perfil
        </button>
      </div>
    </main>
  )
}