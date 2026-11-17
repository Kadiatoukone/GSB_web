// Hook React pour gérer l'état des champs du formulaire
import { useState } from 'react'
import './Login.css'
import Logo from '../../assets/logo-GSB.png';
// Icônes utilisées dans la liste d'avantages et le bouton
import { ClipboardList, ShieldCheck, Package, ArrowRight } from 'lucide-react';

function Login() {

    // États qui stockent ce que l'utilisateur tape dans les champs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Appelée à la soumission du formulaire
    const handleLogin = async (e) => {
        // Empêche le rechargement de la page par défaut du navigateur
        e.preventDefault();
        // TODO : envoyer email et password à l'API pour authentifier l'utilisateur
    };

    return (
        <>
            <section className="login__wrapper">

                {/* Colonne de gauche : présentation de la boutique */}
                <div className="login__wrapper-gauche">
                    <div className="login__wrapper-logo">
                        {/* alt vide : image purement décorative, le titre "GSB" suffit */}
                        <img src={Logo} alt="" />
                        <h3>GSB</h3>
                    </div>
                    <h1>L’e-boutique des professionnels de santé.</h1>
                    <p>Consultez le catalogue du laboratoire Galaxy Swiss Bourdin et passez commande en ligne, en toute sécurité.</p>

                    {/* Liste des avantages, chaque ligne avec son icône */}
                    <ul>
                        <li><Package color="#13a69f" />Catalogue complet, à jour en temps réel</li>
                        <li><ClipboardList color="#13a69f" />Commande et historique centralisés</li>
                        <li><ShieldCheck color="#13a69f" />Accès réservé et données protégées</li>
                    </ul>

                    {/* Mention légale en bas de colonne */}
                    <p>Galaxy Swiss Bourdin — Siège : Paris. Accès réservé aux comptes habilités.</p>
                </div>

                {/* Colonne de droite : formulaire de connexion */}
                <div className="login__wrapper-droite">
                    <div className="login__wrapper-container">
                        <h1 className="login__wrapper-title">Connexion</h1>
                        <p className="login__wrapper-subtitle">Identifiez-vous pour accéder à votre espace.</p>

                        {/* onSubmit déclenche handleLogin (clic sur le bouton ou touche Entrée) */}
                        <form onSubmit={handleLogin}>

                            {/* Champ email */}
                            <div className="form-email">
                                {/* Champ "contrôlé" : sa valeur vient du state, et onChange le met à jour à chaque frappe */}
                                <input
                                    type="text"
                                    className="form-control login-input"
                                    id="email"
                                    placeholder="prenom.nom@exemple.fr"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {/* htmlFor relie le label au champ via son id */}
                                <label htmlFor="email" className="text-muted">Email</label>
                            </div>

                            {/* Champ mot de passe (type="password" masque la saisie) */}
                            <div className="form-password">
                                <input
                                    type="password"
                                    className="login-password"
                                    id="password"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="password" className="text-muted">Mot de passe</label>
                            </div>

                            {/* Lien de récupération du mot de passe */}
                            <div className="mpd_oublié">
                                <a href="/forget-password" className="login-forgot-link">
                                    Mot de passe oublié ?
                                </a>
                            </div>

                            {/* type="submit" : déclenche l'envoi du formulaire */}
                            <button type="submit" className="login-submit-btn">
                                Se connecter <ArrowRight color="#fff" />
                            </button>
                        </form>

                        {/* Pas d'inscription libre : les comptes sont créés par un admin */}
                        <p className="login-info">
                            Pas de compte ? Les accès sont créés par un administrateur GSB.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
};

export default Login; 