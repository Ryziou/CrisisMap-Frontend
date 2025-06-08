import { useEffect, useState } from "react"
import { getDisasterStats } from '../../services/reliefDisasters'
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    PieChart, Pie, Cell, Tooltip, LineChart,
    Line, CartesianGrid, Legend, RadarChart, Radar,
    PolarAngleAxis, PolarRadiusAxis, PolarGrid
} from "recharts"
import './Home.css'

export default function Home() {
    const [stats, setStats] = useState(null)

    useEffect(() => {
        async function fetchDisasterStats() {
            try {
                const { data } = await getDisasterStats()
                setStats(data)
            } catch (error) {
                error(error.response.data)
                console.log(error.response.data);
            }
        }
        fetchDisasterStats()
    }, [])

    return (
        <section className="home-container">
            <h1 className="home-title">CrisisDashboard</h1>

            {!stats
                ? <p className="loading-message">Loading Data...</p>
                : (
                    <>
                        <div className="stats-grid">
                            <div className="stats-info">
                                <div className="stats-title">
                                    🌍 Total Disasters:
                                </div>
                                <div className="stats-value">
                                    {stats.total}
                                </div>
                            </div>
                            <div className="stats-info">
                                <div className="stats-title">
                                    ⚠️ Active Disasters:
                                </div>
                                <div className="stats-value">
                                    {stats.active_count}
                                </div>
                            </div>
                            <div className="stats-info">
                                <div className="stats-title">
                                    🆕 Most Disaster Recent:
                                </div>
                                <div className="stats-value">
                                    {stats.recent_disaster.name.split(':')[0]}
                                    <br />
                                    <small>
                                        {stats.recent_disaster.name.split(/[:-]/)[1]}
                                        <br />
                                        {stats.recent_disaster.name.split(/[:-]/)[2]}
                                    </small>
                                </div>
                            </div>
                            <div className="stats-info">
                                <div className="stats-title">
                                    🔁 Most Common Type:
                                </div>
                                <div className="stats-value">
                                    {stats.common_type}({stats.common_count} times)
                                </div>
                            </div>
                        </div>

                        <div className="chart-container">
                            <div className="chart-section">
                                <h2 className="chart-title">Disasters Over Time</h2>
                                <ResponsiveContainer width='100%' height={300}>
                                    <LineChart data={stats.disasters_overtime}>
                                        <CartesianGrid strokeDasharray='3 3' />
                                        <XAxis dataKey='month' />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend formatter={(value) => { if (value === 'count') return 'Disasters' }} />
                                        <Line type='monotone' dataKey='count' stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-section">
                                <h2 className="chart-title">Most Affected Countries</h2>
                                <ResponsiveContainer width='100%' height={300}>
                                    <BarChart data={stats.top_countries}>
                                        <CartesianGrid strokeDasharray='3 3' />
                                        <XAxis dataKey='iso3' />
                                        <YAxis />
                                        <Tooltip formatter={(value, name) => [value, name]}
                                            labelFormatter={(label) => Object.fromEntries(stats.top_countries.map(item => [item.iso3, item.name]))[label]}
                                        />
                                        <Bar dataKey='disasters' fill="#8884d8" />
                                        <Legend formatter={(value) => { if (value === 'disasters') return 'Amount of Disasters' }}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-section">
                                <h2 className="chart-title">Status Breakdown</h2>
                                <ResponsiveContainer width='100%' height={300}>
                                    <PieChart>
                                        <Pie dataKey='value'
                                            data={Object.entries(stats.status_list).map(([name, value]) => ({ name, value }))}
                                            cx='50%'
                                            cy='50%'
                                            outerRadius={100}
                                        >
                                            <Cell fill="#4f46e5" />
                                            <Cell fill="#f59e0b" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip />
                                        <Legend formatter={(value) => {
                                            if (value === 'alert') return 'Alert'
                                            if (value === 'ongoing') return 'Ongoing'
                                            if (value === 'past') return 'Past'
                                        }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="chart-section">
                                <h2 className="chart-title">Disasters by Type</h2>
                                <ResponsiveContainer width='100%' height={400}>
                                    <RadarChart
                                        outerRadius='80%'
                                        data={Object.entries(stats.type_list)
                                            .map(([disaster, count]) => ({ disaster, count, displayValue: Math.sqrt(count) }))}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey='disaster' />
                                        <Radar name="Disaster Frequency" dataKey='displayValue' stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                        <Tooltip formatter={(value, name, props) => { return [`${props.payload.count}`, 'count'] }} />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </>
                )
            }


        </section>
    )
}