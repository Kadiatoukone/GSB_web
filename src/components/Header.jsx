import { Link } from 'react-router';
import './Header.css';
import Logo from '../assets/logo-GSB.png';
import { ShoppingCart } from 'lucide-react';

function Header() {
    return (
        <header className="site-header">
            <div className="site-header__logo">
                <img src={Logo} alt="" />
                <h3>GSB</h3>
            </div> 

            <nav className="site-header__nav">
                <Link className="site-header__home" to="/">
                    Catalogue
                </Link>

                <Link className="site-header__link" to="/commandes">
                    Mes commandes
                </Link>
            
                <Link className="site-header__link" to="/compte">
                    Mon compte
                </Link>
            </nav>

            <div className="site-header__panier">
                <p className="site-header__name">Dr. Camille Rivot</p>
                <Link to="/panier" className="site-header__cart-link">
                    <button className="site-header__right">
                        <ShoppingCart color="#13a69f" /> Mon panier
                    </button>
                </Link>
            </div>
        </header>
    );
}

export default Header;