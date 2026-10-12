import { createContext, useContext } from 'react'

export const MotionContext = createContext({ reduced: false, toggleMotion: () => {} })
export const useMotion = () => useContext(MotionContext)
