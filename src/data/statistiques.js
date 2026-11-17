// FAUSSES DONNÉES : statistiques des 6 derniers mois (en attendant l'API).
// Elles sont cohérentes entre elles : 1 284 commandes au total,
// 42 980 € / 1 284 commandes = 33,47 € de panier moyen.

export const indicateurs = [
  { libelle: "Chiffre d'affaires", valeur: '42 980 €', evolution: 12.4 },
  { libelle: 'Commandes', valeur: '1 284', evolution: 8.1 },
  { libelle: 'Panier moyen', valeur: '33,47 €', evolution: 3.9 },
  { libelle: 'Clients actifs', valeur: '327', evolution: -1.2 },
]

export const produitsPlusVendus = [
  { nom: 'Doliprane 1000 mg', quantite: 412 },
  { nom: 'Ibuprofène 400 mg', quantite: 338 },
  { nom: 'Amoxicilline 500 mg', quantite: 271 },
  { nom: 'Spasfon 80 mg', quantite: 189 },
  { nom: 'Ventoline 100 µg', quantite: 142 },
]

export const ventesParCategorie = [
  { categorie: 'Antalgiques', pourcentage: 38, couleur: '#14283C' },
  { categorie: 'Antibiotiques', pourcentage: 24, couleur: '#13a69f' },
  { categorie: 'Anti-inflammatoires', pourcentage: 18, couleur: '#39C15B' },
  { categorie: 'Pneumologie', pourcentage: 12, couleur: '#8FB8B3' },
  { categorie: 'Cardiologie', pourcentage: 8, couleur: '#C9D3DC' },
]

export const evolutionCommandes = [
  { mois: 'Mai', nombre: 168 },
  { mois: 'Juin', nombre: 182 },
  { mois: 'Juil.', nombre: 175 },
  { mois: 'Août', nombre: 204 },
  { mois: 'Sept.', nombre: 241 },
  { mois: 'Oct.', nombre: 314 },
]