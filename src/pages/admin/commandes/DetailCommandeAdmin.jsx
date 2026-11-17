import { useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router';
import '../Admin.css';
import './DetailCommandeAdmin.css';
import BadgeStatut from '../../../components/BadgeStatut.jsx';
import { STATUTS_SUIVANTS, calculerTotaux, formaterDate, formaterPrix, formaterTaux } from '../adminUtils.js';

// ADMIN-03 (détail d'une commande) + changement de statut selon RG-06
function DetailCommandeAdmin() {
    const { commandes, setCommandes, comptes } = useOutletContext();

    // useParams lit la partie variable de l'adresse : /admin/commandes/:id
    // C'est toujours du texte, d'où Number(...) pour comparer avec l'id de la commande
    const { id } = useParams();
    const commande = commandes.find((c) => c.id === Number(id));

    const [nouveauStatut, setNouveauStatut] = useState('');
    const [message, setMessage] = useState('');

    if (!commande) {
        return (
            <>
                <h1 className="admin-page__title">Commande introuvable</h1>
                <p className="admin-page__subtitle">Cette commande n'existe pas.</p>
                <p><Link className="admin-page__lien" to="/admin/commandes">Retour aux commandes</Link></p>
            </>
        );
    }

    const client = comptes.find((compte) => compte.id === commande.idClient);
    const { totalHT, totalTVA, totalTTC, nbArticles } = calculerTotaux(commande.lignes);
    const statutsPossibles = STATUTS_SUIVANTS[commande.statut];

    function mettreAJourStatut(event) {
        event.preventDefault();
        if (!nouveauStatut) return;

        setCommandes(commandes.map((c) => (c.id === commande.id ? { ...c, statut: nouveauStatut } : c)));
        setMessage(`Le statut de la commande est passé à « ${nouveauStatut} ».`);
        setNouveauStatut('');
    }

    return (
        <>
            <p className="admin-page__fil">
                <Link to="/admin/commandes">Commandes</Link> › <span className="admin-page__mono">{commande.numero}</span>
            </p>

            <div className="admin-page__top">
                <div>
                    <h1 className="admin-page__title">
                        Commande <span className="admin-page__mono">{commande.numero}</span>
                    </h1>
                    <p className="admin-page__subtitle">
                        Passée le {formaterDate(commande.date)} — {nbArticles} articles
                    </p>
                </div>
                <BadgeStatut statut={commande.statut} />
            </div>

            {message && <p className="admin-page__message" role="status">{message}</p>}

            <div className="detail-commande">
                <div>
                    <section className="admin-page__card">
                        <h2 className="admin-page__card-title">Lignes de commande</h2>
                        <table className="admin-page__table">
                            <thead>
                                <tr>
                                    <th>Produit</th>
                                    <th className="admin-page__nombre">Prix unit. HT</th>
                                    <th className="admin-page__nombre">TVA</th>
                                    <th className="admin-page__nombre">Qté</th>
                                    <th className="admin-page__nombre">Sous-total HT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commande.lignes.map((ligne) => (
                                    <tr key={ligne.idProduit}>
                                        <td className="admin-page__principal">{ligne.nom}</td>
                                        <td className="admin-page__nombre admin-page__mono">{formaterPrix(ligne.prixHT)}</td>
                                        <td className="admin-page__nombre admin-page__mono">{formaterTaux(ligne.tauxTVA)}</td>
                                        <td className="admin-page__nombre">{ligne.quantite}</td>
                                        <td className="admin-page__nombre admin-page__mono">
                                            {formaterPrix(ligne.prixHT * ligne.quantite)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="detail-commande__note">
                            Prix figés au moment de la validation : une modification du catalogue ne change pas cette commande.
                        </p>
                    </section>

                    <section className="admin-page__card">
                        <h2 className="admin-page__card-title">Client et livraison</h2>
                        <dl className="detail-commande__infos">
                            <dt>Client</dt>
                            <dd>{client ? `${client.prenom} ${client.nom} — ${client.profession}` : 'Client inconnu'}</dd>
                            <dt>E-mail</dt>
                            <dd className="admin-page__mono">{client?.email ?? '—'}</dd>
                            <dt>Adresse de livraison</dt>
                            <dd>
                                {commande.livraison.etablissement}<br />
                                {commande.livraison.adresse}<br />
                                {commande.livraison.codePostal} {commande.livraison.ville}
                            </dd>
                        </dl>
                    </section>
                </div>

                <div>
                    <section className="admin-page__card detail-commande__statut">
                        <h2 className="admin-page__card-title">Statut de la commande</h2>
                        <p className="detail-commande__ligne">
                            <span>Statut actuel</span>
                            <BadgeStatut statut={commande.statut} />
                        </p>

                        {statutsPossibles.length > 0 ? (
                            <form className="detail-commande__form" onSubmit={mettreAJourStatut}>
                                <label className="admin-page__label" htmlFor="statut">Nouveau statut</label>
                                <select className="admin-page__select" id="statut" value={nouveauStatut}
                                    onChange={(event) => setNouveauStatut(event.target.value)} required>
                                    <option value="">Choisir…</option>
                                    {statutsPossibles.map((statut) => (
                                        <option key={statut} value={statut}>{statut}</option>
                                    ))}
                                </select>
                                <button className="admin-page__button" type="submit">Mettre à jour le statut</button>
                            </form>
                        ) : (
                            <p className="detail-commande__note">
                                Cette commande est {commande.statut.toLowerCase()} : son statut ne peut plus changer.
                            </p>
                        )}
                    </section>

                    <section className="admin-page__card">
                        <h2 className="admin-page__card-title">Récapitulatif</h2>
                        <p className="detail-commande__ligne">
                            <span>Total HT</span>
                            <span className="admin-page__mono">{formaterPrix(totalHT)}</span>
                        </p>
                        <p className="detail-commande__ligne">
                            <span>TVA</span>
                            <span className="admin-page__mono">{formaterPrix(totalTVA)}</span>
                        </p>
                        <p className="detail-commande__ligne detail-commande__ligne--total">
                            <span>Total TTC</span>
                            <span>{formaterPrix(totalTTC)}</span>
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}

export default DetailCommandeAdmin;
