import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { Plus, Search, Pencil, Power, RotateCcw } from 'lucide-react';
import '../Admin.css';
import BadgeStatut from '../../../components/BadgeStatut.jsx';
import { PROFESSIONS, LIBELLES_ROLES, genererMotDePasseTemporaire } from '../adminUtils.js';

const FORMULAIRE_VIDE = {
    prenom: '',
    nom: '',
    email: '',
    role: 'pro',
    profession: PROFESSIONS[0],
    etablissement: '',
    adresse: '',
    codePostal: '',
    ville: '',
};

// L'administrateur connecté (A. Berthier) ne peut pas désactiver son propre compte
const ID_ADMIN_CONNECTE = 5;

// ADMIN-01 : créer, modifier et désactiver les comptes
function ComptesAdmin() {
    // Les données viennent du cadre AdminLayout (voir son <Outlet context={...} />)
    const { comptes, setComptes } = useOutletContext();

    const [recherche, setRecherche] = useState('');
    const [filtreRole, setFiltreRole] = useState('tous');
    const [filtreStatut, setFiltreStatut] = useState('tous');

    // formulaire = null : le formulaire est fermé
    const [formulaire, setFormulaire] = useState(null);
    // idEnModification = null : on crée un compte ; sinon, on modifie ce compte
    const [idEnModification, setIdEnModification] = useState(null);
    const [erreur, setErreur] = useState('');
    const [message, setMessage] = useState('');

    // Liste affichée = tous les comptes qui passent les 3 filtres
    const texte = recherche.trim().toLowerCase();
    const comptesAffiches = comptes.filter((compte) => {
        const correspondRecherche = `${compte.prenom} ${compte.nom} ${compte.email} ${compte.etablissement}`
            .toLowerCase()
            .includes(texte);
        const correspondRole = filtreRole === 'tous' || compte.role === filtreRole;
        const correspondStatut = filtreStatut === 'tous'
            || (filtreStatut === 'actif' && compte.actif)
            || (filtreStatut === 'inactif' && !compte.actif);
        return correspondRecherche && correspondRole && correspondStatut;
    });

    function ouvrirCreation() {
        setFormulaire(FORMULAIRE_VIDE);
        setIdEnModification(null);
        setErreur('');
        setMessage('');
    }

    function ouvrirModification(compte) {
        setFormulaire({
            prenom: compte.prenom,
            nom: compte.nom,
            email: compte.email,
            role: compte.role,
            profession: compte.profession || PROFESSIONS[0],
            etablissement: compte.etablissement,
            adresse: compte.adresse,
            codePostal: compte.codePostal,
            ville: compte.ville,
        });
        setIdEnModification(compte.id);
        setErreur('');
        setMessage('');
    }

    function fermerFormulaire() {
        setFormulaire(null);
        setIdEnModification(null);
        setErreur('');
    }

    // Un seul gestionnaire pour tous les champs : name du champ = nom de la propriété
    function changerChamp(event) {
        const { name, value } = event.target;
        setFormulaire({ ...formulaire, [name]: value });
    }

    function enregistrer(event) {
        event.preventDefault();

        const email = formulaire.email.trim().toLowerCase();

        // RG-01 : deux utilisateurs ne peuvent pas avoir la même adresse e-mail
        const emailDejaUtilise = comptes.some(
            (compte) => compte.email.toLowerCase() === email && compte.id !== idEnModification
        );
        if (emailDejaUtilise) {
            setErreur('Cette adresse e-mail est déjà utilisée par un autre compte.');
            return;
        }

        // Un administrateur n'a ni profession ni adresse de livraison
        const donnees = formulaire.role === 'admin'
            ? { ...formulaire, email, profession: '', etablissement: '', adresse: '', codePostal: '', ville: '' }
            : { ...formulaire, email };

        if (idEnModification === null) {
            const motDePasseTemporaire = genererMotDePasseTemporaire();
            const nouveauCompte = {
                ...donnees,
                id: Math.max(0, ...comptes.map((compte) => compte.id)) + 1,
                actif: true,
                doitChangerMdp: true, // RG-07 : à changer à la première connexion
            };
            setComptes([...comptes, nouveauCompte]);
            setMessage(
                `Compte créé pour ${donnees.prenom} ${donnees.nom}. Mot de passe temporaire à lui transmettre : `
                + `${motDePasseTemporaire} (il devra le changer à sa première connexion).`
            );
        } else {
            setComptes(comptes.map((compte) => (
                compte.id === idEnModification ? { ...compte, ...donnees } : compte
            )));
            setMessage(`Le compte de ${donnees.prenom} ${donnees.nom} a été mis à jour.`);
        }

        fermerFormulaire();
    }

    // « Supprimer » = désactiver : le compte reste en base (il est lié à des commandes)
    function basculerStatut(compte) {
        setComptes(comptes.map((c) => (c.id === compte.id ? { ...c, actif: !c.actif } : c)));
        setMessage(
            compte.actif
                ? `Le compte de ${compte.prenom} ${compte.nom} est désactivé : il ne peut plus se connecter.`
                : `Le compte de ${compte.prenom} ${compte.nom} est réactivé.`
        );
    }

    return (
        <>
            <div className="admin-page__top">
                <div>
                    <h1 className="admin-page__title">Gestion des comptes</h1>
                    <p className="admin-page__subtitle">Professionnels de santé et administrateurs</p>
                </div>
                <button className="admin-page__button" type="button" onClick={ouvrirCreation}>
                    <Plus size={16} /> Nouveau compte
                </button>
            </div>

            {message && <p className="admin-page__message" role="status">{message}</p>}

            {formulaire && (
                <section className="admin-page__card">
                    <h2 className="admin-page__card-title">
                        {idEnModification === null ? 'Nouveau compte' : 'Modifier le compte'}
                    </h2>

                    {erreur && <p className="admin-page__erreur" role="alert">{erreur}</p>}

                    <form className="admin-page__form" onSubmit={enregistrer}>
                        <div className="admin-page__field">
                            <label className="admin-page__label" htmlFor="prenom">Prénom</label>
                            <input className="admin-page__input" id="prenom" name="prenom"
                                value={formulaire.prenom} onChange={changerChamp} required />
                        </div>
                        <div className="admin-page__field">
                            <label className="admin-page__label" htmlFor="nom">Nom</label>
                            <input className="admin-page__input" id="nom" name="nom"
                                value={formulaire.nom} onChange={changerChamp} required />
                        </div>
                        <div className="admin-page__field">
                            <label className="admin-page__label" htmlFor="email">Adresse e-mail</label>
                            <input className="admin-page__input" id="email" name="email" type="email"
                                value={formulaire.email} onChange={changerChamp} required />
                        </div>
                        <div className="admin-page__field">
                            <label className="admin-page__label" htmlFor="role">Rôle</label>
                            <select className="admin-page__select" id="role" name="role"
                                value={formulaire.role} onChange={changerChamp}>
                                <option value="pro">{LIBELLES_ROLES.pro}</option>
                                <option value="admin">{LIBELLES_ROLES.admin}</option>
                            </select>
                        </div>

                        {/* Champs propres aux professionnels de santé (profession + adresse de livraison) */}
                        {formulaire.role === 'pro' && (
                            <>
                                <div className="admin-page__field">
                                    <label className="admin-page__label" htmlFor="profession">Profession</label>
                                    <select className="admin-page__select" id="profession" name="profession"
                                        value={formulaire.profession} onChange={changerChamp}>
                                        {PROFESSIONS.map((profession) => (
                                            <option key={profession} value={profession}>{profession}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-page__field">
                                    <label className="admin-page__label" htmlFor="etablissement">Établissement</label>
                                    <input className="admin-page__input" id="etablissement" name="etablissement"
                                        value={formulaire.etablissement} onChange={changerChamp} required />
                                </div>
                                <div className="admin-page__field admin-page__field--large">
                                    <label className="admin-page__label" htmlFor="adresse">Adresse de livraison</label>
                                    <input className="admin-page__input" id="adresse" name="adresse"
                                        value={formulaire.adresse} onChange={changerChamp} required />
                                </div>
                                <div className="admin-page__field">
                                    <label className="admin-page__label" htmlFor="codePostal">Code postal</label>
                                    <input className="admin-page__input" id="codePostal" name="codePostal"
                                        value={formulaire.codePostal} onChange={changerChamp}
                                        pattern="[0-9]{5}" title="5 chiffres" required />
                                </div>
                                <div className="admin-page__field">
                                    <label className="admin-page__label" htmlFor="ville">Ville</label>
                                    <input className="admin-page__input" id="ville" name="ville"
                                        value={formulaire.ville} onChange={changerChamp} required />
                                </div>
                            </>
                        )}

                        <div className="admin-page__form-actions">
                            <button className="admin-page__button admin-page__button--secondaire" type="button"
                                onClick={fermerFormulaire}>
                                Annuler
                            </button>
                            <button className="admin-page__button" type="submit">
                                {idEnModification === null ? 'Créer le compte' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <div className="admin-page__toolbar">
                <label className="admin-page__search">
                    <Search size={16} />
                    <input
                        type="search"
                        placeholder="Rechercher par nom, e-mail ou établissement…"
                        aria-label="Rechercher un compte"
                        value={recherche}
                        onChange={(event) => setRecherche(event.target.value)}
                    />
                </label>
                <select className="admin-page__select" aria-label="Filtrer par rôle"
                    value={filtreRole} onChange={(event) => setFiltreRole(event.target.value)}>
                    <option value="tous">Tous les rôles</option>
                    <option value="pro">{LIBELLES_ROLES.pro}</option>
                    <option value="admin">{LIBELLES_ROLES.admin}</option>
                </select>
                <select className="admin-page__select" aria-label="Filtrer par statut"
                    value={filtreStatut} onChange={(event) => setFiltreStatut(event.target.value)}>
                    <option value="tous">Tous les statuts</option>
                    <option value="actif">Actifs</option>
                    <option value="inactif">Inactifs</option>
                </select>
            </div>

            <div className="admin-page__table-wrapper">
                <table className="admin-page__table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>E-mail</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th className="admin-page__nombre">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comptesAffiches.map((compte) => (
                            <tr key={compte.id}>
                                <td>
                                    <span className="admin-page__principal">{compte.prenom} {compte.nom}</span>
                                    {compte.role === 'pro' && (
                                        <span className="admin-page__secondaire">
                                            {compte.profession} — {compte.etablissement}
                                        </span>
                                    )}
                                </td>
                                <td className="admin-page__mono">{compte.email}</td>
                                <td>{LIBELLES_ROLES[compte.role]}</td>
                                <td>
                                    <BadgeStatut statut={compte.actif ? 'Actif' : 'Inactif'} />
                                    {compte.doitChangerMdp && (
                                        <span className="admin-page__secondaire">Mot de passe temporaire</span>
                                    )}
                                </td>
                                <td>
                                    <div className="admin-page__actions">
                                        <button className="admin-page__icon-button" type="button"
                                            onClick={() => ouvrirModification(compte)}
                                            title="Modifier" aria-label={`Modifier ${compte.prenom} ${compte.nom}`}>
                                            <Pencil size={15} />
                                        </button>
                                        <button className="admin-page__icon-button" type="button"
                                            onClick={() => basculerStatut(compte)}
                                            disabled={compte.id === ID_ADMIN_CONNECTE}
                                            title={compte.actif ? 'Désactiver' : 'Réactiver'}
                                            aria-label={`${compte.actif ? 'Désactiver' : 'Réactiver'} ${compte.prenom} ${compte.nom}`}>
                                            {compte.actif ? <Power size={15} /> : <RotateCcw size={15} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {comptesAffiches.length === 0 && (
                    <p className="admin-page__vide">Aucun compte ne correspond à votre recherche.</p>
                )}
            </div>
        </>
    );
}

export default ComptesAdmin;
