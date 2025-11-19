import React, { useState, useEffect } from 'react';
import './App.css';
import logoSvg from './logo.svg';

// API base (can be overridden with REACT_APP_API_URL in .env)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Navigation anchors used by the sticky navbar.
const navLinks = [
    { label: 'Home', target: 'home' },
    { label: 'Chi siamo', target: 'chi-siamo' },
    { label: 'Attività', target: 'attivita' },
    { label: 'Eventi', target: 'eventi' },
    { label: 'Contatti', target: 'contatti' },
    { label: 'Supportaci', target: 'supportaci' },
    { label: 'Login', target: 'login' },
];

// Highlighted initiatives and labs the student association curates.
const initiatives = [
  {
    title: 'Mentorship & tutoring',
    description:
      'Affianchiamo matricole e studenti Erasmus con tutor dedicati per orientamento, esami chiave e pratiche universitarie.',
  },
  {
    title: 'Laboratori tematici',
    description:
      'Dal coding competitivo alla robotica: cicli di workshop guidati da team misti studenti-industria.',
  },
  {
    title: 'Career bridge',
    description:
      'Visite in azienda, mock interview e revisione CV con professionisti partner di Trieste e dintorni.',
  },
];

const events = [
  {
    title: 'Trieste Tech Walk',
    date: '12 dicembre',
    description: 'Passeggiata guidata nei principali poli di ricerca con racconti dei ricercatori εστ.',
  },
  {
    title: 'Hardware Hacknight',
    date: '20 gennaio',
    description: 'Notte di prototipazione rapida con kit open-source e mentorship senior.',
  },
  {
    title: 'Open Lab Day',
    date: '5 marzo',
    description: 'Open day dei laboratori εστ per conoscere team, progetti e iscrizioni.',
  },
];

const supportActions = [
  {
    title: 'Diventa mentor',
    body: 'Dedicando 2 ore al mese accompagni studenti del primo anno nelle scelte accademiche.',
  },
  {
    title: 'Sponsorizza un evento',
    body: 'Aiuta a coprire logistica e materiali dei prossimi workshop con una donazione mirata.',
  },
  {
    title: 'Fai passaparola',
    body: 'Invita nuovi studenti o alumni nella community e diffondi i nostri canali.',
  },
];

const Section = ({ id, title, kicker, variant = 'light', children }) => (
  <section id={id} className={`section section-${variant}`}>
    <div className="section-content">
      {kicker && <p className="section-kicker">{kicker}</p>}
      <h2>{title}</h2>
      {children}
    </div>
  </section>
);

