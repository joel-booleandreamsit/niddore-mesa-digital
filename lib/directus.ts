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
      sort: ['data_inicio'],
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
			fields: ['*', 'translations.*', 'fotos_galeria.directus_files_id.*'],
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

export async function fetchCursos(edificioId?: string | number, lang: string = 'pt') {
  const filter: any = {}
  if (edificioId) {
    filter.edificio = { _eq: edificioId }
  }

  const data = await directus.request(
    readItems('Cursos', {
      fields: ['*', 'translations.*', 'edificio.id', 'anos_lectivos.Anos_Lectivos_id.*'],
      filter,
      deep: {
        translations: {
          _filter: {
            languages_code: {
              _eq: lang,
            },
          },
        },
      },
    })
  )

  return data
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

export async function fetchDocumentosCategorias(lang: string = 'pt') {
  const data = await directus.request(
    readItems('Documentos_Categorias', {
      fields: ['*', 'translations.*', 'imagem'],
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

export async function fetchDocumentoCategoriaById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Documentos_Categorias', id, {
      fields: ['*', 'translations.*', 'imagem'],
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

export async function fetchDocumentosByCategoria(categoriaId: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItems('Documentos', {
      fields: ['*', 'translations.*', 'capa', 'autores.Autores_id.*'],
      filter: { categoria: { _eq: categoriaId } },
      sort: ['-data'],
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

export async function fetchDocumentoById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Documentos', id, {
      fields: ['*', 'translations.*', 'capa', 'autores.Autores_id.*', 'categoria.translations.*'],
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

export async function fetchGaleriaCategoriaById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Galeria_Categorias', id, {
      fields: [
        '*',
        'translations.*',
        'imagem',
        'categoria_principal.id',
        'categoria_principal.translations.*',
        'categoria_principal.categoria_principal'
      ],
      deep: {
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
    })
  )

  return data
}

export async function fetchGaleriaFotos(subcategoriaId: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItems('Galeria_Fotos', {
      fields: ['*', 'translations.*'],
      filter: { categoria: { _eq: subcategoriaId } },
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

export async function fetchGaleriaFotosByCategoriaIds(ids: Array<string | number>, lang: string = 'pt') {
  if (!ids || ids.length === 0) return []
  const data = await directus.request(
    readItems('Galeria_Fotos', {
      fields: ['*', 'translations.*', 'categoria.id'],
      filter: { categoria: { _in: ids } },
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

export async function fetchGaleriaFotoById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Galeria_Fotos', id, {
      fields: [
        '*',
        'translations.*',
        'categoria.id',
        'categoria.translations.*',
        'categoria.categoria_principal.id',
        'categoria.categoria_principal.translations.*'
      ],
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
export async function fetchMateriaisLinksForEdificios(tipo: 'Material' | 'Trabalho' = 'Material') {
  const data = await directus.request(
    readItems('Materiais_e_trabalhos', {
      fields: ['id', 'tipo', 'categoria.id', 'edificio.id'],
      filter: { tipo: { _eq: tipo } },
    })
  )
  return data
}
export async function fetchMateriaisByCategoria(categoriaId: string | number, lang: string = 'pt', tipo: 'Material' | 'Trabalho' = 'Material') {
  const data = await directus.request(
    readItems('Materiais_e_trabalhos', {
      fields: ['id', 'capa', 'translations.*', 'edificio.id'],
      filter: { categoria: { _eq: categoriaId }, tipo: { _eq: tipo } },
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

// Pessoal (people)
export async function fetchAnosLectivosYears() {
  const data = await directus.request(
    readItems('Anos_Lectivos', {
      fields: ['ano_inicio', 'ano_fim'],
      sort: ['ano_inicio'],
      limit: -1,
    })
  )
  return Array.isArray(data) ? data : []
}

export type FetchPessoalParams = {
  page?: number
  limit?: number
  q?: string
  docente?: boolean | null // null => all
  fromYear?: number | null
  toYear?: number | null
  sort?: 'nome' | 'numero_processo'
  order?: 'asc' | 'desc'
}

export async function fetchPessoal({
  page = 1,
  limit = 20,
  q,
  docente = null,
  fromYear = null,
  toYear = null,
  sort = 'nome',
  order = 'asc',
}: FetchPessoalParams = {}) {
  const filter: any = {}
  if (q && q.trim()) {
    const parts: any[] = [{ nome: { _icontains: q } }]
    const dm = q.match(/\d+/)
    if (dm) {
      const num = Number(dm[0])
      if (Number.isFinite(num)) parts.push({ numero_processo: { _eq: num } })
    }
    filter._or = parts
  }
  if (docente !== null) {
    filter.docente = { _eq: !!docente }
  }
  if (fromYear != null || toYear != null) {
    const a0 = fromYear ?? 0
    const a1 = toYear ?? 9999
    filter.anos_lectivos = {
      _some: {
        Anos_Lectivos_id: {
          ano_inicio: { _between: [a0, a1] },
        },
      },
    }
  }

  try {
    const data = await directus.request(
      readItems('Pessoal', {
        fields: ['id', 'nome', 'numero_processo', 'docente', 'foto'],
        filter,
        sort: [`${order === 'desc' ? '-' : ''}${sort}`],
        limit,
        offset: Math.max(0, (page - 1) * limit),
      })
    )
    console.log("fetchPessoal", data)
    return Array.isArray(data) ? data : []
  } catch (e: any) {
    console.log("fetchPessoal error", e)
    const msg = String(e?.message || '')
    if ((msg.includes('_icontains') || msg.includes('_contains')) && q) {
      // Retry with a safer filter (numeric-only if possible, else no q)
      const dm = q.match(/\d+/)
      const retryFilter: any = { ...filter }
      delete retryFilter._or
      if (dm) {
        const num = Number(dm[0])
        if (Number.isFinite(num)) retryFilter.numero_processo = { _eq: num }
      }
      try {
        const data = await directus.request(
          readItems('Pessoal', {
            fields: ['id', 'nome', 'numero_processo', 'docente', 'foto'],
            filter: retryFilter,
            sort: [`${order === 'desc' ? '-' : ''}${sort}`],
            limit,
            offset: Math.max(0, (page - 1) * limit),
          })
        )
        return Array.isArray(data) ? data : []
      } catch {
        console.log('final retry: drop q entirely')
        // final retry: drop q entirely
        const data = await directus.request(
          readItems('Pessoal', {
            fields: ['id', 'nome', 'numero_processo', 'docente', 'foto'],
            filter: (() => { const f = { ...filter }; delete (f as any)._or; return f })(),
            sort: [`${order === 'desc' ? '-' : ''}${sort}`],
            limit,
            offset: Math.max(0, (page - 1) * limit),
          })
        )
        return Array.isArray(data) ? data : []
      }
    }
    throw e
  }
}

export async function fetchPessoalCount({
  q,
  docente = null,
  fromYear = null,
  toYear = null,
}: Pick<FetchPessoalParams, 'q' | 'docente' | 'fromYear' | 'toYear'> = {}) {
  const filter: any = {}
  if (q && q.trim()) {
    const parts: any[] = [{ nome: { _contains: q } }]
    const dm = q.match(/\d+/)
    if (dm) {
      const num = Number(dm[0])
      if (Number.isFinite(num)) parts.push({ numero_processo: { _eq: num } })
    }
    filter._or = parts
  }
  if (docente !== null) {
    filter.docente = { _eq: !!docente }
  }
  if (fromYear != null || toYear != null) {
    const a0 = fromYear ?? 0
    const a1 = toYear ?? 9999
    filter.anos_lectivos = {
      _some: {
        Anos_Lectivos_id: {
          ano_inicio: { _between: [a0, a1] },
        },
      },
    }
  }

  try {
    const endpoint = `${DIRECTUS_URL.replace(/\/$/, '')}/items/Pessoal`
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (DIRECTUS_TOKEN) headers['Authorization'] = `Bearer ${DIRECTUS_TOKEN}`

    // Primary: meta=filter_count (fast) using original nested JSON filter
    const p = new URLSearchParams()
    p.set('fields', 'id')
    p.set('limit', '0')
    p.append('meta', 'filter_count')
    if (Object.keys(filter).length) p.set('filter', JSON.stringify(filter))
    let resp = await fetch(`${endpoint}?${p.toString()}`, { headers })
    if (resp.ok) {
      const json = await resp.json().catch(() => ({} as any))
      const count = Number((json as any)?.meta?.filter_count)
      console.log('Primary: filter_count', count)
      if (Number.isFinite(count)) return count
    }

    console.log('Fallback: aggregate count')

    // Fallback: aggregate count
    const a = new URLSearchParams()
    a.append('aggregate[count]', '*')
    if (Object.keys(filter).length) a.set('filter', JSON.stringify(filter))
    resp = await fetch(`${endpoint}?${a.toString()}`, { headers })
    if (resp.ok) {
      const json = await resp.json().catch(() => ({} as any))
      const val = Number((json as any)?.data?.[0]?.count)
      if (Number.isFinite(val)) return val
    }
    return 0
  } catch {
    return 0
  }
}

export async function fetchPessoalById(id: string | number, lang: string = 'pt') {
  const data = await directus.request(
    readItem('Pessoal', id, {
      fields: [
        '*',
        'foto',
        // One-to-many PAL records with nested relations
        'anos_lectivos.id',
        'anos_lectivos.Anos_Lectivos_id.*',
        'anos_lectivos.funcao.id',
        'anos_lectivos.funcao.translations.*',
        'anos_lectivos.categoria.id',
        'anos_lectivos.categoria.translations.*',
        'anos_lectivos.grupo.id',
        'anos_lectivos.grupo.translations.*',
        'anos_lectivos.curso.id',
        'anos_lectivos.curso.translations.*',
        // M2M disciplinas
        'anos_lectivos.disciplinas.Disciplinas_id.id',
        'anos_lectivos.disciplinas.Disciplinas_id.translations.*',
      ],
      deep: {
        anos_lectivos: {
          funcao: { translations: { _filter: { languages_code: { _eq: lang } } } },
          categoria: { translations: { _filter: { languages_code: { _eq: lang } } } },
          grupo: { translations: { _filter: { languages_code: { _eq: lang } } } },
          curso: { translations: { _filter: { languages_code: { _eq: lang } } } },
          disciplinas: {
            Disciplinas_id: {
              translations: { _filter: { languages_code: { _eq: lang } } },
            },
          },
        },
      },
    })
  )
  return data
}
