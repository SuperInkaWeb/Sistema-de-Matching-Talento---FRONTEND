import { useState, useEffect } from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import './AdminAnalytics.css'

const COLORS = ['#3DBFB8', '#0a0a0f', '#f59e0b', '#e11d48', '#7c3aed', '#16a34a']

const MONTH_LABELS = {
    '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
    '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
    '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic'
}

const formatMonth = (month) => {
    if (!month) return ''
    const [, m] = month.split('-')
    return MONTH_LABELS[m] || month
}

const KPICard = ({ label, value, icon, color, subtitle }) => (
    <div className="kpi-card">
        <div className="kpi-card__icon" style={{ background: `${color}15`, color }}>
            {icon}
        </div>
        <div className="kpi-card__body">
            <span className="kpi-card__value">{value}</span>
            <span className="kpi-card__label">{label}</span>
            {subtitle && <span className="kpi-card__subtitle">{subtitle}</span>}
        </div>
    </div>
)

export default function AdminAnalytics({ token, API_URL, buildHeaders }) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API_URL}/company-request/analytics`, {
                    headers: buildHeaders(token)
                })
                if (res.ok) setData(await res.json())
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return <div className="route-loading"><div className="route-loading__spinner" /></div>
    if (!data) return <p>No se pudieron cargar los datos.</p>

    // Procesar registros mensuales
    const months = [...new Set(data.monthly_registrations.map(r => r.month))].sort()
    const registrationData = months.map(month => {
        const candidates = data.monthly_registrations.find(r => r.month === month && r.role === 'candidate')
        const companies = data.monthly_registrations.find(r => r.month === month && r.role === 'company')
        return {
            month: formatMonth(month),
            Candidatos: parseInt(candidates?.count || 0),
            Empresas: parseInt(companies?.count || 0),
        }
    })

    // Postulaciones mensuales
    const applicationData = data.monthly_applications.map(r => ({
        month: formatMonth(r.month),
        Postulaciones: parseInt(r.count),
    }))

    // Modalidad
    const modalityData = data.modality_stats.map(r => ({
        name: r.modality || 'Sin especificar',
        value: parseInt(r.count),
    }))

    // Estado postulaciones
    const statusLabels = { pending: 'En proceso', accepted: 'Aceptado', rejected: 'Rechazado' }
    const statusData = data.application_status.map(r => ({
        name: statusLabels[r.status] || r.status,
        value: parseInt(r.count),
    }))

    // Top vacantes
    const topVacanciesData = data.top_vacancies.map(v => ({
        name: v.title.length > 20 ? v.title.slice(0, 20) + '...' : v.title,
        Postulaciones: parseInt(v.applications),
        empresa: v.company_name,
    }))

    // Jornada
    const scheduleData = data.schedule_stats.map(r => ({
        name: r.work_schedule || 'Sin especificar',
        value: parseInt(r.count),
    }))

    const { stats } = data

    return (
        <div className="admin-analytics">

            {/* KPIs */}
            <div className="kpi-grid">
                <KPICard
                    label="Candidatos" value={stats.total_candidates}
                    icon="👤" color="#3DBFB8"
                    subtitle="Usuarios registrados"
                />
                <KPICard
                    label="Empresas" value={stats.total_companies}
                    icon="🏢" color="#7c3aed"
                    subtitle="Cuentas empresa activas"
                />
                <KPICard
                    label="Vacantes activas" value={stats.active_vacancies}
                    icon="💼" color="#f59e0b"
                    subtitle="Publicadas y abiertas"
                />
                <KPICard
                    label="Postulaciones" value={stats.total_applies}
                    icon="📨" color="#16a34a"
                    subtitle="Total registradas"
                />
                <KPICard
                    label="Solicitudes pendientes" value={stats.pending_requests}
                    icon="⏳" color="#e11d48"
                    subtitle="Requieren revisión"
                />
            </div>

            {/* Gráficos fila 1 */}
            <div className="analytics-grid analytics-grid--2">

                <div className="analytics-card">
                    <h3 className="analytics-card__title">Registros por mes</h3>
                    <p className="analytics-card__subtitle">Candidatos y empresas — últimos 6 meses</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={registrationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Candidatos" stroke="#3DBFB8" strokeWidth={2} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="Empresas" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="analytics-card">
                    <h3 className="analytics-card__title">Postulaciones por mes</h3>
                    <p className="analytics-card__subtitle">Últimos 6 meses</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={applicationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="Postulaciones" fill="#3DBFB8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráficos fila 2 */}
            <div className="analytics-grid analytics-grid--3">

                <div className="analytics-card">
                    <h3 className="analytics-card__title">Modalidad de vacantes</h3>
                    <p className="analytics-card__subtitle">Distribución actual</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={modalityData} cx="50%" cy="50%" outerRadius={75}
                                dataKey="value">
                                {modalityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value, name) => [value, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="analytics-card">
                    <h3 className="analytics-card__title">Estado de postulaciones</h3>
                    <p className="analytics-card__subtitle">Distribución actual</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" outerRadius={75}
                                dataKey="value">
                                {statusData.map((entry, i) => (
                                    <Cell key={i} fill={
                                        entry.name === 'Aceptado' ? '#16a34a' :
                                            entry.name === 'Rechazado' ? '#e11d48' : '#f59e0b'
                                    } />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [value, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="analytics-card">
                    <h3 className="analytics-card__title">Jornada laboral</h3>
                    <p className="analytics-card__subtitle">Vacantes por tipo de jornada</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={scheduleData} cx="50%" cy="50%" outerRadius={75}
                                dataKey="value">
                                {scheduleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value, name) => [value, name]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="analytics-card analytics-card--full">
                <h3 className="analytics-card__title">Top 5 vacantes con más postulaciones</h3>
                <p className="analytics-card__subtitle">Ordenadas por número de postulantes</p>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={topVacanciesData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={140} />
                        <Tooltip
                            formatter={(value) => [value, 'Postulaciones']}
                            labelFormatter={(label) => {
                                const v = topVacanciesData.find(d => d.name === label)
                                return `${label}${v?.empresa ? ` — ${v.empresa}` : ''}`
                            }}
                        />
                        <Bar dataKey="Postulaciones" fill="#3DBFB8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}