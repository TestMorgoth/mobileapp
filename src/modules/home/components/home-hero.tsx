import { Link } from 'react-router-dom';

export function HomeHero(): JSX.Element {
  return (
    <section className="hero home-hero">
      <p className="eyebrow">Esperienza visitatore</p>
      <h2>Scopri il territorio con un'interfaccia piu chiara, guidata e orientata all'azione.</h2>
      <p className="home-hero-copy">
        Luoghi, eventi, itinerari e assistente AI convivono in un'unica esperienza mobile pensata per orientare
        rapidamente il visitatore, valorizzando accessibilita, tempo disponibile e interessi.
      </p>
      <div className="hero-actions">
        <Link className="button" to="/search">
          Cerca ora
        </Link>
        <Link className="button button-secondary" to="/planner">
          Crea percorso
        </Link>
        <Link className="button button-secondary" to="/assistant">
          Apri assistant
        </Link>
      </div>
    </section>
  );
}
