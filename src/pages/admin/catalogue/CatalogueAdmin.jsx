import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { Plus, Search, Pencil, Power, RotateCcw, Trash2, Check, X } from 'lucide-react';
import '../Admin.css';
import BadgeStatut from '../../../components/BadgeStatut.jsx';
import { TAUX_TVA, formaterPrix, formaterTaux, calculerPrixTTC } from '../adminUtils.js';

const PRODUIT_VIDE = {
    nom: '',
    reference: '',
    categorie: '',
    description: '',
    prixHT: '',
    tauxTVA: String(TAUX_TVA[0].valeur),
};

// ADMIN-02 : créer, modifier et désactiver les produits et les catégories
function CatalogueAdmin() {
    const { produits, setProduits, categories, setCategories } = useOutletContext();

    // ----- Produits -----
    const [recherche, setRecherche] = useState('');
    const [filtreCategorie, setFiltreCategorie] = useState('toutes');
    const [filtreStatut, setFiltreStatut] = useState('tous');
    const [formulaire, setFormulaire] = useState(null);
    const [idEnModification, setIdEnModification] = useState(null);
    const [erreur, setErreur] = useState('');
    const [message, setMessage] = useState('');

    // ----- Catégories -----
    const [nouvelleCategorie, setNouvelleCategorie] = useState('');
    const [idCategorieEnModification, setIdCategorieEnModification] = useState(null);
    const [libelleModifie, setLibelleModifie] = useState('');
    const [erreurCategorie, setErreurCategorie] = useState('');

    const texte = recherche.trim().toLowerCase();
    const produitsAffiches = produits.filter((produit) => {
        const correspondRecherche = `${produit.nom} ${produit.reference}`.toLowerCase().includes(texte);
        const correspondCategorie = filtreCategorie === 'toutes' || produit.categorie === filtreCategorie;
        const correspondStatut = filtreStatut === 'tous'
            || (filtreStatut === 'actif' && produit.actif)
            || (filtreStatut === 'inactif' && !produit.actif);
        return correspondRecherche && correspondCategorie && correspondStatut;
    });

    function ouvrirCreation() {
        setFormulaire({ ...PRODUIT_VIDE, categorie: categories[0]?.libelle ?? '' });
        setIdEnModification(null);
        setErreur('');
        setMessage('');
    }

    function ouvrirModification(produit) {
        setFormulaire({
            nom: produit.nom,
            reference: produit.reference,
            categorie: produit.categorie,
            description: produit.description,
            prixHT: String(produit.prixHT),
            tauxTVA: String(produit.tauxTVA),
        });
        setIdEnModification(produit.id);
        setErreur('');
        setMessage('');
    }

    function fermerFormulaire() {
        setFormulaire(null);
        setIdEnModification(null);
        setErreur('');
    }

    function changerChamp(event) {
        const { name, value } = event.target;
        setFormulaire({ ...formulaire, [name]: value });
    }

    function enregistrerProduit(event) {
        event.preventDefault();

        const reference = formulaire.reference.trim().toUpperCase();
        const referenceDejaUtilisee = produits.some(
            (produit) => produit.reference === reference && produit.id !== idEnModification
        );
        if (referenceDejaUtilisee) {
            setErreur('Cette référence est déjà utilisée par un autre produit.');
            return;
        }

        // Les champs d'un formulaire sont toujours du texte : on les convertit en nombres
        const donnees = {
            ...formulaire,
            reference,
            prixHT: Number(formulaire.prixHT),
            tauxTVA: Number(formulaire.tauxTVA),
        };

        if (idEnModification === null) {
            const nouveauProduit = {
                ...donnees,
                id: Math.max(0, ...produits.map((produit) => produit.id)) + 1,
                actif: true,
            };
            setProduits([...produits, nouveauProduit]);
            setMessage(`Le produit « ${donnees.nom} » a été ajouté au catalogue.`);
        } else {
            // CMD-03 : changer le prix ici ne modifie pas les commandes déjà passées,
            // car chaque ligne de commande garde son propre prix figé.
            setProduits(produits.map((produit) => (
                produit.id === idEnModification ? { ...produit, ...donnees } : produit
            )));
            setMessage(`Le produit « ${donnees.nom} » a été mis à jour.`);
        }

        fermerFormulaire();
    }

    // PROD-05 / RG-04 : un produit désactivé disparaît du catalogue client,
    // mais reste en base et dans l'historique des commandes.
    function basculerStatut(produit) {
        setProduits(produits.map((p) => (p.id === produit.id ? { ...p, actif: !p.actif } : p)));
        setMessage(
            produit.actif
                ? `« ${produit.nom} » est désactivé : il n'apparaît plus dans le catalogue des professionnels.`
                : `« ${produit.nom} » est réactivé.`
        );
    }

    // ----- Gestion des catégories -----

    function nombreProduits(libelle) {
        return produits.filter((produit) => produit.categorie === libelle).length;
    }

    function libelleExiste(libelle, idIgnore) {
        return categories.some(
            (categorie) => categorie.libelle.toLowerCase() === libelle.toLowerCase() && categorie.id !== idIgnore
        );
    }

    function ajouterCategorie(event) {
        event.preventDefault();
        const libelle = nouvelleCategorie.trim();
        if (libelleExiste(libelle, null)) {
            setErreurCategorie('Cette catégorie existe déjà.');
            return;
        }
        setCategories([...categories, { id: Math.max(0, ...categories.map((c) => c.id)) + 1, libelle }]);
        setNouvelleCategorie('');
        setErreurCategorie('');
    }

    function renommerCategorie(categorie) {
        const libelle = libelleModifie.trim();
        if (!libelle) return;
        if (libelleExiste(libelle, categorie.id)) {
            setErreurCategorie('Cette catégorie existe déjà.');
            return;
        }
        setCategories(categories.map((c) => (c.id === categorie.id ? { ...c, libelle } : c)));
        // Les produits rangés dans cette catégorie suivent le nouveau nom
        setProduits(produits.map((produit) => (
            produit.categorie === categorie.libelle ? { ...produit, categorie: libelle } : produit
        )));
        setIdCategorieEnModification(null);
        setErreurCategorie('');
    }

    // Une catégorie ne peut être supprimée que si elle ne contient aucun produit
    // (sinon des produits se retrouveraient sans catégorie, ce que le MCD interdit : 1,1)
    function supprimerCategorie(categorie) {
        setCategories(categories.filter((c) => c.id !== categorie.id));
        setErreurCategorie('');
    }

    return (
        <>
            <div className="admin-page__top">
                <div>
                    <h1 className="admin-page__title">Gestion du catalogue</h1>
                    <p className="admin-page__subtitle">Produits et catégories</p>
                </div>
                <button className="admin-page__button" type="button" onClick={ouvrirCreation}
                    disabled={categories.length === 0}>
                    <Plus size={16} /> Nouveau produit
                </button>
            </div>

            {message && <p className="admin-page__message" role="status">{message}</p>}

            {formulaire && (
                <section className="admin-page__card">
                    <h2 className="admin-page__card-title">
                        {idEnModification === null ? 'Nouveau produit' : 'Modifier le produit'}
                    </h2>

                    {erreur && <p className="admin-page__erreur" role="alert">{erreur}</p>}

                    <form className="admin-page__form" onSubmit={enregistrerProduit}>
                        <div className="admin-page__field">
                            <label className="admin-page__label" htmlFor="nom">Nom du médicament</label>
                            <input className="admin-page__input" id="nom" name="nom"
                                value={formulaire.nom} onChange={changerChamp} required />
                        </div>
                        <div className="admin-page__field">
                            <label className="admin-page__label" htmlFor="reference">Référence</label>
                            <input className="admin-page__input admin-page__mono" id="reference" name="reference"
                                placeholder="GSB-XXXX-000" value={formulaire.reference} onChange={changerChamp} required />
                        </div>
                        <div className="admin-page__field">
                            <label className="admin-page__label" htmlFor="categorie">Catégorie</label>
                            <select className="admin-page__select" id="categorie" name="categorie"
                                value={formulaire.categorie} onChange={changerChamp}>
                                {categories.map((categorie) => (
                                    <option key={categorie.id} value={categorie.libelle}>{categorie.libelle}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-page__field">
                            <label className="admin-page__label" htmlFor="prixHT">Prix HT (€)</label>
                            <input className="admin-page__input" id="prixHT" name="prixHT" type="number"
                                min="0.01" step="0.01" value={formulaire.prixHT} onChange={changerChamp} required />
                        </div>
                        <div className="admin-page__field">
                            <label className="admin-page__label" htmlFor="tauxTVA">Taux de TVA</label>
                            <select className="admin-page__select" id="tauxTVA" name="tauxTVA"
                                value={formulaire.tauxTVA} onChange={changerChamp}>
                                {TAUX_TVA.map((taux) => (
                                    <option key={taux.valeur} value={String(taux.valeur)}>{taux.libelle}</option>
                                ))}
                            </select>
                        </div>
                        <div className="admin-page__field">
                            <span className="admin-page__label">Prix TTC (calculé)</span>
                            <p className="admin-page__principal">
                                {formulaire.prixHT
                                    ? formaterPrix(calculerPrixTTC(Number(formulaire.prixHT), Number(formulaire.tauxTVA)))
                                    : '—'}
                            </p>
                        </div>
                        <div className="admin-page__field admin-page__field--large">
                            <label className="admin-page__label" htmlFor="description">Description</label>
                            <textarea className="admin-page__input admin-page__input--zone" id="description"
                                name="description" value={formulaire.description} onChange={changerChamp} required />
                        </div>

                        <div className="admin-page__form-actions">
                            <button className="admin-page__button admin-page__button--secondaire" type="button"
                                onClick={fermerFormulaire}>
                                Annuler
                            </button>
                            <button className="admin-page__button" type="submit">
                                {idEnModification === null ? 'Ajouter le produit' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* ----- Produits ----- */}
            <div className="admin-page__toolbar">
                <label className="admin-page__search">
                    <Search size={16} />
                    <input
                        type="search"
                        placeholder="Rechercher un produit ou une référence…"
                        aria-label="Rechercher un produit"
                        value={recherche}
                        onChange={(event) => setRecherche(event.target.value)}
                    />
                </label>
                <select className="admin-page__select" aria-label="Filtrer par catégorie"
                    value={filtreCategorie} onChange={(event) => setFiltreCategorie(event.target.value)}>
                    <option value="toutes">Toutes les catégories</option>
                    {categories.map((categorie) => (
                        <option key={categorie.id} value={categorie.libelle}>{categorie.libelle}</option>
                    ))}
                </select>
                <select className="admin-page__select" aria-label="Filtrer par statut"
                    value={filtreStatut} onChange={(event) => setFiltreStatut(event.target.value)}>
                    <option value="tous">Tous les statuts</option>
                    <option value="actif">Actifs</option>
                    <option value="inactif">Désactivés</option>
                </select>
            </div>

            <div className="admin-page__table-wrapper">
                <table className="admin-page__table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Catégorie</th>
                            <th className="admin-page__nombre">Prix HT</th>
                            <th className="admin-page__nombre">TVA</th>
                            <th className="admin-page__nombre">Prix TTC</th>
                            <th>Statut</th>
                            <th className="admin-page__nombre">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produitsAffiches.map((produit) => (
                            <tr key={produit.id}>
                                <td>
                                    <span className="admin-page__principal">{produit.nom}</span>
                                    <span className="admin-page__secondaire admin-page__mono">{produit.reference}</span>
                                </td>
                                <td>{produit.categorie}</td>
                                <td className="admin-page__nombre admin-page__mono">{formaterPrix(produit.prixHT)}</td>
                                <td className="admin-page__nombre admin-page__mono">{formaterTaux(produit.tauxTVA)}</td>
                                <td className="admin-page__nombre admin-page__mono">
                                    {formaterPrix(calculerPrixTTC(produit.prixHT, produit.tauxTVA))}
                                </td>
                                <td><BadgeStatut statut={produit.actif ? 'Actif' : 'Inactif'} /></td>
                                <td>
                                    <div className="admin-page__actions">
                                        <button className="admin-page__icon-button" type="button"
                                            onClick={() => ouvrirModification(produit)}
                                            title="Modifier" aria-label={`Modifier ${produit.nom}`}>
                                            <Pencil size={15} />
                                        </button>
                                        <button className="admin-page__icon-button" type="button"
                                            onClick={() => basculerStatut(produit)}
                                            title={produit.actif ? 'Désactiver' : 'Réactiver'}
                                            aria-label={`${produit.actif ? 'Désactiver' : 'Réactiver'} ${produit.nom}`}>
                                            {produit.actif ? <Power size={15} /> : <RotateCcw size={15} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {produitsAffiches.length === 0 && (
                    <p className="admin-page__vide">Aucun produit ne correspond à votre recherche.</p>
                )}
            </div>

            {/* ----- Catégories ----- */}
            <section className="admin-page__card">
                <h2 className="admin-page__card-title">Catégories</h2>

                {erreurCategorie && <p className="admin-page__erreur" role="alert">{erreurCategorie}</p>}

                <form className="admin-page__toolbar" onSubmit={ajouterCategorie}>
                    <input className="admin-page__input" aria-label="Nom de la nouvelle catégorie"
                        placeholder="Nouvelle catégorie" value={nouvelleCategorie}
                        onChange={(event) => setNouvelleCategorie(event.target.value)} required />
                    <button className="admin-page__button" type="submit">
                        <Plus size={16} /> Ajouter
                    </button>
                </form>

                <table className="admin-page__table">
                    <thead>
                        <tr>
                            <th>Catégorie</th>
                            <th className="admin-page__nombre">Produits</th>
                            <th className="admin-page__nombre">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((categorie) => {
                            const nombre = nombreProduits(categorie.libelle);
                            const enModification = idCategorieEnModification === categorie.id;

                            return (
                                <tr key={categorie.id}>
                                    <td>
                                        {enModification ? (
                                            <input className="admin-page__input" aria-label="Nouveau nom"
                                                value={libelleModifie}
                                                onChange={(event) => setLibelleModifie(event.target.value)} />
                                        ) : (
                                            <span className="admin-page__principal">{categorie.libelle}</span>
                                        )}
                                    </td>
                                    <td className="admin-page__nombre">{nombre}</td>
                                    <td>
                                        <div className="admin-page__actions">
                                            {enModification ? (
                                                <>
                                                    <button className="admin-page__icon-button" type="button"
                                                        onClick={() => renommerCategorie(categorie)}
                                                        title="Valider" aria-label="Valider le nouveau nom">
                                                        <Check size={15} />
                                                    </button>
                                                    <button className="admin-page__icon-button" type="button"
                                                        onClick={() => setIdCategorieEnModification(null)}
                                                        title="Annuler" aria-label="Annuler">
                                                        <X size={15} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="admin-page__icon-button" type="button"
                                                        onClick={() => {
                                                            setIdCategorieEnModification(categorie.id);
                                                            setLibelleModifie(categorie.libelle);
                                                        }}
                                                        title="Renommer" aria-label={`Renommer ${categorie.libelle}`}>
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button className="admin-page__icon-button" type="button"
                                                        onClick={() => supprimerCategorie(categorie)}
                                                        disabled={nombre > 0}
                                                        title={nombre > 0
                                                            ? 'Impossible : cette catégorie contient des produits'
                                                            : 'Supprimer'}
                                                        aria-label={`Supprimer ${categorie.libelle}`}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
        </>
    );
}

export default CatalogueAdmin;
