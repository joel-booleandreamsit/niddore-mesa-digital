import { readItems, readItem } from '@directus/sdk'
import { directus } from '@/lib/directus'

export async function fetchMateriaisCategorias(lang: string = 'pt') {
  const data = await directus.request(
    readItems('Materiais_e_trabalhos_Categorias', {
      fields: ['*', 'translations.*', 'imagem'],
      deep: {
        translations: {
          _filter: {
            languages_code: { _eq: lang },
          },
        },
      },
    })
  )
  return data
}

export async function fetchMateriaisCategoriaById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Materiais_e_trabalhos_Categorias', id, {
      fields: ['*', 'translations.*', 'imagem'],
      deep: {
        translations: {
          _filter: {
            languages_code: { _eq: lang },
          },
        },
      },
    })
  )
  return data
}

export async function fetchMateriaisLinksForEdificios() {
  const data = await directus.request(
    readItems('Materiais_e_trabalhos', {
      fields: ['id', 'tipo', 'categoria.id', 'edificio.id'],
      filter: { tipo: { _eq: 'Material' } },
    })
  )
  return data
}

export async function fetchMateriaisByCategoria(categoriaId: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItems('Materiais_e_trabalhos', {
      fields: ['id', 'capa', 'translations.*', 'edificio.id'],
      filter: { categoria: { _eq: categoriaId }, tipo: { _eq: 'Material' } },
      deep: {
        translations: {
          _filter: {
            languages_code: { _eq: lang },
          },
        },
      },
    })
  )
  return data
}

export async function fetchMaterialById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Materiais_e_trabalhos', id, {
      fields: ['*', 'translations.*', 'capa', 'categoria.translations.*'],
      deep: {
        translations: {
          _filter: {
            languages_code: { _eq: lang },
          },
        },
        categoria: {
          translations: {
            _filter: {
              languages_code: { _eq: lang },
            },
          },
        },
      },
    })
  )
  return data
}
