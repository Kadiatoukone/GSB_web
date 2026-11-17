import { useState } from 'react';
import { Link, useOutletContext } from 'react-router';
import { Search, ChevronRight } from 'lucide-react';
import '../Admin.css';
import BadgeStatut from '../../../components/BadgeStatut.jsx';
import { STATUTS_COMMANDE, calculerTotaux, formaterDate, formaterPrix } from '../adminUtils.js';

// ADMIN-03 : consulter l'ensemble des commandes passées
function CommandesAdmin() {
    const { commandes, comptes } = useOutletContext();

    const [recherche, setRecherche] = useState('');
    const [filtreStatut, setFiltreStatut] = useState('tous');

    // Retrouve le client d'une commande à partir de son identifiant (lien PASSER du MCD)
    function nomClient(idClient) {
        const client = comptes.find((compte) => compte.id === idClient);
        return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
    }

    const texte = recherche.trim().toLowerCase();
    const commandesAffichees = commandes
        .filter((commande) => {
            const correspondRecherche = `${commande.numero} ${nomClient(commande.idClient)} ${commande.livraison.etablissement}`
                .toLowerCase()
                .includes(texte);
            const correspondStatut = filtreStatut === 'tous' || commande.statut === filtreStatut;
            return correspondRecherche && correspondStatut;
        })
        // De la plus récente à la plus ancienne
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <>
            <div className="admin-page__top">
                <div>
                    <h1 className="admin-page__title">Commandes</h1>
                    <p className="admin-page__subtitle">Toutes les commandes passées sur l'e-boutique</p>
                </div>
            </div>

            <div className="admin-page__toolbar">
                <label className="admin-page__search">
                    <Search size={16} />
                    <input
                        type="search"
                        placeholder="N° de commande, client ou établissement…"
                        aria-label="Rechercher une commande"
                        value={recherche}
                        onChange={(event) => setRecherche(event.target.value)}
                    />
                </label>
                <select className="admin-page__select" aria-label="Filtrer par statut"
                    value={filtreStatut} onChange={(event) => setFiltreStatut(event.target.value)}>
                    <option value="tous">Tous les statuts</option>
                    {STATUTS_COMMANDE.map((statut) => (
                        <option key={statut} value={statut}>{statut}</option>
                    ))}
                </select>
            </div>

            <div className="admin-page__table-wrapper">
                <table className="admin-page__table">
                    <thead>
                        <tr>
                            <th>N° de commande</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th className="admin-page__nombre">Articles</th>
                            <th className="admin-page__nombre">Total TTC</th>
                            <th>Statut</th>
                            <th className="admin-page__nombre"><span className="sr-only">Détail</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandesAffichees.map((commande) => {
                            const { totalTTC, nbArticles } = calculerTotaux(commande.lignes);

                            return (
                                <tr key={commande.id}>
                                    <td className="admin-page__mono admin-page__principal">{commande.numero}</td>
                                    <td>
                                        <span className="admin-page__principal">{nomClient(commande.idClient)}</span>
                                        <span className="admin-page__secondaire">{commande.livraison.etablissement}</span>
                                    </td>
                                    <td>{formaterDate(commande.date)}</td>
                                    <td className="admin-page__nombre">{nbArticles}</td>
                                    <td className="admin-page__nombre admin-page__mono">{formaterPrix(totalTTC)}</td>
                                    <td><BadgeStatut statut={commande.statut} /></td>
                                    <td className="admin-page__nombre">
                                        <Link className="admin-page__lien" to={`/admin/commandes/${commande.id}`}>
                                            Détail <ChevronRight size={15} />
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {commandesAffichees.length === 0 && (
                    <p className="admin-page__vide">Aucune commande ne correspond à votre recherche.</p>
                )}
            </div>
        </>
    );
}

export default CommandesAdmin;