function App() {
  const currentYear = new Date().getFullYear();

  // Member auth (token-based when backend available)
  const [member, setMember] = useState(null);
  const [token, setToken] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    // Try to restore token and member from localStorage
    const storedToken = localStorage.getItem('est_token');
    const storedMember = localStorage.getItem('est_member');
    if (storedToken) {
      setToken(storedToken);
      // verify token with backend
      (async () => {
        setLoadingAuth(true);
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setMember(data.user);
            localStorage.setItem('est_member', JSON.stringify(data.user));
          } else {
            // token invalid or server unreachable: fallback to stored member if present
            if (storedMember) setMember(JSON.parse(storedMember));
            else {
              localStorage.removeItem('est_token');
              setToken(null);
            }
          }
        } catch (err) {
          // network error: fallback to stored member (if any)
          if (storedMember) setMember(JSON.parse(storedMember));
        } finally {
          setLoadingAuth(false);
        }
      })();
    } else if (storedMember) {
      // no token but stored member => keep demo session
      try {
        setMember(JSON.parse(storedMember));
      } catch (e) { /* ignore */ }
    }
  }, []);

  const handleLogin = async () => {
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Inserisci email e password');
      return;
    }

    // Try backend login first
    try {
      setLoadingAuth(true);
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setMember(data.user);
        localStorage.setItem('est_token', data.token);
        localStorage.setItem('est_member', JSON.stringify(data.user));
        setLoginEmail('');
        setLoginPassword('');
        return;
      }
      // non-ok: show error from server
      const err = await res.json().catch(() => ({}));
      setLoginError(err.message || 'Autenticazione fallita');
    } catch (err) {
      // Network or backend down -> fallback to demo client-side auth
      console.warn('Backend auth failed, falling back to demo mode', err);
      const m = { email: loginEmail, name: loginEmail.split('@')[0] };
      setMember(m);
      localStorage.setItem('est_member', JSON.stringify(m));
      setLoginEmail('');
      setLoginPassword('');
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setMember(null);
    setToken(null);
    localStorage.removeItem('est_member');
    localStorage.removeItem('est_token');
  };

  return (
    <div className="site-root">
      <nav className="site-nav">
        <a className="brand" href="#home">
            <img src={logoSvg} alt="εστ logo" className="brand-logo" width="298px" height="82px" />
        </a>
        <div className="nav-links">
          {navLinks.map(({ label, target }) => (
            <a key={target} href={`#${target}`}>
              {label}
            </a>
          ))}
        </div>
      </nav>

      <header id="home" className="hero">
        <div className="hero-content">
          <p className="hero-kicker">Community degli studenti di ingegneria di Trieste</p>
          <h1>
            <img src={logoSvg} alt="εστ - Engineering Students of Trieste" className="hero-logo" />
          </h1>
          <p className="hero-text">
            Costruiamo relazioni tra studenti, ricercatori e aziende per rendere l&apos;università più aperta, inclusiva e orientata al fare.
          </p>
          <div className="hero-ctas">
            <a className="btn primary" href="#chi-siamo">
              Scopri chi siamo
            </a>
            <a className="btn ghost" href="#contatti">
              Contattaci
            </a>
          </div>
        </div>
        <div className="hero-card">
          <p className="hero-card-kicker">Prossimo highlight</p>
          <h3>Open Lab Day · 5 marzo</h3>
          <p>
            Demo di progetti, tour guidati e iscrizioni ai nuovi focus group hardware, energia e AI.
          </p>
          <a className="btn secondary" href="#eventi">
            Vai agli eventi
          </a>
        </div>
      </header>

      <main>
        <Section id="chi-siamo" kicker="Missione" title="Chi siamo">
          <p>
            εστ è l&apos;associazione degli studenti di ingegneria di Trieste che promuove mentoring tra pari, divulgazione tecnica e collaborazione con il territorio.
            Operiamo in sinergia con i dipartimenti universitari e con una rete di ambassador nelle principali facoltà.
          </p>
          <ul className="bullet-grid">
            <li>Mentorship verticale per ogni indirizzo</li>
            <li>Community bilingue IT/EN</li>
            <li>Supporto Erasmus incoming/outgoing</li>
            <li>Accesso a laboratori e progetti condivisi</li>
          </ul>
        </Section>

        <Section id="attivita" kicker="Percorsi concreti" title="Cosa facciamo">
          <div className="card-grid">
            {initiatives.map(({ title, description }) => (
              <article key={title} className="card">
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="eventi" kicker="Calendario" title="Eventi in arrivo" variant="green">
          <div className="timeline">
            {events.map(({ title, date, description }) => (
              <article key={title} className="timeline-item">
                <div className="timeline-date">{date}</div>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="contatti" kicker="Parliamone" title="Contatti">
          <div className="contact-panel">
            <div>
              <p>
                Vuoi proporre un laboratorio, ricevere supporto per gli esami o collaborare come azienda partner? Scrivici e ti risponderemo entro 48 ore.
              </p>
              <dl>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:engineeringstudentstrieste@gmail.com">engineeringstudentstrieste@gmail.com</a>
                </dd>
                <dt>Instagram</dt>
                <dd>
                  <a href="https://instagram.com/engineeringstudentstrieste" target="_blank" rel="noreferrer">
                    @engineeringstudentstrieste
                  </a>
                </dd>
                <dt>Telegram</dt>
                <dd>
                  <a href="https://t.me/est-community" target="_blank" rel="noreferrer">
                    t.me/est-community
                  </a>
                </dd>
              </dl>
            </div>
            <form className="contact-form">
              <label>
                Nome
                <input type="text" placeholder="Il tuo nome" />
              </label>
              <label>
                Email
                <input type="email" placeholder="La tua e-mail" />
              </label>
              <label>
                Messaggio
                <textarea rows="4" placeholder="Raccontaci come possiamo aiutarti" />
              </label>
              <button type="button" className="btn primary full">
                Invia (coming soon)
              </button>
            </form>
          </div>
        </Section>

        <Section id="supportaci" kicker="Come contribuire" title="Supportaci" variant="accent">
          <div className="support-grid">
            {supportActions.map(({ title, body }) => (
              <article key={title} className="support-card">
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <p className="center-text">
            Scrivici a <a href="mailto:engineeringstudentstrieste@gmail.com">engineeringstudentstrieste@gmail.com</a> per ricevere il media kit completo.
          </p>
        </Section>

        {/* LOGIN SECTION */}
        <Section id="login" kicker="Area soci" title="Login soci">
          {/* if not logged in show form, else show member area */}
          {!member ? (
            <div className="contact-form">
              {loginError && <div style={{ color: 'crimson' }}>{loginError}</div>}
              <label>
                Email
                <input
                  type="email"
                  placeholder="email@esempio.it"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn primary" onClick={handleLogin}>
                  Accedi
                </button>
                <button type="button" className="btn ghost" onClick={() => { setLoginEmail(''); setLoginPassword(''); setLoginError(''); }}>
                  Reset
                </button>
              </div>
              <p style={{ marginTop: '0.75rem', color: '#6b7280' }}>
                Nota: questa è una demo client-side. Per l'autenticazione reale serve un backend sicuro.
              </p>
            </div>
          ) : (
            <div className="card">
              <h3>Benvenuto, {member.name}</h3>
              <p>Area riservata ai soci: qui puoi trovare risorse, bacheca e iscrizioni.</p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button className="btn secondary" onClick={() => alert('Sezione membri (demo)')}>
                  Bacheca soci
                </button>
                <button className="btn ghost" onClick={handleLogout}>
                  Esci
                </button>
              </div>
            </div>
          )}
        </Section>

      </main>

      <footer className="site-footer">
        <p>© {currentYear} εστ - Engineering Students of Trieste · Trieste</p>
        <div className="footer-links">
          <a href="https://drive.google.com/file/d/1HpSKM8S9NzN2G14KpAb6P4QshLbeMI-F/view?usp=sharing">Manifesto</a>
          <a href="#eventi">Calendario</a>
          <a href="#contatti">Unisciti a noi</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
