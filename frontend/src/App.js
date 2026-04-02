import React, {useState, useEffect} from 'react';
import './App.css';
import logoSvg from './logo.svg';
import eventPhotoMarch from './Pictures/20260311_184156.jpg';
import eventPhoto8644 from './Pictures/IMG_8644.JPG';
import eventPhoto8654 from './Pictures/IMG_8654.JPG';
import eventPhoto8687 from './Pictures/IMG_8687.jpg';
import CookieBanner from './components/CookieBanner';
import {CONSENT_KEY, disableAnalytics, enableAnalytics} from './lib/analytics';

// Navigation anchors used by the sticky navbar.
const navLinks = [
    {label: 'Home', target: 'home'},
    {label: 'Chi siamo', target: 'chi-siamo'},
    {label: 'Merch', target: 'merch'},
    {label: 'Eventi', target: 'eventi'},
    {label: 'Contatti', target: 'contatti'},
    {label: 'Supportaci', target: 'supportaci'},
];

// Highlighted initiatives and labs the student association curates.
const initiatives = [
    {
        title: 'Networking e mentoring',
        description:
            'Colleghiamo studenti di tutti gli anni e indirizzi per condividere appunti, consigli e opportunità anche con alumni ed ex studenti.',
    },
    {
        title: 'Career bridge',
        description:
            'Organizziamo visite guidate presso aziende e centri di ricerca per scoprire il mondo del lavoro e le opportunità locali.',
    },
    {
        title: 'Seminari e workshop',
        description:
            'Conferenze e laboratori pratici su temi tecnici e trasversali, tenuti da studenti, ricercatori e professionisti del settore.',
    },
];

const events = [
    {
        title: 'Assemblea dei Soci',
        date: '31 marzo 2026',
        description: 'Assemblea periodica dei soci εστ seguita da aperitivo aperto ai soci.',
    },
    {
        title: 'Conferenza',
        date: 'date to be announced',
        description: 'Stay tuned',
    },
    {
        title: 'Aperitivo',
        date: 'date to be announced',
        description: 'Stay tuned',
    },
];

