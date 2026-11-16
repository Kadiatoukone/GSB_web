import './Details.css';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';
import { ChevronLeft, Pill, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { produits } from '../../data/produits.js';

function Details({ onAjouter }) {
    const { id } = useParams();
    const [quantite, setQuantite] = useState(1);

    const { nom, description, prixHT, image } = produit;
    const prixTTC = prixHT * 1.021;
    
    const produit = produits.find((p) => String(p.id) === id);

    if (!produit) return <p>Produit introuvable</p>;

    function diminuer() {
        setQuantite(Math.max(1, quantite - 1));
    }

    function augmenter() {
        setQuantite(quantite + 1);
    }

    return (
        <>
            <Header />

            <div className="details__container">
                <a href="/" className="details__back-link">
                    <ChevronLeft color="#171717" />
                </a>

                <div className="details__img">
                    <img src={image} alt={nom} />
                    <Pill size={36} color="#13a69f" />
                </div>
                <div className="details__content">
                    <h1 className="details__title">{nom}</h1>
                    <p className="details__description">{description}</p>
                    <p className="details__price">
                        <span className="details__ht">{prixHT.toFixed(2).replace('.', ',')} € HT</span>
                        <strong>{prixTTC.toFixed(2).replace('.', ',')} €</strong>
                        <span className="details__ttc">TTC</span>
                    </p>

                    <div className="details__actions">
                        <div className="quantite">
                            <button type="button" onClick={diminuer} aria-label="Diminuer la quantité">
                                <Minus size={14} />
                            </button>
            
                            <span>{quantite}</span>
            
                            <button type="button" onClick={augmenter} aria-label="Augmenter la quantité">
                                <Plus size={14} />
                            </button>
                        </div>
                        <button type="button" className="details__add" onClick={onAjouter}>
                            Ajouter au panier
                        </button>
                    </div>

                    <div className="details__info">
                        <h3>Informations Produit</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Substance active:</td>
                                    
                                </tr>
                                <tr>
                                    <td>Dosage:</td>
                                    
                                </tr>
                                <tr>
                                    <td>Forme:</td>
                                    
                                </tr>
                                <tr>
                                    <td>Conditionnement:</td>
                                </tr>
                                <tr>
                                    <td>Fournisseur:</td>
                                </tr>
                                <tr>
                                    <td>Référence:</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Details;