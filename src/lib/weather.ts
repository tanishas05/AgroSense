export async function getWeather(city: string = 'Nashik') {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    { next: { revalidate: 1800 } }
  )
  if (!res.ok) throw new Error('Failed to fetch weather')
  return res.json()
}

export async function getCurrentWeather(city: string = 'Nashik') {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    { next: { revalidate: 1800 } }
  )
  if (!res.ok) throw new Error('Failed to fetch current weather')
  return res.json()
}