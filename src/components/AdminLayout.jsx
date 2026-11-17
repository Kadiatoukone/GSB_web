import { NavLink, Outlet } from 'react-router';
import { LayoutDashboard, Users, Package, ClipboardList } from 'lucide-react';
import './AdminLayout.css';
import Logo from '../assets/logo-GSB.png';

// Cadre commun à toutes les pages admin :
// la barre latérale reste, seule la page dans <Outlet /> change.
function AdminLayout() {
    return (
        <div className="admin-layout">
            <aside className="admin-layout__menu">
                <div className="admin-layout__logo">
                    <img src={Logo} alt="" />
                    <h3>GSB Admin</h3>
                </div>

                <p className="admin-layout__rubrique">PILOTAGE</p>
                <NavLink className="admin-layout__link" to="/admin" end>
                    <LayoutDashboard size={18} /> Tableau de bord
                </NavLink>

                <p className="admin-layout__rubrique">GESTION</p>
                <NavLink className="admin-layout__link" to="/admin/comptes">
                    <Users size={18} /> Comptes
                </NavLink>
                <NavLink className="admin-layout__link" to="/admin/catalogue">
                    <Package size={18} /> Catalogue
                </NavLink>
                <NavLink className="admin-layout__link" to="/admin/commandes">
                    <ClipboardList size={18} /> Commandes
                </NavLink>

                <p className="admin-layout__connecte">
                    Connecté : A. Berthier<br />Administrateur DSI
                </p>
            </aside>

            <main className="admin-layout__contenu">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