const supportActions = [
    {
        title: 'Diventa socio',
        body: 'Partecipa attivamente alle nostre iniziative iscrivendoti come socio annuale.',
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

const eventPhotos = [
    {
        src: eventPhotoMarch,
        alt: 'Partecipanti durante uno degli ultimi eventi di epsilon sigma tau a Trieste.',
        caption: '"Dalla Terra alle Stelle" - Marzo 2026',
    },
    {
        src: eventPhoto8644,
        alt: 'Studenti durante un momento di networking dell associazione epsilon sigma tau.',
        caption: '"Dalla Terra alle Stelle" - Marzo 2026',
    },
    {
        src: eventPhoto8654,
        alt: 'Gruppo di soci epsilon sigma tau durante un attivita conviviale.',
        caption: '"Dalla Terra alle Stelle" - Marzo 2026',
    },
    {
        src: eventPhoto8687,
        alt: 'Foto dell evento epsilon sigma tau con partecipanti e staff.',
        caption: '"Dalla Terra alle Stelle" - Marzo 2026',
    },
];

const Section = ({id, title, kicker, variant = 'light', children}) => (
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

    const [cookieConsent, setCookieConsent] = useState(null);
    const [openPreferences, setOpenPreferences] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);

    useEffect(() => {
        const savedConsent = localStorage.getItem(CONSENT_KEY);
        if (savedConsent === 'accepted') {
            setCookieConsent('accepted');
            enableAnalytics();
            return;
        }

        if (savedConsent === 'rejected') {
            setCookieConsent('rejected');
            disableAnalytics();
            return;
        }

        setCookieConsent(null);
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setCookieConsent('accepted');
        setOpenPreferences(false);
        enableAnalytics();
    };

    const handleRejectCookies = () => {
        localStorage.setItem(CONSENT_KEY, 'rejected');
        setCookieConsent('rejected');
        setOpenPreferences(false);
        disableAnalytics();
    };

    const showCookieBanner = cookieConsent === null || openPreferences;
    const totalSlides = eventPhotos.length;
    const activePhoto = eventPhotos[currentSlide] || eventPhotos[0];

    useEffect(() => {
        if (totalSlides < 2 || isCarouselPaused) {
            return undefined;
        }

        const intervalId = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [totalSlides, isCarouselPaused]);

    const goToSlide = (index) => {
        if (totalSlides < 2) return;
        const normalizedIndex = (index + totalSlides) % totalSlides;
        setCurrentSlide(normalizedIndex);
    };

    const handleCarouselKeyDown = (event) => {
        if (event.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1);
        }
        if (event.key === 'ArrowRight') {
            goToSlide(currentSlide + 1);
        }
    };

    return (
        <div className="site-root">
            <nav className="site-nav">
                <a className="brand" href="#home">
                    <img src={logoSvg} alt="εστ logo" className="brand-logo" width="298px" height="82px"/>
                </a>
                <div className="nav-links">
                    {navLinks.map(({label, target}) => (
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
                        <img src={logoSvg} alt="εστ - Engineering Students of Trieste" className="hero-logo"/>
                    </h1>
                    <p className="hero-text">
                        Costruiamo relazioni tra studenti, ricercatori e aziende per rendere l&apos;università più
                        aperta, inclusiva e orientata al fare.
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
                    <h3>Assemblea dei Soci · 31 marzo</h3>
                    <p>
                        Unisciti a noi per l&apos;assemblea periodica dei soci εστ, seguita da un aperitivo aperto a
                        tutti i membri.
                    </p>
                    <a className="btn secondary" href="#eventi">
                        Vai agli eventi
                    </a>
                </div>
            </header>

            <main>
                <Section id="chi-siamo" kicker="Missione" title="Chi siamo">
                    <p>
                        εστ è l&apos;associazione degli studenti di ingegneria di Trieste che promuove mentoring tra
                        pari, divulgazione tecnica e collaborazione con il territorio.
                        Operiamo in sinergia con i dipartimenti universitari e con una rete di ambassador nelle
                        principali facoltà.
                    </p>

                    <div className="card-grid">
                        {initiatives.map(({title, description}) => (
                            <article key={title} className="card">
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        ))}
                    </div>
                </Section>

                <Section id="merch" kicker="La classe non è acqua" title="Merch">
                    <p>
                        Scopri la nostra linea di merchandising ufficiale: magliette, felpe e gadget per mostrare con
                        orgoglio il tuo spirito εστ.
                    </p>
                    <h3>To be announced</h3>

                </Section>

                <Section id="eventi" kicker="Calendario" title="Eventi in arrivo" variant="green">
                    <div className="timeline">
                        {events.map(({title, date, description}) => (
                            <article key={title} className="timeline-item">
                                <div className="timeline-date">{date}</div>
                                <div>
                                    <h3>{title}</h3>
                                    <p>{description}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    {activePhoto ? (
                        <div
                            className="events-carousel"
                            role="region"
                            tabIndex={0}
                            aria-label="Foto degli ultimi eventi"
                            onKeyDown={handleCarouselKeyDown}
                        >
                            <div className="events-carousel-frame">
                                <img src={activePhoto.src} alt={activePhoto.alt} className="events-carousel-image"/>
                                <div className="events-carousel-overlay">
                                    <p className="events-carousel-caption">{activePhoto.caption}</p>
                                </div>

                                {totalSlides > 1 ? (
                                    <div className="events-carousel-controls-overlay" aria-hidden="false">
                                        <button
                                            type="button"
                                            className="events-carousel-btn events-carousel-btn-arrow"
                                            onClick={() => goToSlide(currentSlide - 1)}
                                            aria-label="Foto precedente"
                                        >
                                            &lt;
                                        </button>
                                        <button
                                            type="button"
                                            className="events-carousel-btn events-carousel-btn-arrow"
                                            onClick={() => goToSlide(currentSlide + 1)}
                                            aria-label="Foto successiva"
                                        >
                                            &gt;
                                        </button>
                                        <button
                                            type="button"
                                            className="events-carousel-btn events-carousel-btn-toggle"
                                            onClick={() => setIsCarouselPaused((prev) => !prev)}
                                            aria-label={isCarouselPaused ? 'Riprendi autoplay' : 'Ferma autoplay'}
                                        >
                                            {isCarouselPaused ? 'Play' : 'Stop'}
                                        </button>
                                    </div>
                                ) : null}
                            </div>

                            {totalSlides > 1 ? (
                                <div className="events-carousel-dots" aria-label="Selezione foto evento">
                                    {eventPhotos.map((photo, index) => (
                                        <button
                                            key={photo.caption}
                                            type="button"
                                            className={`events-carousel-dot ${index === currentSlide ? 'is-active' : ''}`}
                                            onClick={() => goToSlide(index)}
                                            aria-label={`Vai alla foto ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </Section>

                <Section id="contatti" kicker="Parliamone" title="Contatti">
                    <div className="contact-panel">
                        <div>
                            <p>
                                Vuoi proporre un laboratorio, ricevere supporto per gli esami o collaborare come azienda
                                partner? Scrivici e ti risponderemo entro 48 ore.
                            </p>
                            <dl>
                                <dt>Email</dt>
                                <dd>
                                    <a href="mailto:engineeringstudentstrieste@gmail.com">engineeringstudentstrieste@gmail.com</a>
                                </dd>
                                <dt>Instagram</dt>
                                <dd>
                                    <a href="https://www.instagram.com/epsilonsigmatau/" target="_blank"
                                       rel="noreferrer">
                                        @epsilonsigmatau
                                    </a>
                                </dd>
                                <dt>Linkedin</dt>
                                <dd>
                                    <a href="https://www.linkedin.com/company/epsilonsigmatau/" target="_blank"
                                       rel="noreferrer">
                                        epsilonsigmatau
                                    </a>
                                </dd>
                            </dl>
                        </div>
                        <form className="contact-form">
                            <label>
                                Nome
                                <input type="text" placeholder="Il tuo nome"/>
                            </label>
                            <label>
                                E-mail
                                <input type="email" placeholder="La tua e-mail"/>
                            </label>
                            <label>
                                Messaggio
                                <textarea rows="4" placeholder="Raccontaci come possiamo aiutarti"/>
                            </label>
                            <button type="button" className="btn primary full">
                                Invia (coming soon)
                            </button>
                        </form>
                    </div>
                </Section>

                <Section id="supportaci" kicker="Come contribuire" title="Supportaci" variant="accent">
                    <div className="support-grid">
                        {supportActions.map(({title, body}) => (
                            <article key={title} className="support-card">
                                <h3>{title}</h3>
                                <p>{body}</p>
                            </article>
                        ))}
                    </div>
                    <p className="center-text">
                        Scrivici a <a
                        href="mailto:engineeringstudentstrieste@gmail.com">engineeringstudentstrieste@gmail.com</a> per
                        ricevere il media kit completo.
                    </p>
                </Section>

            </main>

            <footer className="site-footer">
                <p>© {currentYear} εστ - Engineering Students of Trieste · Trieste</p>
                <div className="footer-links">
                    <a href="https://drive.google.com/file/d/1L6zINUpXpdclNhO46JNOLs52hG3wWM8s/view?usp=sharing">Statuto</a>
                    <a href="https://drive.google.com/file/d/1HpSKM8S9NzN2G14KpAb6P4QshLbeMI-F/view?usp=sharing">Manifesto</a>
                    <a href="#eventi">Calendario</a>
                    <a href="#contatti">Unisciti a noi</a>
                    <button
                        type="button"
                        className="footer-consent-link"
                        onClick={() => setOpenPreferences(true)}
                    >
                        Preferenze cookie
                    </button>
                </div>
            </footer>

            {showCookieBanner ? (
                <CookieBanner
                    onAccept={handleAcceptCookies}
                    onReject={handleRejectCookies}
                    canDismiss={cookieConsent !== null}
                    onDismiss={() => setOpenPreferences(false)}
                />
            ) : null}
        </div>
    );
}

export default App;
