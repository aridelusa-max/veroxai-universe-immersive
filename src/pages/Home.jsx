import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Orbit } from 'lucide-react';
import gsap from 'gsap';
import { worlds, people } from '../data/worlds';
import WorldCard from '../components/WorldCard';
import UniverseCanvas from '../components/UniverseCanvas';
import UniverseJourney from '../components/UniverseJourney';

export default function Home() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal', {
        y: 28,
        opacity: 0,
        duration: 1,
        stagger: 0.13,
        ease: 'power3.out'
      });
      gsap.to('.hero-art', {
        y: -12,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      gsap.to('.hero-art', {
        rotate: 2,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="grid-bg" />

        <div className="hero-copy">
          <small className="mono reveal"><i className="dot" /> AN OPEN UNIVERSE OF IDEAS</small>
          <h1>
            <span className="reveal">THINK</span>
            <span className="outline reveal">BEYOND<span className="pink">.</span></span>
            <span className="reveal">THE OBVIOUS.</span>
          </h1>
          <p className="reveal">
            A living collection of extraordinary minds, mathematical wonders,
            business ideas and creative discoveries.
          </p>
          <div className="actions reveal">
            <Link className="primary" to="/explore">
              ENTER THE UNIVERSE <ArrowUpRight size={16} />
            </Link>
            <a href="#worlds">DISCOVER THE WORLDS <ArrowDown size={15} /></a>
          </div>
        </div>

        <div className="hero-art">
          <small className="mono">FIG. 001 — THE CURIOSITY ENGINE</small>
          <UniverseCanvas />
          <small className="mono coord">21° / 07° / ∞</small>
        </div>

        <div className="hero-foot mono">
          <span>INDEPENDENT KNOWLEDGE PROJECT</span>
          <span>SCROLL TO EXPLORE ↓</span>
          <span>EST. MMXXVI</span>
        </div>
      </section>

      <UniverseJourney />

      <section className="intro section">
        <small className="mono pink">[ 00 — THE IDEA ]</small>
        <div className="intro-grid">
          <h2>THE WORLD IS<br />MORE <em>CONNECTED</em><br />THAN IT SEEMS.</h2>
          <p><i />Mathematics shapes architecture. Ideas build companies. Curiosity connects people across centuries. Explore the links between them.</p>
        </div>
        <div className="stats">
          <div><b>∞</b><small className="mono">QUESTIONS TO EXPLORE</small></div>
          <div><b>06</b><small className="mono">WORLDS TO DISCOVER</small></div>
          <div><b>01</b><small className="mono">CURIOUS MIND REQUIRED</small></div>
        </div>
      </section>

      <section className="worlds section" id="worlds">
        <div className="section-head">
          <div><small className="mono pink">[ 01 — CHOOSE YOUR PORTAL ]</small><h2>EXPLORE THE <em>WORLDS.</em></h2></div>
          <p>Six entry points.<br />Infinite directions.</p>
        </div>
        <div className="world-grid">
          {worlds.map(world => <WorldCard key={world.id} w={world} />)}
        </div>
      </section>

      <section className="people section">
        <div className="section-head">
          <div><small className="mono pink">[ 02 — THE HUMAN ARCHIVE ]</small><h2>MINDS THAT<br /><em>MOVE US.</em></h2></div>
          <Link to="/minds" className="more">EXPLORE ALL MINDS ↗</Link>
        </div>
        <div className="people-grid">
          {people.map((person, index) => (
            <Link to="/minds" className="person" key={person.name}>
              <div className="portrait">
                <img src={person.img} alt="Editorial portrait placeholder" loading="lazy" />
                <span className="mono">0{index + 1}</span>
                <b>↗</b>
              </div>
              <small className="mono pink">{person.field}</small>
              <h3>{person.name}</h3>
              <p>{person.desc}</p>
              <small className="mono">{person.years}</small>
            </Link>
          ))}
        </div>
        <small className="mono note">PLACEHOLDER IMAGERY — REPLACE WITH VERIFIED, LICENSED PORTRAITS BEFORE PUBLICATION.</small>
      </section>

      <section className="manifesto">
        <div className="grid-bg" />
        <div>
          <small className="mono">[ A NOTE TO THE CURIOUS ]</small>
          <Orbit />
          <h2>DON'T JUST<br />COLLECT <em>ANSWERS.</em><br />FOLLOW QUESTIONS.</h2>
          <Link className="dark-button" to="/explore">START EXPLORING ↗</Link>
        </div>
      </section>

      <footer className="footer section">
        <div>
          <Link to="/" className="brand"><b>V<span>.</span></b><strong>VEROXAI <i>UNIVERSE</i></strong></Link>
          <p>An independent universe for curious minds.</p>
        </div>
        <Link to="/explore" className="more">ENTER THE UNIVERSE ↗</Link>
        <small className="mono">© 2026 VEROXAI UNIVERSE <span>BUILT FOR CURIOSITY.</span></small>
      </footer>
    </main>
  );
}
