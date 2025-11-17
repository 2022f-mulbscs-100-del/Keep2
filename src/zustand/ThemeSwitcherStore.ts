import { create } from 'zustand'
import { LOCAL_THEME_VALUE } from '../Constants/LocalStorage.constants'

interface themeStore {
    theme: string
    setTheme: (value: string) => void
}

export const useTheme = create<themeStore>((set) => ({
    theme: localStorage.getItem(LOCAL_THEME_VALUE) || 'dark',
    setTheme: (value: string) => {
        set({ theme: value })
        localStorage.setItem(LOCAL_THEME_VALUE, value)
    }

}))