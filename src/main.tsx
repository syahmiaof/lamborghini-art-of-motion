import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Experience } from './app/Experience'
import './styles/tokens.css'
import './styles/base.css'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/latin-600.css'
import './styles/experience.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Application root #root was not found')
}

createRoot(root).render(
  <StrictMode>
    <Experience />
  </StrictMode>,
)
