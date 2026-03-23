import { useEffect, useState } from 'react'

type AIAdapter = {
    name: string
    active: boolean
}

export function AIModule() {
    const [adapters, setAdapters] = useState<AIAdapter[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAdapters = () => {
        fetch('http://localhost:8080/api/ai/adapters')
            .then(res => res.json())
            .then((data: AIAdapter[]) => {
                setAdapters(data)
            })
            .catch(() => {
                setError('Yhteys palvelimeen epäonnistui')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchAdapters()
    }, [])

    const activate = (name: string) => {
        fetch(`http://localhost:8080/api/ai/adapters/${name}/activate`, {
            method: 'POST'
        }).then(() => fetchAdapters())
    }

    if (loading) return <p>Ladataan...</p>
    if (error) return <p className="error">{error}</p>

    return (
        <div className="module">
            <h2>AI-adapterit</h2>
            <ul className="adapter-list">
                {adapters.map(adapter => (
                    <li key={adapter.name} className="adapter-item">
                        <span className="adapter-name">{adapter.name}</span>
                        <span className={`adapter-status ${adapter.active ? 'status--active' : 'status--inactive'}`}>
              {adapter.active ? 'Aktiivinen' : 'Ei käytössä'}
            </span>
                        {!adapter.active && (
                            <button
                                className="activate-btn"
                                onClick={() => activate(adapter.name)}
                                aria-label={`aktivoi ${adapter.name}`}
                            >
                                Aktivoi
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}