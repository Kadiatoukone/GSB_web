// Outils partagés par les pages admin : listes de valeurs et fonctions de calcul / d'affichage.

// Taux de TVA possibles pour un médicament (MCD : PRODUIT.taux_tva)
export const TAUX_TVA = [
    { valeur: 0.021, libelle: '2,10 % (remboursable)' },
    { valeur: 0.1, libelle: '10 % (non remboursable)' },
];

// Types de profession d'un professionnel de santé (cahier des charges, section 4)
export const PROFESSIONS = ['Médecin', 'Pharmacien', 'Établissement médical'];

export const LIBELLES_ROLES = {
    pro: 'Professionnel de santé',
    admin: 'Administrateur',
};

export const STATUTS_COMMANDE = ['Validée', 'Expédiée', 'Livrée', 'Annulée'];

// RG-06 : Validée → Expédiée → Livrée, ou Validée → Annulée
export const STATUTS_SUIVANTS = {
    'Validée': ['Expédiée', 'Annulée'],
    'Expédiée': ['Livrée'],
    'Livrée': [],
    'Annulée': [],
};

const formatPrix = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const formatDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

export function formaterPrix(montant) {
    return formatPrix.format(montant);
}

export function formaterDate(date) {
    return formatDate.format(new Date(date));
}

export function formaterTaux(taux) {
    return `${(taux * 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} %`;
}

export function calculerPrixTTC(prixHT, tauxTVA) {
    return prixHT * (1 + tauxTVA);
}

// Totaux d'une commande, calculés à partir des prix FIGÉS de ses lignes (RG-03)
export function calculerTotaux(lignes) {
    let totalHT = 0;
    let totalTVA = 0;
    let nbArticles = 0;

    lignes.forEach((ligne) => {
        const sousTotalHT = ligne.prixHT * ligne.quantite;
        totalHT += sousTotalHT;
        totalTVA += sousTotalHT * ligne.tauxTVA;
        nbArticles += ligne.quantite;
    });

    return { totalHT, totalTVA, totalTTC: totalHT + totalTVA, nbArticles };
}

// RG-07 : un compte créé par l'admin reçoit un mot de passe temporaire.
// PROVISOIRE : dans la vraie appli, c'est l'API qui le génère et le stocke haché (RG-02).
export function genererMotDePasseTemporaire() {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let motDePasse = '';
    for (let i = 0; i < 10; i++) {
        motDePasse += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    return motDePasse;
}
