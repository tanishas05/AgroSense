'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface LocationInfo {
  lat: number
  lon: number
  village: string
  district: string
  state: string
  display: string
}

interface LocationContextType {
  location: LocationInfo | null
  setLocation: (loc: LocationInfo) => void
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  setLocation: () => {},
})

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationInfo | null>(null)
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  return useContext(LocationContext)
}