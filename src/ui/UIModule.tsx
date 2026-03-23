import { useEffect, useState } from 'react'

type UIAdapter = {
    name: string
    active: boolean
}

export function UIModule({ pollInterval = 5000 }: { pollInterval?: number } = {}) {
    const [adapters, setAdapters] = useState<UIAdapter[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAdapters = () => {
        fetch('http://localhost:8080/api/ui/adapters')
            .then(res => res.json())
            .then((data: UIAdapter[]) => {
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
        const interval = setInterval(fetchAdapters, pollInterval)
        return () => clearInterval(interval)
    }, [])

    const open = (name: string) => {
        fetch(`http://localhost:8080/api/ui/adapters/${name}/activate`, {
            method: 'POST'
        }).then(() => {
            fetchAdapters()
            if (name === 'thymeleafUI') {
                window.open('http://localhost:8080', '_blank')
            }
        })
    }

    const close = (name: string) => {
        fetch(`http://localhost:8080/api/ui/adapters/${name}/close`, {
            method: 'POST'
        }).then(() => fetchAdapters())
    }

    if (loading) return <p>Ladataan...</p>
    if (error) return <p className="error">{error}</p>

    return (
        <div className="module">
            <h2>UI-adapterit</h2>
            <ul className="adapter-list">
                {adapters.map(adapter => (
                    <li key={adapter.name} className="adapter-item">
                        <span className="adapter-name">{adapter.name}</span>
                        <span className={`adapter-status ${adapter.active ? 'status--active' : 'status--inactive'}`}>
              {adapter.active ? 'Auki' : 'Kiinni'}
            </span>
                        {!adapter.active && (
                            <button
                                className="activate-btn"
                                onClick={() => open(adapter.name)}
                                aria-label={`avaa ${adapter.name}`}
                            >
                                Avaa
                            </button>
                        )}
                        {adapter.active && (
                            <button
                                className="activate-btn"
                                onClick={() => close(adapter.name)}
                                aria-label={`sulje ${adapter.name}`}
                            >
                                Sulje
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}