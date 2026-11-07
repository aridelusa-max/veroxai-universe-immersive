import { Link, useParams } from 'react-router-dom';
import { worlds } from '../data/worlds';
import WorldPortalScene from '../components/WorldPortalScene';

const colors = { pink: '#ff168f', violet: '#9b72ff', blue: '#48a9ff' };

export default function Section() {
  const { id } = useParams();
  const w = worlds.find(x => x.id === id);
  if (!w) return <main className="subpage section"><h1>PORTAL NOT FOUND.</h1><Link to="/">Return home</Link></main>;

  return (
    <main className="world-detail">
      <div className="world-detail-top">
        <Link className="back" to="/">← BACK TO THE UNIVERSE</Link>
        <small className="mono pink">[ PORTAL {w.n} — {w.cat} ]</small>
        <h1>{w.title}<span className="pink">.</span></h1>
        <p className="sub-desc">{w.desc}</p>
      </div>
      <WorldPortalScene color={colors[w.tone] || colors.pink} />
      <div className="world-detail-bottom">
        <small className="mono pink">WORLD {w.n} / LIVE ENVIRONMENT</small>
        <h2>YOU'VE ENTERED<br/><em>ANOTHER DIMENSION.</em></h2>
        <p>This portal is now an interactive 3D space. Explore the universe and move between its connected worlds.</p>
        <Link className="primary" to="/explore">DISCOVER MORE PORTALS ↗</Link>
      </div>
    </main>
  );
}
