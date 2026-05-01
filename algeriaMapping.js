import wilayasData from "./Wilaya_Of_Algeria.json"
import communesData from "./Commune_Of_Algeria.json"

/**
 * Normalise le code wilaya.
 * Exemples :
 * 1      → "01"
 * "1"    → "01"
 * "01"   → "01"
 * "16"   → "16"
 * "69"   → "69"
 */
export function normalizeWilayaCode(wilayaId) {
  if (wilayaId == null || wilayaId === "") return ""

  const s = String(wilayaId).trim()

  // Si c'est numérique, on garde toujours 2 chiffres.
  return /^\d+$/.test(s) ? s.padStart(2, "0") : s
}

/** Données brutes JSON. */
const wilayas = Array.isArray(wilayasData) ? wilayasData : []
const communes = Array.isArray(communesData) ? communesData : []

/**
 * Map wilayaCode → liste des communes.
 * Compatible avec 69 wilayas.
 * Ne pas muter les tableaux retournés directement.
 */
export const communesByWilayaId = (() => {
  const map = new Map()

  for (const commune of communes) {
    const key = normalizeWilayaCode(commune.wilaya_id)

    if (!key) continue

    if (!map.has(key)) {
      map.set(key, [])
    }

    map.get(key).push(commune)
  }

  return map
})()

/** Toutes les wilayas, ordre du JSON 01 → 69. */
export const WILAYAS = wilayas

/** Toutes les communes, ordre du JSON. */
export const COMMUNES = communes

/** Wilaya par code/id normalisé, ou undefined. */
export function getWilayaByCode(wilayaId) {
  const code = normalizeWilayaCode(wilayaId)

  if (!code) return undefined

  return wilayas.find((wilaya) => {
    const wilayaCode = normalizeWilayaCode(wilaya.id || wilaya.code)
    return wilayaCode === code
  })
}

/** Communes d'une wilaya. Retourne [] si la wilaya est inconnue. */
export function getCommunesForWilaya(wilayaId) {
  const key = normalizeWilayaCode(wilayaId)

  if (!key) return []

  return communesByWilayaId.get(key) ?? []
}

/** Wilaya d'une commune via commune.wilaya_id. */
export function getWilayaForCommune(commune) {
  if (!commune?.wilaya_id) return undefined

  return getWilayaByCode(commune.wilaya_id)
}

/**
 * Wilaya enrichie avec ses communes :
 * {
 *   id,
 *   code,
 *   name,
 *   ar_name,
 *   longitude,
 *   latitude,
 *   communes: [...]
 * }
 */
export function getWilayasWithCommunes({ sortCommunesByName = false } = {}) {
  return wilayas.map((wilaya) => {
    const code = normalizeWilayaCode(wilaya.id || wilaya.code)

    let list = getCommunesForWilaya(code)

    if (sortCommunesByName) {
      list = [...list].sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "fr", {
          sensitivity: "base",
        })
      )
    }

    return {
      ...wilaya,
      communes: list,
    }
  })
}

/** Vérifie si une wilaya existe. */
export function hasWilaya(wilayaId) {
  return Boolean(getWilayaByCode(wilayaId))
}

/** Nombre total de wilayas. Normalement 69. */
export function getWilayasCount() {
  return wilayas.length
}

/** Nombre total de communes. Normalement 1541. */
export function getCommunesCount() {
  return communes.length
}

/** Statistiques simples par wilaya. */
export function getWilayaStats() {
  return wilayas.map((wilaya) => {
    const code = normalizeWilayaCode(wilaya.id || wilaya.code)
    const wilayaCommunes = getCommunesForWilaya(code)

    return {
      id: code,
      code,
      name: wilaya.name,
      ar_name: wilaya.ar_name,
      communes_count: wilayaCommunes.length,
    }
  })
}

/**
 * Recherche commune par nom.
 * Exemple : searchCommunesByName("adrar")
 */
export function searchCommunesByName(query) {
  const q = String(query || "").trim().toLowerCase()

  if (!q) return []

  return communes.filter((commune) =>
    String(commune.name || "").toLowerCase().includes(q)
  )
}

/**
 * Recherche wilaya par nom.
 * Exemple : searchWilayasByName("oran")
 */
export function searchWilayasByName(query) {
  const q = String(query || "").trim().toLowerCase()

  if (!q) return []

  return wilayas.filter((wilaya) =>
    String(wilaya.name || "").toLowerCase().includes(q)
  )
}
