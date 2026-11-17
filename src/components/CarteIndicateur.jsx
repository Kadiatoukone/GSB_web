import './CarteIndicateur.css';

// Une carte de chiffre clé, réutilisée 4 fois dans le tableau de bord.
// libelle, valeur et evolution sont les props : les infos qu'on lui passe.
function CarteIndicateur({ libelle, valeur, evolution }) {
    const enHausse = evolution >= 0;

    return (
        <div className="carte-indicateur">
            <p className="carte-indicateur__libelle">{libelle}</p>
            <p className="carte-indicateur__valeur">{valeur}</p>
            <p className={enHausse ? 'carte-indicateur__evolution carte-indicateur__evolution--hausse' : 'carte-indicateur__evolution carte-indicateur__evolution--baisse'}>
                {enHausse ? '▲' : '▼'} {Math.abs(evolution).toLocaleString('fr-FR')} % vs période préc.
            </p>
        </div>
    );
}

export default CarteIndicateur;
