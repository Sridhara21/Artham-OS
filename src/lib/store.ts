import { create } from 'zustand'
import type { ARTHAMState, PersonaType, CausalGraph, PresetShock } from '@/types'
import { REASONING_PRESETS } from './mock-data'

interface ARTHAMStore extends ARTHAMState {
  activePersona: PersonaType
  searchQuery: string
  activePresetShock: string | null // id of PresetShock
  activeGraph: CausalGraph | null
  
  // Custom Simulator Sliders (0-100)
  oilShock: number
  portDisruption: number
  monsoonDelay: number
  railStrike: number
  floodImpact: number
  coalShortage: number

  // Actions
  setActiveTab: (tab: string) => void
  setActivePersona: (persona: PersonaType) => void
  setSearchQuery: (query: string) => void
  setActivePresetShock: (shockId: string | null) => void
  setCustomShockValue: (key: 'oilShock' | 'portDisruption' | 'monsoonDelay' | 'railStrike' | 'floodImpact' | 'coalShortage', val: number) => void
  resetShocks: () => void
  executeSearch: (query: string) => void
  driftIndex: () => void
}

export const useARTHAMStore = create<ARTHAMStore>((set) => ({
  activeTab: 'index',
  arthamIndex: 73.4,
  indexChange: 2.1,
  economicPulse: 'Expansion',
  agentsActive: 10,
  signalsToday: 847,
  carbonCreditsToday: 8472,
  totalArbitrageCr: 847,
  lastUpdate: new Date(),

  activePersona: 'rbi',
  searchQuery: '',
  activePresetShock: null,
  activeGraph: null,

  oilShock: 0,
  portDisruption: 0,
  monsoonDelay: 0,
  railStrike: 0,
  floodImpact: 0,
  coalShortage: 0,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setActivePersona: (persona) => set({ activePersona: persona }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setActivePresetShock: (shockId) => {
    if (shockId === null) {
      set({
        activePresetShock: null,
        oilShock: 0,
        portDisruption: 0,
        monsoonDelay: 0,
        railStrike: 0,
        floodImpact: 0,
        coalShortage: 0
      })
    } else {
      set({ activePresetShock: shockId })
    }
  },

  setCustomShockValue: (key, val) => set((s) => ({ [key]: val, activePresetShock: null })),
  
  resetShocks: () => set({
    activePresetShock: null,
    oilShock: 0,
    portDisruption: 0,
    monsoonDelay: 0,
    railStrike: 0,
    floodImpact: 0,
    coalShortage: 0
  }),

  executeSearch: (query) => {
    // Normalise query to match presets
    const lower = query.toLowerCase()
    let matchedKey = 'index_drop' // default fallback
    
    if (lower.includes('red sea') || lower.includes('fertilizer') || lower.includes('tomato')) {
      matchedKey = 'redsea'
    } else if (lower.includes('monsoon') || lower.includes('rain') || lower.includes('inflation')) {
      matchedKey = 'monsoon'
    } else if (lower.includes('bottleneck') || lower.includes('state') || lower.includes('delays')) {
      matchedKey = 'bottleneck'
    } else if (lower.includes('why did') || lower.includes('index fall')) {
      matchedKey = 'index_drop'
    }

    set({
      searchQuery: query,
      activeGraph: REASONING_PRESETS[matchedKey],
      activeTab: 'prime'
    })
  },

  driftIndex: () =>
    set((s) => {
      const isPositive = Math.random() > 0.45
      const delta = parseFloat((Math.random() * 0.4 - 0.2).toFixed(1))
      const newIndex = Math.max(65, Math.min(95, parseFloat((s.arthamIndex + delta).toFixed(1))))
      const newChange = parseFloat((s.indexChange + delta).toFixed(1))
      
      return {
        arthamIndex: newIndex,
        indexChange: newChange,
        economicPulse: newIndex > 80 ? 'Expansion' : newIndex > 72 ? 'Steady' : 'Stressed',
        lastUpdate: new Date()
      }
    })
}))
