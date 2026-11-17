import { Pill } from 'lucide-react';
// Link : navigation interne sans recharger la page (contrairement à <a href>)
import { Link } from 'react-router';
import './ProductCard.css';

const TVA = 0.021; // taux de TVA des médicaments remboursables (2,10 %)

// Composant réutilisable : il reçoit un produit et une fonction en "props"
function ProductCard({ produit, onAjouter }) {
    // Déstructuration : on extrait directement les champs utiles de l'objet produit
    const { id, nom, categorie, description, prixHT, image } = produit;
    // Prix TTC calculé à partir du HT : HT × 1,021
    const prixTTC = prixHT * (1 + TVA);

    return (
        <article className="product-card">
            <div className="product-card__media">
                {/* Pastille de la catégorie en haut de l'image */}
                <span className="product-card__badge">{categorie}</span>
                {/* Si le produit a une image on l'affiche, sinon une icône de pilule par défaut */}
                {image ? (
                    <img src={image} alt={nom} />
                ) : (
                    <Pill size={36} color="#13a69f" />
                )}
            </div>

            <div className="product-card__content">
                <h2 className="product-card__title">{nom}</h2>
                <p className="product-card__description">{description}</p>

                <p className="product-card__price">
                    {/* toFixed(2) : 2 décimales, replace : virgule à la française (4.90 → 4,90) */}
                    <span className="product-card__ht">{prixHT.toFixed(2).replace('.', ',')} € HT</span>
                    <strong>{prixTTC.toFixed(2).replace('.', ',')} €</strong>
                    <span className="product-card__ttc">TTC</span>
                </p>

                <div className="product-card__actions">
                    {/* onAjouter est définie dans Catalogue : elle ajoute le produit au panier */}
                    <button type="button" className="product-card__add" onClick={onAjouter}>
                        Ajouter au panier
                    </button>
                    {/* Mène à la fiche produit : /details/12 par exemple, l'id sert à retrouver le produit */}
                    <Link className="product-card__details" to={`/details/${id}`}>
                        Détails
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;