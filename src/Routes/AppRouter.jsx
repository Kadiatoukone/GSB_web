import { Routes, Route } from 'react-router';

import Login from '../pages/login/Login.jsx';
import Catalogue from '../pages/catalogue/Catalogue.jsx';
import Details from '../pages/fiche-produit/Details.jsx';
import Panier from '../pages/panier/Panier.jsx';

function AppRouter() {

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Catalogue />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="/panier" element={<Panier />} />
            </Routes>
        </>
    )
}

export default AppRouter;
