"use client"

import { useState, useEffect, useRef } from 'react'

export default function MapboxAddressInput({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Start typing your address...',
  disabled = false,
  className = '',
  label = 'Address',
  country = 'ZA' // Default to South Africa
}) {
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const debounceRef = useRef(null)

  // Get Mapbox access token from environment variable
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3 || !MAPBOX_TOKEN) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${MAPBOX_TOKEN}&` +
        `country=${country}&` +
        `types=address,poi&` +
        `limit=5&` +
        `autocomplete=true`
      )

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.features || [])
        setShowSuggestions(true)
      } else {
        setSuggestions([])
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce API calls
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newValue)
    }, 300)
  }

  const handleSelectSuggestion = (suggestion) => {
    const address = suggestion.place_name || suggestion.text
    const context = suggestion.context || []
    
    // Extract address components
    let city = ''
    let postalCode = ''
    let countryName = ''
    let streetAddress = suggestion.text || ''

    context.forEach((item) => {
      if (item.id.startsWith('place')) {
        city = item.text
      } else if (item.id.startsWith('postcode')) {
        postalCode = item.text
      } else if (item.id.startsWith('country')) {
        countryName = item.text
      }
    })

    // If we have coordinates, use the full place_name for street address
    if (suggestion.place_name) {
      const parts = suggestion.place_name.split(',')
      streetAddress = parts[0] || streetAddress
    }

    onChange(address)
    setShowSuggestions(false)
    setSuggestions([])

    // Call onSelect callback with parsed address data
    if (onSelect) {
      onSelect({
        fullAddress: address,
        streetAddress: streetAddress,
        city: city,
        postalCode: postalCode,
        country: countryName,
        coordinates: suggestion.center // [longitude, latitude]
      })
    }
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true)
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-orange-50 transition-colors ${
                index === selectedIndex ? 'bg-orange-100' : ''
              }`}
            >
              <div className="font-medium text-gray-900">
                {suggestion.text}
              </div>
              <div className="text-sm text-gray-500">
                {suggestion.place_name}
              </div>
            </div>
          ))}
        </div>
      )}

      {!MAPBOX_TOKEN && (
        <p className="mt-1 text-xs text-amber-600">
          Mapbox token not configured. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file
        </p>
      )}
    </div>
  )
}

