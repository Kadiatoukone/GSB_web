import './BadgeStatut.css';

// Couleur du badge selon le statut (compte ou commande)
const VARIANTES = {
    'Actif': 'succes',
    'Inactif': 'neutre',
    'Validée': 'info',
    'Expédiée': 'bleu',
    'Livrée': 'succes',
    'Annulée': 'danger',
};

function BadgeStatut({ statut }) {
    const variante = VARIANTES[statut] ?? 'neutre';

    return (
        <span className={`badge-statut badge-statut--${variante}`}>{statut}</span>
    );
}

export default BadgeStatut;
