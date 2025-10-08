import { createDirectus, rest, staticToken, readItems, readItem } from '@directus/sdk'

const DIRECTUS_URL = process.env.DIRECTUS_URL!
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN

export const directus = (() => {
    let client = createDirectus(DIRECTUS_URL).with(rest())
    if (DIRECTUS_TOKEN) client = client.with(staticToken(DIRECTUS_TOKEN))
    return client
  })()

export function assetUrl(id?: string | null, search = '') {
	if (!id) return '/placeholder.svg'
	const qs = search ? (search.startsWith('?') ? search : `?${search}`) : ''
	return `${DIRECTUS_URL.replace(/\/$/, '')}/assets/${id}${qs}`
}

export default function fetchEdificios() {
	return directus.request(
		readItems('Edificios', {
			fields: ['id', 'nome', 'localizacao', 'ano_construcao', 'descricao', 'imagem'],
			sort: ['nome'],
		})
	)
}

export function fetchEdificioById(id: string | number) {
	return directus.request(
		readItem('Edificios', id, {
			fields: ['id', 'nome', 'localizacao', 'ano_construcao', 'descricao', 'imagem'],
		})
	)
}
