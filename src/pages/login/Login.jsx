import { useState } from 'react'
import './Login.css'
import Logo from '../../assets/logo-GSB.png';
import { ClipboardList, ShieldCheck, Package, ArrowRight } from 'lucide-react';

function Login() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
    };

    return (
        <>
            <section className="login__wrapper">
                <div className="login__wrapper-gauche">
                    <div className="login__wrapper-logo">
                        <img src={Logo} alt="" />
                        <h3>GSB</h3>
                    </div>
                    <h1>L’e-boutique des professionnels de santé.</h1>
                    <p>Consultez le catalogue du laboratoire Galaxy Swiss Bourdin et passez commande en ligne, en toute sécurité.</p>

                    <ul>
                        <li><Package color="#13a69f" />Catalogue complet, à jour en temps réel</li>
                        <li><ClipboardList color="#13a69f" />Commande et historique centralisés</li>
                        <li><ShieldCheck color="#13a69f" />Accès réservé et données protégées</li>
                    </ul>
                    
                    <p>Galaxy Swiss Bourdin — Siège : Paris. Accès réservé aux comptes habilités.</p>
                </div>
                
                <div className="login__wrapper-droite">
                    <div className="login__wrapper-container">
                        <h1 className="login__wrapper-title">Connexion</h1>
                        <p className="login__wrapper-subtitle">Identifiez-vous pour accéder à votre espace.</p>

                        <form onSubmit={handleLogin}>
                
                            <div className="form-email">
                                <input
                                    type="text"
                                    className="form-control login-input"
                                    id="email"
                                    placeholder="prenom.nom@exemple.fr"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="email" className="text-muted">Email</label>
                            </div>
                
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
                            
                            <div className="mpd_oublié">
                                <a href="/forget-password" className="login-forgot-link">
                                    Mot de passe oublié ?
                                </a>
                            </div>
                            
                            <button type="submit" className="login-submit-btn">
                                Se connecter <ArrowRight color="#fff" />
                            </button>
                        </form>

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
