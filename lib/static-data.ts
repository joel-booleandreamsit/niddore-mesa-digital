import fs from 'fs'
import path from 'path'

// Static data fetching functions for build-time data extraction
export async function fetchEdificios(lang: string = 'pt') {
  try {
    // During build time, read from file system
    if (typeof window === 'undefined') {
      const dataPath = path.join(process.cwd(), 'public', 'data', 'edificios.json')
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      
      // Filter translations by language
      return data.map((item: any) => ({
        ...item,
        translations: item.translations?.filter((t: any) => t.languages_code === lang) || []
      }))
    }
    
    // During runtime, use fetch
    const response = await fetch('/data/edificios.json')
    if (!response.ok) throw new Error('Failed to fetch edificios')
    const data = await response.json()
    
    // Filter translations by language
    return data.map((item: any) => ({
      ...item,
      translations: item.translations?.filter((t: any) => t.languages_code === lang) || []
    }))
  } catch (error) {
    console.error('Error fetching edificios:', error)
    return []
  }
}

export async function fetchEdificioById(id: string | number, lang: string = 'pt') {
  try {
    const edificios = await fetchEdificios(lang)
    return edificios.find((item: any) => item.id === Number(id))
  } catch (error) {
    console.error('Error fetching edificio:', error)
    return null
  }
}

export async function fetchPublicacoes(lang: string = 'pt') {
  try {
    // During build time, read from file system
    if (typeof window === 'undefined') {
      const dataPath = path.join(process.cwd(), 'public', 'data', 'publicacoes.json')
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      
      // Process translations and autores
      return data.map((item: any) => ({
        ...item,
        translations: item.translations?.filter((t: any) => t.languages_code === lang) || [],
        autores: item.autores?.map((autor: any) => autor.Autores_id?.nome).filter(Boolean) || []
      }))
    }
    
    // During runtime, use fetch
    const response = await fetch('/data/publicacoes.json')
    if (!response.ok) throw new Error('Failed to fetch publicacoes')
    const data = await response.json()
    
    // Process translations and autores
    return data.map((item: any) => ({
      ...item,
      translations: item.translations?.filter((t: any) => t.languages_code === lang) || [],
      autores: item.autores?.map((autor: any) => autor.Autores_id?.nome).filter(Boolean) || []
    }))
  } catch (error) {
    console.error('Error fetching publicacoes:', error)
    return []
  }
}

export async function fetchPublicacaoById(id: string | number, lang: string = 'pt') {
  try {
    const publicacoes = await fetchPublicacoes(lang)
    return publicacoes.find((item: any) => item.id === Number(id))
  } catch (error) {
    console.error('Error fetching publicacao:', error)
    return null
  }
}

export function assetUrl(id?: string | null, search = '') {
  if (!id) return '/placeholder.svg'
  
  // Handle different image sources
  if (id.startsWith('/')) return id
  if (id.startsWith('http')) return id
  
  // Default to images directory
  return `/images/${id}`
}

export async function getTranslations(terms: string[], lang: string) {
  try {
    // During build time, read from file system
    if (typeof window === 'undefined') {
      const dataPath = path.join(process.cwd(), 'public', 'data', 'translations.json')
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      
      const translationMap = new Map()
      terms.forEach(term => {
        const translation = data.find((t: any) => 
          t.nome === term && t.codigo_lingua === lang
        )
        if (translation) {
          translationMap.set(term, translation.traducao)
        }
      })
      
      return translationMap
    }
    
    // During runtime, use fetch
    const response = await fetch('/data/translations.json')
    if (!response.ok) throw new Error('Failed to fetch translations')
    const data = await response.json()
    
    const translationMap = new Map()
    terms.forEach(term => {
      const translation = data.find((t: any) => 
        t.nome === term && t.codigo_lingua === lang
      )
      if (translation) {
        translationMap.set(term, translation.traducao)
      }
    })
    
    return translationMap
  } catch (error) {
    console.error('Error fetching translations:', error)
    return new Map()
  }
}

// Utility function to strip HTML tags from WYSIWYG content
export function stripHtml(html: string): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}
