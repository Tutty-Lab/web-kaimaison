import { useEffect, useMemo, useState } from "react";
import {
  contact,
  galleryImages,
  images,
  links,
  menuSections,
  navItems,
  posts,
} from "./data.js";

const pageTitle = {
  "/en/menu": "Menus",
  "/en/about": "About",
  "/en/press": "Press",
  "/en/events": "Events",
  "/en/functions": "Functions",
  "/en/giftcards": "Gift Cards",
  "/en/contact": "Contact",
};

const appBase = import.meta.env.BASE_URL || "/";

function stripBase(path) {
  const base = appBase.endsWith("/") ? appBase.slice(0, -1) : appBase;

  if (base && base !== "/" && path === base) return "/";
  if (base && base !== "/" && path.startsWith(`${base}/`)) return path.slice(base.length);

  return path;
}

function normalizePath(path) {
  path = stripBase(path);
  if (path === "/" || path === "/en" || path === "/de") return "/en";
  if (path.startsWith("/de/")) return `/en/${path.slice(4)}`;
  if (path === "/en/gift-cards") return "/en/giftcards";
  return path.replace(/\/$/, "");
}

function publicHref(href) {
  if (!href.startsWith("/")) return href;
  const path = normalizePath(href).replace(/^\//, "");
  return `${appBase}${path}`;
}

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title = path === "/en" ? "Kai Maison" : `${pageTitle[path] || "Kai Maison"} | Kai Maison`;
  }, [path]);

  const navigate = (href) => {
    const nextPath = normalizePath(href);
    window.history.pushState({}, "", publicHref(nextPath));
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const page = useMemo(() => {
    switch (path) {
      case "/en":
        return <HomePage />;
      case "/en/menu":
        return <MenuPage />;
      case "/en/about":
        return <AboutPage />;
      case "/en/press":
        return <PostListPage title="In the Press" items={posts.press} image={images.mirror} />;
      case "/en/events":
        return <PostListPage title="News/Events" items={posts.events} image={images.flowers} />;
      case "/en/functions":
        return <FunctionsPage />;
      case "/en/giftcards":
        return <GiftCardsPage />;
      case "/en/contact":
        return <ContactPage />;
      case "/en/press/michelin-guide-vietnam":
        return <PostDetailPage post={posts.press[0]} relatedLabel="Press" image={images.mantel} />;
      case "/en/events/michelin-guide-vietnam":
        return <PostDetailPage post={posts.events[0]} relatedLabel="Events" image={images.flowers} />;
      default:
        return <NotFoundPage />;
    }
  }, [path]);

  return (
    <>
      <Header currentPath={path} onNavigate={navigate} />
      <main>{page}</main>
      <Footer onNavigate={navigate} />
    </>
  );
}

function Header({ currentPath, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("body-locked", mobileOpen);
    return () => document.body.classList.remove("body-locked");
  }, [mobileOpen]);

  const handleNav = (event, href) => {
    if (href.startsWith("/")) {
      event.preventDefault();
      setMobileOpen(false);
      onNavigate(href);
    }
  };

  return (
    <header className="site-header">
      <div className="desktop-header" aria-label="Main navigation">
        <a className="logo-link" href={publicHref("/en")} onClick={(event) => handleNav(event, "/en")}>
          <img src={images.logo} alt="Kai Maison" />
        </a>
        <nav className="nav-header">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={publicHref(item.href)}
              className={currentPath === item.href ? "active" : ""}
              onClick={(event) => handleNav(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="btn-header" href={links.reservation} target="_blank" rel="noreferrer">
            Reservations
          </a>
        </div>
      </div>

      <div className="mobile-header">
        <a className="mobile-logo" href={publicHref("/en")} onClick={(event) => handleNav(event, "/en")}>
          <img src={images.logo} alt="Kai Maison" />
        </a>
        <button
          className="mobile-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span aria-hidden="true">{mobileOpen ? "X" : "Menu"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-panel" id="mobile-menu">
          <nav aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a key={item.href} href={publicHref(item.href)} onClick={(event) => handleNav(event, item.href)}>
                {item.label}
              </a>
            ))}
            <a href={links.reservation} target="_blank" rel="noreferrer">
              Reservations
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-label="Kai Maison Berlin">
      <img src={images.hero} alt="Kai Maison entrance arch" />
      <div className="hero-copy">
        <img src={images.logo} alt="" aria-hidden="true" />
        <p>Kai Maison</p>
        <h1>Welcome to KAI MAISON</h1>
        <a href={links.map} target="_blank" rel="noreferrer">
          Maybachufer 23, 12047 Berlin
        </a>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <IntroSection />
      <FeatureSection
        title="Sharing plates"
        body="Our menu reflects our team's appreciation for global flavors and the warmth of a shared meal. The kitchen works with seasonal produce, careful technique, and the easy rhythm of dishes made to move around the table."
        image={images.dining}
        imageAlt="Kai Maison dining room"
        kicker="Opening hours"
        meta={contact.kitchen}
        ctas={[
          { label: "See Our Food Menu", href: links.menuPdf, external: true },
          { label: "See Our Drinks Menu", href: links.menuPdf, external: true },
        ]}
      />
      <FeatureSection
        title="Natural wines"
        body="The wine program celebrates grapes, styles, and countries from producers who put love into their practice. Most importantly, drinking wine here should feel easygoing, generous, and fun."
        image={images.bar}
        imageAlt="Kai Maison tables near the bar"
        reverse
        ctas={[{ label: "See Our Wine Menu", href: links.menuPdf, external: true }]}
      />
      <HomePosts />
      <Gallery />
    </>
  );
}

