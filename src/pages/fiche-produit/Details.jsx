// Link : navigation interne sans recharger la page
// useParams : lit les paramètres de l'URL (ici l'id dans /details/:id)
import { Link, useParams } from 'react-router';
import { ChevronLeft, Minus, Pill, Plus } from 'lucide-react';
import { useState } from 'react';
import './Details.css';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
// Accès au panier partagé (Context) pour pouvoir y ajouter un produit
import { useCart } from '../../context/useCart.js';
// Données de démonstration : la liste de tous les produits
import { produits } from '../../data/produits.js';

const TVA = 0.021; // 2,10 % pour les médicaments remboursables

function Details() {
    // 1) On récupère l'id présent dans l'URL.
    // Avec la route <Route path="/details/:id" />, une URL /details/3 donne id = "3"
    const { id } = useParams();

    // 2) On cherche le produit correspondant dans la liste.
    // useParams renvoie toujours une chaîne : on convertit item.id en String
    // pour comparer deux chaînes (sinon 3 === "3" serait faux).
    // find() renvoie le produit trouvé, ou undefined s'il n'existe pas.
    const produit = produits.find((item) => String(item.id) === id);

    // Quantité choisie par l'utilisateur, 1 par défaut
    const [quantite, setQuantite] = useState(1);

    // Fonction du panier, définie dans le contexte
    const { ajouterProduit } = useCart();

    // 3) Si l'id ne correspond à aucun produit, on affiche une page d'erreur
    // et on s'arrête là (le return coupe l'exécution de la fonction).
    // Les hooks (useParams, useState, useCart) sont appelés AVANT ce return :
    // React exige que les hooks soient toujours appelés dans le même ordre.
    if (!produit) {
        return (
            <>
                <Header />
                <main className="details__container details__not-found">
                    <h1>Produit introuvable</h1>
                    <Link to="/">Retour au catalogue</Link>
                </main>
                <Footer />
            </>
        );
    }

    // 4) Le code qui suit ne s'exécute que si le produit existe.
    // Prix TTC calculé à partir du HT : HT × 1,021
    const prixTTC = produit.prixHT * (1 + TVA);

    // Tableau de paires [libellé, valeur] : permet de générer les lignes
    // du tableau avec map() au lieu de répéter 6 fois le même <tr>.
    const informations = [
        ['Substance active', produit.substance],
        ['Dosage', produit.dosage],
        ['Forme', produit.forme],
        ['Conditionnement', produit.conditionnement],
        ['Fournisseur', produit.fournisseur],
        ['Référence', produit.reference],
    ];

    return (
        <>
            <Header />
            {/* <main> : balise sémantique pour le contenu principal de la page */}
            <main className="details__container">
                {/* Lien de retour vers le catalogue ; aria-hidden cache l'icône
                    aux lecteurs d'écran (le texte à côté suffit) */}
                <Link to="/" className="details__back-link">
                    <ChevronLeft aria-hidden="true" />
                    Retour au catalogue
                </Link>

                <div className="details__grid">
                    {/* Colonne image */}
                    <div className="details__img">
                        {/* Si le produit a une image on l'affiche, sinon icône de pilule par défaut */}
                        {produit.image ? (
                            <img src={produit.image} alt={produit.nom} />
                        ) : (
                            <Pill aria-hidden="true" size={48} color="#13a69f" />
                        )}
                    </div>

                    {/* Colonne texte */}
                    <div className="details__content">
                        <span className="details__badge">{produit.categorie}</span>
                        <h1 className="details__title">{produit.nom}</h1>
                        <p className="details__description">{produit.description}</p>

                        {/* Encadré prix : le TTC en premier (c'est ce que le client paie), puis le HT et la TVA */}
                        <div className="details__price-box">
                            {/* toFixed(2) : 2 décimales ; replace : virgule à la française (4.90 → 4,90) */}
                            <p className="details__price">
                                <strong>{prixTTC.toFixed(2).replace('.', ',')} €</strong>
                                <span className="details__ttc">TTC / boîte</span>
                            </p>
                            <p className="details__ht">
                                {produit.prixHT.toFixed(2).replace('.', ',')} € HT
                            </p>
                            <p className="details__tva">TVA 2,10 % (médicament remboursable)</p>
                        </div>

                        <div className="details__actions">
                            {/* Sélecteur de quantité */}
                            <div className="quantite" aria-label="Quantité">
                                <button
                                    type="button"
                                    // Forme "fonction" de setQuantite : value est la valeur la plus récente.
                                    // Math.max(1, ...) empêche de descendre sous 1.
                                    onClick={() => setQuantite((value) => Math.max(1, value - 1))}
                                    aria-label="Diminuer la quantité"
                                >
                                    <Minus size={14} />
                                </button>
                                {/* aria-live="polite" : un lecteur d'écran annonce le nouveau nombre quand il change */}
                                <span aria-live="polite">{quantite}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantite((value) => value + 1)}
                                    aria-label="Augmenter la quantité"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            {/* Ajoute le produit au panier avec la quantité choisie.
                                La flèche () => ... évite d'appeler la fonction au rendu :
                                elle ne s'exécute qu'au clic. */}
                            <button
                                type="button"
                                className="details__add"
                                onClick={() => ajouterProduit(produit, quantite)}
                            >
                                Ajouter au panier
                            </button>
                        </div>

                        {/* aria-labelledby relie la section à son titre (id="product-info-title"),
                            ce qui donne un nom à cette zone pour les lecteurs d'écran */}
                        <section className="details__info" aria-labelledby="product-info-title">
                            <h2 id="product-info-title">Informations produit</h2>
                            <table>
                                <tbody>
                                    {/* Une ligne par paire [label, valeur] du tableau "informations".
                                        key : identifiant unique exigé par React dans une liste. */}
                                    {informations.map(([label, valeur]) => (
                                        <tr key={label}>
                                            {/* <th scope="row"> : cellule d'en-tête de ligne (plus accessible qu'un <td>) */}
                                            <th scope="row">{label}</th>
                                            {/* Si la valeur est vide ou absente, on affiche "Non renseigné" */}
                                            <td>{valeur || 'Non renseigné'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Details;