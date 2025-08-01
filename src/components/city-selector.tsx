'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { City } from '@/lib/database'

export function CitySelector() {
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load cities and previously selected city
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/cities')

        if (!response.ok) {
          throw new Error('Failed to fetch cities')
        }

        const citiesData = await response.json()
        setCities(citiesData)

        // Check for previously selected city
        const savedCity = localStorage.getItem('selected-city')
        if (savedCity) {
          try {
            const parsedCity = JSON.parse(savedCity)
            setSelectedCity(parsedCity)
          } catch {
            // Invalid saved data, ignore
            localStorage.removeItem('selected-city')
          }
        }
      } catch (err) {
        setError('Failed to load cities')
        console.error('Error loading cities:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCities()
  }, [])

  const handleCitySelect = (cityId: string) => {
    const city = cities.find(c => c.id.toString() === cityId)
    if (city) {
      setSelectedCity(city)
      localStorage.setItem('selected-city', JSON.stringify(city))
    }
  }

  const clearSelection = () => {
    setSelectedCity(null)
    localStorage.removeItem('selected-city')
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading cities...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Choose Your City</CardTitle>
        <CardDescription>
          Select a city to see today's kids eat free deals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedCity ? (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <span className="font-medium">Selected:</span> {selectedCity.name}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearSelection}
              className="w-full"
            >
              Change City
            </Button>
          </div>
        ) : (
          <Select onValueChange={handleCitySelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  )
}
