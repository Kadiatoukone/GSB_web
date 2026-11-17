// useState : hook React qui permet de garder des valeurs en mémoire dans le composant
import { useState } from 'react';
import { Search } from 'lucide-react';
import './Catalogue.css';
import ProductCard from '../../components/ProductCard.jsx';
// Les produits viennent d'un fichier local (données de démonstration, pas encore d'API)
import { produits } from '../../data/produits.js';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
// Hook personnalisé qui donne accès au panier partagé entre toutes les pages (Context)
import { useCart } from '../../context/useCart.js';

// Liste des catégories affichées en boutons ("Tous" = aucun filtre)
const CATEGORIES = ['Tous', 'Antalgiques', 'Antibiotiques', 'Anti-inflammatoires', 'Pneumologie', 'Cardiologie'];

// Nombre de produits affichés par page
const TAILLE_PAGE = 6;

function Catalogue() {
    // États des filtres : à chaque changement, React ré-affiche le composant
    const [categorie, setCategorie] = useState('Tous');   // catégorie sélectionnée
    const [recherche, setRecherche] = useState('');       // texte tapé dans la barre de recherche
    const [tri, setTri] = useState('nom-asc');            // critère de tri choisi
    const [page, setPage] = useState(1);                  // page courante de la pagination
    // On récupère du contexte la fonction qui ajoute un produit au panier
    const { ajouterProduit } = useCart();

    // Quand un filtre change, on mémorise sa valeur et on revient à la page 1
    // (sinon on pourrait se retrouver sur une page qui n'existe plus avec moins de résultats)
    function changerCategorie(valeur) {
        setCategorie(valeur);
        setPage(1);
    }

    // event.target.value = ce que l'utilisateur vient de taper dans le champ
    function changerRecherche(event) {
        setRecherche(event.target.value);
        setPage(1);
    }

    // Même principe pour le menu déroulant de tri
    function changerTri(event) {
        setTri(event.target.value);
        setPage(1);
    }

    // Remet tous les filtres à leur valeur de départ
    function reinitialiserFiltres() {
        setCategorie('Tous');
        setRecherche('');
        setTri('nom-asc');
        setPage(1);
    }

    // 1) Filtrage : on garde les produits qui respectent la catégorie ET la recherche
    const produitsFiltres = produits
        // Si "Tous", on garde tout, sinon seulement la catégorie choisie
        .filter((p) => categorie === 'Tous' || p.categorie === categorie)
        // Recherche insensible à la casse et aux espaces autour (trim + toLowerCase)
        .filter((p) => p.nom.toLowerCase().includes(recherche.trim().toLowerCase()))

    // 2) Tri, sur une copie ([...]) pour ne pas modifier le tableau d'origine
    const produitsTries = [...produitsFiltres].sort((a, b) => {
        if (tri === 'nom-asc') return a.nom.localeCompare(b.nom);   // A → Z (gère les accents)
        if (tri === 'nom-desc') return b.nom.localeCompare(a.nom);  // Z → A
        if (tri === 'prix-asc') return a.prixHT - b.prixHT;         // prix croissant
        return b.prixHT - a.prixHT;                                 // sinon : prix décroissant
    });

    // 3) Pagination : on calcule combien de pages il faut et on découpe la liste
    const total = produitsTries.length;                                  // nombre total de résultats
    const totalPages = Math.max(1, Math.ceil(total / TAILLE_PAGE));      // au moins 1 page, même sans résultat
    const debut = (page - 1) * TAILLE_PAGE;                              // index du premier produit de la page
    const produitsAffiches = produitsTries.slice(debut, debut + TAILLE_PAGE); // les produits de la page courante

    return (
      <>
        <Header />
        <section className="catalogue-page">
            {/* En-tête : titre + barre de recherche */}
            <div className="catalogue-page__top">
                <div>
                    <h1 className="catalogue-page__title">Catalogue des médicaments</h1>
                    <p className="catalogue-page__subtitle">Données de démonstration — GSB Galaxy Swiss Bourdin</p>
                </div>

                <div className="catalogue-page__search">
                    <Search size={14} color="#9aa5b4" />
                    {/* Champ "contrôlé" : sa valeur vient du state, onChange le met à jour */}
                    <input
                        type="search"
                        placeholder="Rechercher un produit..."
                        value={recherche}
                        onChange={changerRecherche}
                    />
                </div>
            </div>

            <div className="catalogue-page__filters">
                {/* Un bouton par catégorie, généré avec map() */}
                <div className="catalogue-page__chips">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}  // key : identifiant unique exigé par React dans une liste
                            type="button"
                            // Ajoute la classe "chip--active" sur la catégorie sélectionnée
                            className={`chip ${categorie === cat ? 'chip--active' : ''}`}
                            onClick={() => changerCategorie(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="catalogue-page__options">
                    {/* Menu de tri */}
                    <label className="catalogue-page__option">
                        Trier :
                        <select value={tri} onChange={changerTri}>
                            <option value="nom-asc">Nom (A → Z)</option>
                            <option value="nom-desc">Nom (Z → A)</option>
                            <option value="prix-asc">Prix croissant</option>
                            <option value="prix-desc">Prix décroissant</option>
                        </select>
                    </label>

                    <button type="button" className="catalogue-page__reset" onClick={reinitialiserFiltres}>
                        Réinitialiser
                    </button>
                </div>
            </div>

            {/* Grille des produits de la page courante */}
            <div className="catalogue-page__list">
                {produitsAffiches.map((p) => (
                    <ProductCard
                        key={p.id}
                        produit={p}                              // on transmet le produit à la carte
                        onAjouter={() => ajouterProduit(p)}      // fonction appelée au clic sur "Ajouter au panier"
                    />
                ))}
            </div>

            {/* Message affiché seulement s'il n'y a aucun résultat */}
            {total === 0 && <p className="products-page__empty">Aucun produit ne correspond aux critères.</p>}

            {/* Pagination, affichée seulement s'il y a plus d'une page */}
            {totalPages > 1 && (
                <div className="pagination">
                    {/* disabled : on ne peut pas reculer depuis la page 1 */}
                    <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        ← Précédente
                    </button>

                    <span>Page {page} / {totalPages}</span>

                    {/* disabled : on ne peut pas avancer depuis la dernière page */}
                    <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        Suivante →
                    </button>
                </div>
            )}
        </section>

        <Footer />
      </>
    );
}

export default Catalogue;