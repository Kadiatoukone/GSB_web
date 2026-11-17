import { Routes, Route } from 'react-router';

import Login from '../pages/login/Login.jsx';
import Catalogue from '../pages/catalogue/Catalogue.jsx';
import Details from '../pages/fiche-produit/Details.jsx';
import Panier from '../pages/panier/Panier.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import TableauDeBord from '../pages/admin/tableau-de-bord/TableauDeBord.jsx';

function AppRouter() {

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Catalogue />} />
                <Route path="/details/:id" element={<Details />} />
                <Route path="/panier" element={<Panier />} />

                {/* Espace admin : AdminLayout dessine le cadre, la route enfant va dans son <Outlet /> */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<TableauDeBord />} />
                </Route>
            </Routes>
        </>
    )
}

export default AppRouter;
