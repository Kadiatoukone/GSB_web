import './TableauDeBord.css';
import CarteIndicateur from '../../../components/CarteIndicateur.jsx';
import {
    indicateurs,
    produitsPlusVendus,
    ventesParCategorie,
    evolutionCommandes,
} from '../../../data/statistiques.js';

function TableauDeBord() {
    // Les plus grandes valeurs servent de référence : elles font 100 % de la barre
    const maxVendus = Math.max(...produitsPlusVendus.map((produit) => produit.quantite));
    const maxCommandes = Math.max(...evolutionCommandes.map((mois) => mois.nombre));

    return (
        <div className="tableau-de-bord">
            <div className="tableau-de-bord__top">
                <div>
                    <h1 className="tableau-de-bord__title">Tableau de bord</h1>
                    <p className="tableau-de-bord__subtitle">Statistiques commerciales — données de démonstration</p>
                </div>
                <select className="tableau-de-bord__periode" aria-label="Période">
                    <option>6 derniers mois</option>
                </select>
            </div>

            {/* Les 4 cartes de chiffres clés */}
            <div className="tableau-de-bord__indicateurs">
                {indicateurs.map((indicateur) => (
                    <CarteIndicateur
                        key={indicateur.libelle}
                        libelle={indicateur.libelle}
                        valeur={indicateur.valeur}
                        evolution={indicateur.evolution}
                    />
                ))}
            </div>

            <div className="tableau-de-bord__grille">
                {/* Carte de gauche : produits les plus vendus + évolution */}
                <section className="tableau-de-bord__carte">
                    <h2 className="tableau-de-bord__carte-title">Produits les plus vendus (quantité)</h2>
                    {produitsPlusVendus.map((produit) => (
                        <div key={produit.nom} className="tableau-de-bord__ligne">
                            <div className="tableau-de-bord__ligne-libelle">
                                <span>{produit.nom}</span>
                                <span className="tableau-de-bord__chiffre">{produit.quantite}</span>
                            </div>
                            <div className="tableau-de-bord__barre-fond">
                                <div
                                    className="tableau-de-bord__barre"
                                    style={{ width: `${(produit.quantite / maxVendus) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}

                    <h2 className="tableau-de-bord__carte-title tableau-de-bord__carte-title--second">Évolution des commandes</h2>
                    <div className="tableau-de-bord__histogramme">
                        {evolutionCommandes.map((mois, index) => (
                            <div key={mois.mois} className="tableau-de-bord__colonne">
                                <span className="tableau-de-bord__chiffre">{mois.nombre}</span>
                                <div className="tableau-de-bord__colonne-zone">
                                    <div
                                        className={index === evolutionCommandes.length - 1 ? 'tableau-de-bord__colonne-barre tableau-de-bord__colonne-barre--actuelle' : 'tableau-de-bord__colonne-barre'}
                                        style={{ height: `${(mois.nombre / maxCommandes) * 100}%` }}
                                    />
                                </div>
                                <span className="tableau-de-bord__mois">{mois.mois}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Carte de droite : répartition des ventes par catégorie */}
                <section className="tableau-de-bord__carte">
                    <h2 className="tableau-de-bord__carte-title">Ventes par catégorie</h2>
                    {ventesParCategorie.map((ligne) => (
                        <div key={ligne.categorie} className="tableau-de-bord__ligne">
                            <div className="tableau-de-bord__ligne-libelle">
                                <span>
                                    <span className="tableau-de-bord__pastille" style={{ background: ligne.couleur }} />
                                    {ligne.categorie}
                                </span>
                                <span className="tableau-de-bord__chiffre">{ligne.pourcentage} %</span>
                            </div>
                            <div className="tableau-de-bord__barre-fond">
                                <div
                                    className="tableau-de-bord__barre"
                                    style={{ width: `${ligne.pourcentage}%`, background: ligne.couleur }}
                                />
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}

export default TableauDeBord;
