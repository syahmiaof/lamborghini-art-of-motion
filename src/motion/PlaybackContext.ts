import { createContext } from 'react'
/** False while a foreground film is playing; avoids competing sequence decodes. */
export const PlaybackContext = createContext(true)
