import './Panier.css';
import Header from '../../components/Header.jsx';
import Footer from '../../components/Footer.jsx';

function Panier() {
    return (
        <>
            <Header />
            <main className="site-main">
                <h1>Panier</h1>
                <p>Contenu du panier</p>
            </main>
            <Footer />
        </>
    );
}

export default Panier;