import { useState, useEffect } from 'react'
import { API_URL, buildHeaders } from '../services/auth.service'
import './PointsBadge.css'

export default function PointsBadge({ token, showHistory = false }) {
    const [data, setData] = useState(null)

    useEffect(() => {
        if (!token) return
        fetch(`${API_URL}/points/me`, { headers: buildHeaders(token) })
            .then(r => r.ok ? r.json() : null)
            .then(d => setData(d))
            .catch(() => { })
    }, [token])

    if (!data) return null

    const getLevel = (pts) => {
        if (pts >= 200) return { label: '🏆 Elite', color: '#f59e0b' }
        if (pts >= 100) return { label: '⭐ Pro', color: '#7c3aed' }
        if (pts >= 50) return { label: '🔥 Activo', color: '#3DBFB8' }
        return { label: '🌱 Nuevo', color: '#16a34a' }
    }

    const level = getLevel(data.points)

    return (
        <div className="points-badge">
            <div className="points-badge__main">
                <span className="points-badge__pts">{data.points} pts</span>
                <span className="points-badge__level" style={{ color: level.color }}>
                    {level.label}
                </span>
                <span className="points-badge__month">este mes</span>
            </div>

            {showHistory && data.history?.length > 0 && (
                <div className="points-badge__history">
                    <p className="points-badge__history-title">Últimas actividades</p>
                    {data.history.slice(0, 5).map((h, i) => (
                        <div key={i} className="points-badge__history-item">
                            <span className="points-badge__history-desc">{h.description}</span>
                            <span className="points-badge__history-pts">+{h.points}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
