import { createDirectus, rest, staticToken, readItems } from '@directus/sdk'
import fs from 'fs'
import path from 'path'

const DIRECTUS_URL = process.env.DIRECTUS_URL?.replace('directus:', 'localhost:') || 'http://localhost:8055'
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN

if (!DIRECTUS_TOKEN) {
  console.error('DIRECTUS_STATIC_TOKEN is required')
  process.exit(1)
}

const directus = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(DIRECTUS_TOKEN))

async function downloadFile(url: string, filePath: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to download ${url}`)
    
    const buffer = await response.arrayBuffer()
    fs.writeFileSync(filePath, Buffer.from(buffer))
    return true
  } catch (error) {
    console.error(`Error downloading ${url}:`, error)
    return false
  }
}

async function extractData() {
  try {
    console.log('Extracting data from Directus...')
    console.log(`Directus URL: ${DIRECTUS_URL}`)
    
    // Create data directory
    const dataDir = path.join(process.cwd(), 'public', 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    // Create images directory
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true })
    }
    
    // Extract edificios
    console.log('Extracting edificios...')
    const edificios = await directus.request(readItems('Edificios', {
      fields: ['*', 'translations.*']
    }))
    fs.writeFileSync(
      path.join(dataDir, 'edificios.json'), 
      JSON.stringify(edificios, null, 2)
    )
    console.log(`Extracted ${edificios.length} edificios`)
    
    // Extract publicacoes
    console.log('Extracting publicacoes...')
    const publicacoes = await directus.request(readItems('Publicacoes', {
      fields: ['*', 'translations.*', 'autores.Autores_id.*']
    }))
    fs.writeFileSync(
      path.join(dataDir, 'publicacoes.json'), 
      JSON.stringify(publicacoes, null, 2)
    )
    console.log(`Extracted ${publicacoes.length} publicacoes`)
    
    // Extract translations
    console.log('Extracting translations...')
    const translations = await directus.request(readItems('Traducoes', {
      fields: ['*']
    }))
    fs.writeFileSync(
      path.join(dataDir, 'translations.json'), 
      JSON.stringify(translations, null, 2)
    )
    console.log(`Extracted ${translations.length} translations`)
    
    // Extract and download images
    console.log('Extracting images...')
    const imageIds = new Set<string>()
    
    // Collect image IDs from edificios
    edificios.forEach((edificio: any) => {
      if (edificio.imagem) imageIds.add(edificio.imagem)
    })
    
    // Collect image IDs from publicacoes
    publicacoes.forEach((publicacao: any) => {
      if (publicacao.capa) imageIds.add(publicacao.capa)
    })
    
    console.log(`Found ${imageIds.size} unique images to download`)
    
    // Download images
    let downloadedCount = 0
    for (const imageId of imageIds) {
      const imageUrl = `${DIRECTUS_URL}/assets/${imageId}`
      const imagePath = path.join(imagesDir, imageId)
      
      if (await downloadFile(imageUrl, imagePath)) {
        downloadedCount++
        console.log(`Downloaded: ${imageId}`)
      }
    }
    
    console.log(`Successfully downloaded ${downloadedCount} images`)
    
    // Copy existing images from install/uploads as fallback
    const installUploadsDir = path.join(process.cwd(), 'install', 'uploads')
    if (fs.existsSync(installUploadsDir)) {
      const files = fs.readdirSync(installUploadsDir)
      files.forEach(file => {
        const srcPath = path.join(installUploadsDir, file)
        const destPath = path.join(imagesDir, file)
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath)
        }
      })
      console.log(`Copied ${files.length} fallback images from install/uploads`)
    }
    
    console.log('Data extraction completed successfully!')
  } catch (error) {
    console.error('Error extracting data:', error)
    process.exit(1)
  }
}

extractData()