function IntroSection() {
  return (
    <section className="section intro-section">
      <div className="section-copy">
        <p className="eyebrow">Kai Maison</p>
        <h2>French-Vietnamese inspired cuisine in Berlin</h2>
        <p>
          Walking the line between fun and technique, the team brings together seasonal plates,
          precise cooking, and the kind of room where conversation carries the service.
        </p>
        <div className="info-stack">
          <div>
            <span>Opening hours</span>
            <strong>{contact.hours}</strong>
          </div>
          <div>
            <span>Address</span>
            <a href={links.map} target="_blank" rel="noreferrer">
              {contact.addressLine1}, {contact.addressLine2}
            </a>
          </div>
          <div>
            <span>Contact</span>
            <a href={links.email}>{contact.email}</a>
            <a href={links.phone}>{contact.phone}</a>
          </div>
        </div>
        <a className="button-reservierung" href={links.reservation} target="_blank" rel="noreferrer">
          Make a Reservation
        </a>
      </div>
      <div className="intro-images" aria-label="Kai Maison interiors">
        <img src={images.neon} alt="Neon sign inside Kai Maison" />
        <img src={images.round} alt="Round table and chairs at Kai Maison" />
      </div>
    </section>
  );
}

function FeatureSection({ title, body, image, imageAlt, kicker, meta, ctas, reverse = false }) {
  return (
    <section className={`feature-section${reverse ? " feature-reverse" : ""}`}>
      <div className="feature-image">
        <img src={image} alt={imageAlt} />
      </div>
      <div className="feature-copy">
        <h2>{title}</h2>
        <p>{body}</p>
        {kicker && (
          <div className="hours-note">
            <span>{kicker}</span>
            <strong>{meta}</strong>
          </div>
        )}
        <div className="button-row">
          {ctas.map((cta) => (
            <a
              key={cta.label}
              className="button-reservierung"
              href={cta.href}
              target={cta.external ? "_blank" : undefined}
              rel={cta.external ? "noreferrer" : undefined}
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePosts() {
  return (
    <section className="home-posts">
      <PostPreview title="In the Press" items={posts.press} />
      <PostPreview title="News/Events" items={posts.events} />
    </section>
  );
}

function PostPreview({ title, items }) {
  return (
    <div className="post-preview">
      <h2>{title}</h2>
      {items.map((item) => (
        <PostCard key={item.title} item={item} />
      ))}
    </div>
  );
}

function PostCard({ item }) {
  return (
    <a className="post-card" href={publicHref(item.href)}>
      <img src={item.image} alt="" />
      <div>
        <p>{item.date}</p>
        <h3>{item.title}</h3>
        <span>{item.summary}</span>
      </div>
    </a>
  );
}

function Gallery() {
  return (
    <section className="gallery" aria-label="Kai Maison gallery">
      <div className="gallery-marquee" aria-hidden="true">
        <span>Kai Maison - Table et Bar - Berlin -</span>
        <span>Kai Maison - Table et Bar - Berlin -</span>
      </div>
      <div className="gallery-grid">
        {galleryImages.map((image) => (
          <img key={image.src} src={image.src} alt={image.alt} />
        ))}
      </div>
    </section>
  );
}

function PageHero({ title, body, image, cta }) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">Kai Maison</p>
        <h1>{title}</h1>
        {body && <p>{body}</p>}
        {cta && (
          <a className="button-reservierung" href={cta.href} target={cta.external ? "_blank" : undefined} rel="noreferrer">
            {cta.label}
          </a>
        )}
      </div>
      <img src={image} alt="" />
    </section>
  );
}

function MenuPage() {
  return (
    <>
      <PageHero
        title="Our Menu"
        body="Seasonal plates, shared formats, cocktails, and wines curated for a room that likes to eat together."
        image={images.prep}
        cta={{ label: "Download Menu", href: links.menuPdf, external: true }}
      />
      <section className="menu-page">
        <div className="menu-buttons">
          <a className="button-reservierung" href={links.menuPdf} target="_blank" rel="noreferrer">
            Food Menu
          </a>
          <a className="button-reservierung" href={links.menuPdf} target="_blank" rel="noreferrer">
            Drinks Menu
          </a>
        </div>
        <div className="menu-sections">
          {menuSections.map((section) => (
            <section className="menu-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.groups.map((group, index) => (
                <div className="menu-group" key={`${section.title}-${index}`}>
                  {group.title && <h3>{group.title}</h3>}
                  {group.items.map(([name, price, description]) => (
                    <article className="menu-item" key={`${section.title}-${name}`}>
                      <div>
                        <h4>{name}</h4>
                        <p>{description}</p>
                      </div>
                      <strong>{price}</strong>
                    </article>
                  ))}
                </div>
              ))}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        title="About Kai Maison"
        body="A small Berlin room built around shared plates, natural wine, and a French-Vietnamese point of view."
        image={images.corner}
      />
      <section className="section split-story">
        <img src={images.mantel} alt="A set table inside Kai Maison" />
        <div>
          <h2>Our Menu</h2>
          <p>
            The restaurant brings together polished technique and a relaxed room. Dishes are made
            to be passed, tasted, compared, and returned to as the table fills.
          </p>
          <p>
            The drinks list follows the same feeling: a compact mix of cocktails, classics, and
            natural wines that stay close to the food.
          </p>
          <a className="button-reservierung" href={publicHref("/en/menu")}>
            See Our Menu
          </a>
        </div>
      </section>
      <Gallery />
    </>
  );
}

function PostListPage({ title, items, image }) {
  return (
    <>
      <PageHero title={title} body="Stories, announcements, and moments from the Kai Maison table." image={image} />
      <section className="post-list">
        {items.map((item) => (
          <PostCard key={item.title} item={item} />
        ))}
      </section>
    </>
  );
}

function PostDetailPage({ post, relatedLabel, image }) {
  return (
    <article className="post-detail">
      <img className="post-detail-image" src={image} alt="" />
      <div className="post-detail-copy">
        <p className="eyebrow">{relatedLabel}</p>
        <h1>{post.title}</h1>
        <time>{post.date}</time>
        <p>{post.summary}</p>
        <p>
          Kai Maison carries this moment into the restaurant through a warm room, a focused menu,
          and the feeling that dinner should be generous without becoming formal.
        </p>
        <a className="button-reservierung" href={publicHref(relatedLabel === "Press" ? "/en/press" : "/en/events")}>
          Back to {relatedLabel}
        </a>
      </div>
    </article>
  );
}

function FunctionsPage() {
  return (
    <>
      <PageHero
        title="Functions and catering"
        body="Private tables, group dinners, and tailored menus for gatherings that want the Kai Maison mood outside the everyday service."
        image={images.banquette}
        cta={{ label: "Contact Us", href: links.email, external: true }}
      />
      <section className="section split-story">
        <div>
          <h2>For the whole table</h2>
          <p>
            The team can shape set menus, drinks pairings, and a service rhythm around your group.
            The style remains the same: polished, relaxed, and made for sharing.
          </p>
          <a className="button-reservierung" href={links.email}>
            Enquire Now
          </a>
        </div>
        <img src={images.dining} alt="Dining room prepared for a group" />
      </section>
    </>
  );
}

function GiftCardsPage() {
  return (
    <>
      <PageHero
        title="Gift cards"
        body="A Kai Maison evening for someone else: food, wine, and time around the table."
        image={images.garden}
        cta={{ label: "Email Us", href: links.email, external: true }}
      />
      <section className="section centered-copy">
        <h2>A table-ready gift</h2>
        <p>
          Gift cards can be arranged directly with the restaurant. Send a note with the value,
          recipient name, and preferred pickup or delivery details.
        </p>
        <a className="button-reservierung" href={links.email}>
          Request a Gift Card
        </a>
      </section>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero title="Contact us" body="Come by the canal, book a table, or send the team a note." image={images.outdoor} />
      <section className="contact-grid">
        <div className="contact-panel">
          <h2>Kai Maison</h2>
          <a href={links.map} target="_blank" rel="noreferrer">
            {contact.addressLine1}, {contact.addressLine2}
          </a>
          <a href={links.email}>{contact.email}</a>
          <a href={links.phone}>{contact.phone}</a>
          <strong>{contact.hours}</strong>
          <a className="button-reservierung" href={links.reservation} target="_blank" rel="noreferrer">
            Reservations
          </a>
        </div>
        <img src={images.window} alt="Window table inside Kai Maison" />
      </section>
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="section centered-copy">
      <h1>Page not found</h1>
      <p>The local clone does not include this route yet.</p>
      <a className="button-reservierung" href={publicHref("/en")}>
        Back Home
      </a>
    </section>
  );
}

function Footer({ onNavigate }) {
  const handleNav = (event, href) => {
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <a className="footer-logo" href={publicHref("/en")} onClick={(event) => handleNav(event, "/en")}>
          <img src={images.logo} alt="Kai Maison" />
        </a>
        <div className="footer-contact" aria-label="Kai Maison contact details">
          <a href={links.map} target="_blank" rel="noreferrer">
            {contact.addressLine1}, {contact.addressLine2}
          </a>
          <span>{contact.hours}</span>
          <a href={links.phone}>{contact.phone}</a>
          <a href={links.email}>{contact.email}</a>
          <a href={links.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
        <a className="footer-reserve" href={links.reservation} target="_blank" rel="noreferrer">
          Reservations
        </a>
      </div>
      <div className="footer-credit" aria-label="Coded by TUTTYLAB">
        <span>Coded by</span>
        <a href={links.credit} target="_blank" rel="noreferrer">
          TUTTYLAB
        </a>
      </div>
    </footer>
  );
}

export default App;
