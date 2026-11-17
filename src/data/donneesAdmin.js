// FAUSSES DONNÉES de l'espace admin, en attendant l'API Node.js.
// Elles suivent le MCD : UTILISATEUR, CATEGORIE, PRODUIT, COMMANDE et ses lignes (CONCERNER).
import { produits } from './produits.js';

export const comptesInitiaux = [
    {
        id: 1, prenom: 'Camille', nom: 'Rivot', email: 'camille.rivot@exemple.fr', role: 'pro',
        profession: 'Médecin', etablissement: 'Cabinet Dr Camille Rivot',
        adresse: '14 rue des Lilas', codePostal: '75011', ville: 'Paris',
        actif: true, doitChangerMdp: false,
    },
    {
        id: 2, prenom: 'Marc', nom: 'Dubois', email: 'contact@pharma-centre.fr', role: 'pro',
        profession: 'Pharmacien', etablissement: 'Pharmacie du Centre',
        adresse: '3 place de la République', codePostal: '69002', ville: 'Lyon',
        actif: true, doitChangerMdp: false,
    },
    {
        id: 3, prenom: 'Jonas', nom: 'Meyer', email: 'j.meyer@exemple.fr', role: 'pro',
        profession: 'Médecin', etablissement: 'Cabinet Dr Jonas Meyer',
        adresse: '8 avenue Foch', codePostal: '67000', ville: 'Strasbourg',
        actif: false, doitChangerMdp: false,
    },
    {
        id: 4, prenom: 'Sophie', nom: 'Laurent', email: 's.laurent@clinique-saint-jean.fr', role: 'pro',
        profession: 'Établissement médical', etablissement: 'Clinique Saint-Jean',
        adresse: '20 rue Pasteur', codePostal: '33000', ville: 'Bordeaux',
        actif: true, doitChangerMdp: true,
    },
    {
        id: 5, prenom: 'Agnès', nom: 'Berthier', email: 'a.berthier@gsb.fr', role: 'admin',
        profession: '', etablissement: '', adresse: '', codePostal: '', ville: '',
        actif: true, doitChangerMdp: false,
    },
];

// Les catégories sont déduites des produits du catalogue, sans doublon
export const categoriesInitiales = [...new Set(produits.map((produit) => produit.categorie))]
    .sort()
    .map((libelle, index) => ({ id: index + 1, libelle }));

// Les produits du catalogue, avec les champs utiles à l'admin
export const produitsInitiaux = produits.map((produit) => ({
    ...produit,
    // Référence : celle du produit si elle existe, sinon construite à partir du nom
    reference: produit.reference ?? `GSB-${produit.nom.slice(0, 4).toUpperCase()}-${produit.id}`,
    tauxTVA: 0.021,
    actif: true,
}));

// Une ligne de commande garde le nom et le prix du produit AU MOMENT de l'achat (RG-03, CMD-03).
// Exemple : la commande CMD-2026-003654 contient du Doliprane à 2,25 € HT, son ancien prix.
function ligne(idProduit, quantite, prixHT) {
    const produit = produits.find((p) => p.id === idProduit);
    return { idProduit, nom: produit.nom, prixHT: prixHT ?? produit.prixHT, tauxTVA: 0.021, quantite };
}

// Adresse de livraison recopiée depuis le compte au moment de la commande
function livraison(idClient) {
    const client = comptesInitiaux.find((compte) => compte.id === idClient);
    return {
        etablissement: client.etablissement,
        adresse: client.adresse,
        codePostal: client.codePostal,
        ville: client.ville,
    };
}

export const commandesInitiales = [
    {
        id: 6, numero: 'CMD-2026-004128', idClient: 1, date: '2026-10-26T10:17:00', statut: 'Validée',
        livraison: livraison(1), lignes: [ligne(2, 2), ligne(1, 4), ligne(4, 1)],
    },
    {
        id: 5, numero: 'CMD-2026-004056', idClient: 2, date: '2026-10-20T16:20:00', statut: 'Validée',
        livraison: livraison(2), lignes: [ligne(5, 8), ligne(6, 4)],
    },
    {
        id: 4, numero: 'CMD-2026-003902', idClient: 1, date: '2026-10-12T09:41:00', statut: 'Expédiée',
        livraison: livraison(1), lignes: [ligne(2, 4), ligne(1, 6), ligne(3, 5), ligne(4, 2)],
    },
    {
        id: 3, numero: 'CMD-2026-003771', idClient: 1, date: '2026-09-28T11:12:00', statut: 'Livrée',
        livraison: livraison(1), lignes: [ligne(3, 3), ligne(4, 2)],
    },
    {
        id: 2, numero: 'CMD-2026-003654', idClient: 2, date: '2026-09-18T09:30:00', statut: 'Livrée',
        livraison: livraison(2), lignes: [ligne(1, 10, 2.25), ligne(5, 6)],
    },
    {
        id: 1, numero: 'CMD-2026-003588', idClient: 4, date: '2026-09-09T14:05:00', statut: 'Annulée',
        livraison: livraison(4), lignes: [ligne(6, 3)],
    },
];
