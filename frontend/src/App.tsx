import { useState } from 'react'
import { IconButton } from './components/IconButton'

/** Ícone de exemplo (quadrado arredondado). `currentColor` herda a cor do estado. */
function SquareGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <rect width="18" height="18" rx="5" />
    </svg>
  )
}

function App() {
  const [ativo, setAtivo] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-400">
          Botão ícone — 40×40
        </p>
        <hr className="my-4 border-gray-200" />

        <div className="flex items-start gap-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-600">Padrão</span>
            <IconButton label="Exemplo padrão">
              <SquareGlyph />
            </IconButton>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-600">Hover</span>
            {/* Prévia do hover. No uso real é automático ao passar o mouse. */}
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <SquareGlyph />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-600">Ativo</span>
            <IconButton label="Exemplo ativo" active>
              <SquareGlyph />
            </IconButton>
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-2 text-sm text-gray-500">Interativo (clique para alternar):</p>
          <IconButton label="Alternar estado" active={ativo} onClick={() => setAtivo((v) => !v)}>
            <SquareGlyph />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default App
