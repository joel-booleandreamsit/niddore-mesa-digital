import { createDirectus, rest, staticToken, readItems, readItem } from '@directus/sdk'

const DIRECTUS_URL = process.env.DIRECTUS_URL!
const DIRECTUS_PUBLIC_URL = process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055'
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN

export const directus = (() => {
    let client = createDirectus(DIRECTUS_URL).with(rest())
    if (DIRECTUS_TOKEN) client = client.with(staticToken(DIRECTUS_TOKEN))
    return client
  })()

export function assetUrl(id?: string | null, search = '') {
	if (!id) return '/placeholder.svg'
	const qs = search ? (search.startsWith('?') ? search : `?${search}`) : ''
	return `${DIRECTUS_PUBLIC_URL.replace(/\/$/, '')}/assets/${id}${qs}`
}

// Utility function to strip HTML tags from WYSIWYG content
export function stripHtml(html: string): string {
	if (!html) return ''
	return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}


export default function fetchEdificios(lang: string = 'pt') {
  return directus.request(
    readItems('Edificios', {
      fields: ['*', { translations: ['*']}],
      sort: ['nome'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        }
      }
    })
  )
}

export function fetchEdificioById(id: string | number, lang: string = 'pt') {
	return directus.request(
		readItem('Edificios', id, {
			fields: ['*', 'translations.*'],
			deep: {
				translations: {
					_filter: {
						languages_code: {
							_eq: lang
						}
					}
				}
			}
		})
	)
}

// Helper function to get translations from Traducoes collection
export async function getTranslations(terms: string[], lang: string = 'pt') {
  try {
    const translations = await directus.request(
      readItems('Traducoes', {
        fields: ['nome', 'traducao'],
        filter: {
          nome: {
            _in: terms
          },
          codigo_lingua: {
            _eq: lang
          }
        }
      })
    )
    
    // Create translation map
    const translationMap = new Map(translations.map(t => [t.nome, t.traducao]))
    return translationMap
  } catch {
    return new Map()
  }
}

export async function fetchPublicacoes(lang: string = 'pt') {
  const data = await directus.request(
    readItems('Publicacoes', {
      fields: ['*', 'translations.*', 'autores.Autores_id.*'],
      sort: ['-ano_publicacao'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        }
      }
    })
  )

  // Only fetch translations if language is not Portuguese
  if (lang !== 'pt') {
    const uniqueTipos = [...new Set(data.map((item: any) => item.tipo_publicacao).filter(Boolean))]
    const translationMap = await getTranslations(uniqueTipos, lang)

    // Apply translations to the data
    return data.map((item: any) => ({
      ...item,
      tipo_publicacao_translated: translationMap.get(item.tipo_publicacao) || item.tipo_publicacao
    }))
  }

  // For Portuguese, return data as-is since tipo_publicacao is already in Portuguese
  return data.map((item: any) => ({
    ...item,
    tipo_publicacao_translated: item.tipo_publicacao
  }))
}

export async function fetchPublicacaoById(id: string | number, lang: string = 'pt') {
	const data = await directus.request(
		readItem('Publicacoes', id, {
			fields: ['*', 'translations.*', 'autores.Autores_id.*'],
			deep: {
				translations: {
					_filter: {
						languages_code: {
							_eq: lang
						}
					}
				}
			}
		})
	)

	// Only fetch translation if language is not Portuguese
	if (lang !== 'pt') {
		const translationMap = await getTranslations([data.tipo_publicacao], lang)
		return {
			...data,
			tipo_publicacao_translated: translationMap.get(data.tipo_publicacao) || data.tipo_publicacao
		}
	}

	// For Portuguese, return data as-is since tipo_publicacao is already in Portuguese
	return {
		...data,
		tipo_publicacao_translated: data.tipo_publicacao
	}
}

export async function fetchServicos(lang: string = 'pt') {
  const data = await directus.request(
    readItems('Servicos', {
      fields: ['*', 'translations.nome', 'foto_capa'],
      sort: ['-data_inicio'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        }
      }
    })
  )

  return data
}

export async function fetchServicoById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Servicos', id, {
      fields: ['*', 'translations.*', 'foto_capa', 'fotos_galeria.directus_files_id.*'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        }
      }
    })
  )

  return data
}

export async function fetchGrupos(lang: string = 'pt') {
  const data = await directus.request(
    readItems('Grupos', {
      fields: ['*', 'translations.nome', 'foto_capa'],
      sort: ['translations.nome'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        }
      }
    })
  )

  // Only fetch translations if language is not Portuguese
  if (lang !== 'pt') {
    const uniqueTipos = [...new Set(data.map((item: any) => item.tipo_grupo).filter(Boolean))]
    const translationMap = await getTranslations(uniqueTipos, lang)    

    // Apply translations to the data
    return data.map((item: any) => ({
      ...item,
      tipo_grupo_translated: translationMap.get(item.tipo_grupo) || item.tipo_grupo
    }))
  }  

  return data
}

export async function fetchGrupoById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Grupos', id, {
      fields: ['*', 'translations.*', 'foto_capa', 'fotos_galeria.directus_files_id.*'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        }
      }
    })
  )

  return data
}

export async function fetchGaleriaCategorias(lang: string = 'pt') {
  const data = await directus.request(
    readItems('Galeria_Categorias', {
      fields: ['*', 'translations.*', 'imagem'],
      filter: { categoria_principal: { _null: true } },
      sort: ['ordem'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        }
      }
    })
  )

  return data
}

export async function fetchGaleriaSubcategorias(categoriaId?: string | number, lang: string = 'pt') {
  const filter: any = { categoria_principal: { _nnull: true } }
  
  if (categoriaId) {
    filter.categoria_principal = { _eq: categoriaId }
  }

  const data = await directus.request(
    readItems('Galeria_Categorias', {
      fields: ['*', 'translations.*', 'imagem'],
      filter,
      sort: ['ordem'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        }
      }
    })
  )

  return data
}

export async function fetchGaleriaFotos(categoriaId?: string | number, subcategoriaId?: string | number, lang: string = 'pt') {
  const filter: any = {}
  
  if (subcategoriaId) {
    filter.categoria = { _eq: subcategoriaId }
  } else if (categoriaId) {
    // If only categoriaId is provided, get all photos from subcategories of that category
    const subcategorias = await fetchGaleriaSubcategorias(categoriaId, lang)
    const subcategoriaIds = subcategorias.map(sub => sub.id)
    if (subcategoriaIds.length > 0) {
      filter.categoria = { _in: subcategoriaIds }
    } else {
      // No subcategories found, return empty array
      return []
    }
  }

  const data = await directus.request(
    readItems('Galeria_Fotos', {
      fields: ['*', 'translations.*', 'categoria.translations.*'],
      filter,
      sort: ['ordem'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        },
        categoria: {
          translations: {
            _filter: {
              languages_code: {
                _eq: lang
              }
            }
          }
        }
      }
    })
  )

  return data
}

export async function fetchGaleriaFotoById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Galeria_Fotos', id, {
      fields: ['*', 'translations.*', 'categoria.translations.*', 'categoria.categoria_principal.translations.*'],
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang
            }
          }
        },
        categoria: {
          translations: {
            _filter: {
              languages_code: {
                _eq: lang
              }
            }
          },
          categoria_principal: {
            translations: {
              _filter: {
                languages_code: {
                  _eq: lang
                }
              }
            }
          }
        }
      }
    })
  )

  return data
}
