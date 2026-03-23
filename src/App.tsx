import { AIModule } from '@/ai/AIModule'
import { UIModule } from '@/ui/UIModule'
import { useState } from 'react'
import './App.css'

type Module = 'UI' | 'AI' | 'DB'

function App() {
  const [activeModule, setActiveModule] = useState<Module>('AI')

  return (
      <div className="app">
        <header className="app-header">
          <h1>HotSwapPlatform</h1>
        </header>

        <main className="app-main">
          <nav className="carousel">
            {(['UI', 'AI', 'DB'] as Module[]).map((module) => (
                <button
                    key={module}
                    className={`carousel-btn ${activeModule === module ? 'carousel-btn--active' : ''}`}
                    onClick={() => setActiveModule(module)}
                >
                  {module}
                </button>
            ))}
          </nav>

          <section className="module-content">
            {activeModule === 'UI' && <UIModule />}
            {activeModule === 'AI' && <AIModule />}
            {activeModule === 'DB' && <DBModule />}
          </section>
        </main>
      </div>
  )
}

function DBModule() {
  return (
      <div className="module">
        <h2>DB</h2>
        <p>Tietokantaadapterin hallinta — tulossa</p>
      </div>
  )
}

export default App