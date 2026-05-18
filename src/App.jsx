import { useEffect, useMemo, useState } from "react";
import { eventItems, foodMenuSections, images, navItems, pressItems, site, wineMenuSections } from "./data.js";
import { useOjigiMotion } from "./motion.js";

const appBase = import.meta.env.BASE_URL || "/";

function normalizePath(pathname) {
  const base = appBase.endsWith("/") ? appBase.slice(0, -1) : appBase;
  let path = pathname;

  if (base && base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }

  if (path === "/en" || path === "/en/") return "/";
  if (path === "/en/menu") return "/a-la-carte-menu";
  if (path === "/en/functions") return "/functions-catering";
  if (path === "/en/giftcards") return "/gift-cards";
  return path.replace(/\/$/, "") || "/";
}

function localHref(path) {
  if (!path.startsWith("/")) return path;
  const clean = normalizePath(path);
  const base = appBase.endsWith("/") ? appBase : `${appBase}/`;
  return `${base}${clean.replace(/^\//, "")}`;
}

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.title = site.title;
  }, []);

  useOjigiMotion(path);

  const navigate = (href) => {
    const next = normalizePath(href);
    window.history.pushState({}, "", localHref(next));
    setPath(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const page = useMemo(() => {
    switch (path) {
      case "/":
        return <HomePage onNavigate={navigate} />;
      case "/a-la-carte-menu":
        return <MenuPage />;
      case "/about":
        return <AboutPage onNavigate={navigate} />;
      case "/press":
        return <ListPage items={pressItems} title="Press" />;
      case "/events":
        return <ListPage items={eventItems} title="Events" showOlder />;
      case "/functions-catering":
        return <FunctionsPage />;
      case "/gift-cards":
        return <GiftCardsPage />;
      case "/contact":
        return <ContactPage />;
      default:
        return <NotFound onNavigate={navigate} />;
    }
  }, [path]);

  return (
    <>
      <Header currentPath={path} onNavigate={navigate} />
      <main>{page}</main>
      <Footer />
    </>
  );
}

function Header({ currentPath, onNavigate }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  const handleNav = (event, href) => {
    event.preventDefault();
    setOpen(false);
    onNavigate(href);
  };

  return (
    <header className="site-header">
      <a className="header-logo" href={localHref("/")} onClick={(event) => handleNav(event, "/")}>
        <img src={images.logoGreen} alt="Elgin" />
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.href}
            className={currentPath === item.href ? "active" : ""}
            href={localHref(item.href)}
            onClick={(event) => handleNav(event, item.href)}
          >
            {item.label}
          </a>
        ))}
        <a className="reservation-link" href={site.reservation} target="_blank" rel="noreferrer">
          Reservations
        </a>
      </nav>
      <button
        className={`burger ${open ? "is-open" : ""}`}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      {open && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              className={currentPath === item.href ? "active" : ""}
              href={localHref(item.href)}
              onClick={(event) => handleNav(event, item.href)}
              data-motion="menu-item"
              style={{ "--motion-delay": `${index * 65}ms` }}
            >
              {item.label}
            </a>
          ))}
          <a
            className="mobile-reservation-link"
            href={site.reservation}
            target="_blank"
            rel="noreferrer"
            data-motion="menu-item"
            style={{ "--motion-delay": `${navItems.length * 65}ms` }}
          >
            Reservations
          </a>
        </nav>
      )}
    </header>
  );
}

function SmartImage({ src, alt = "", className = "", loading = "eager", ...props }) {
  return <img className={className} src={src} alt={alt} loading={loading} decoding="async" {...props} />;
}

function formatDate(date) {
  if (!date) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function getSummaryPageSize() {
  return window.matchMedia("(max-width: 520px)").matches ? 2 : 3;
}

function MotionHeading({ as: Tag = "h2", children, delay = 0, className = "" }) {
  const words = String(children).split(" ");

  return (
    <Tag className={className} data-motion="text" data-motion-delay={delay}>
      {words.map((word, index) => (
        <span className="motion-word" style={{ "--word-index": index }} key={`${word}-${index}`}>
          {word}
          {index < words.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </Tag>
  );
}

/* ── SVG Icons ── */
function IconPin() {
  return (
    <span className="contact-icon" aria-hidden="true">📍</span>
  );
}

function IconMail() {
  return (
    <span className="contact-icon" aria-hidden="true">✉️</span>
  );
}

function IconPhone() {
  return (
    <span className="contact-icon" aria-hidden="true">📞</span>
  );
}

function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function IconTiktok() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.26 6.26 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.72a8.18 8.18 0 0 0 4.78 1.52V6.82a4.85 4.85 0 0 1-1.01-.13z"/>
    </svg>
  );
}

function HomePage({ onNavigate }) {
  return (
    <>
      <section className="hero" aria-label="Elgin">
        <SmartImage src={images.hero} alt="" loading="eager" data-motion="image-clip" data-parallax="18" />
        <img className="hero-script" src={images.logoPink} alt="Elgin" data-motion="fade-up" data-motion-delay="260" />
      </section>

      <HomeMosaic onNavigate={onNavigate} />

      <SummaryCarousel title="In the Press" items={pressItems} showDates={false} />
      <SummaryCarousel title="News/Events" items={eventItems} />
      <PhotoStrip />
    </>
  );
}

function HomeMosaic({ onNavigate }) {
  return (
    <section className="home-mosaic" aria-label="Elgin story">
      <div className="mosaic-column mosaic-column-left">
        <MosaicCopy className="mosaic-copy-welcome" title="Welcome to elgin" order={1}>
          <p>{site.description}</p>
          <p>We offer Asian-inspired sharing plates paired with a curated wine program featuring fresh and fun sips.</p>
          <p>
            At our core, the team is all about delivering memorable dining experiences and creating genuine connections
            with our guests.
          </p>
          <p>
            <strong>{site.hours}</strong>
          </p>
          <ContactLines />
          <SocialLinks />
          <a className="outline-button" href={site.reservation} target="_blank" rel="noreferrer">
            Make a Reservation
          </a>
        </MosaicCopy>
        <MosaicImage className="mosaic-image-menu" src={images.menuHand} order={4} parallax="12" />
        <MosaicCopy className="mosaic-copy-natural" title="Natural wines" order={5}>
          <p>Our wine program is curated to celebrate the diversity of grapes, styles, and countries of the wine world.</p>
          <p>We strive to showcase quality-driven wines from producers who have put lots of love into their practice.</p>
          <p>Most importantly, we believe that drinking wine should be easygoing and fun!</p>
          <a
            className="outline-button"
            href={localHref("/a-la-carte-menu")}
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/a-la-carte-menu");
            }}
          >
            See Our Wine Menu
          </a>
        </MosaicCopy>
      </div>
      <div className="mosaic-column mosaic-column-right">
        <MosaicImage className="mosaic-image-chef" src={images.chef} order={2} parallax="16" />
        <MosaicCopy className="mosaic-copy-sharing" title="Sharing plates" order={3}>
          <p>Our menu reflects our team's appreciation for global flavors and the warmth of a shared meal.</p>
          <p>
            Our chefs take great pride in preparing every dish with care, focusing on high-quality local ingredients
            paired with some of the world's best produce.
          </p>
          <a
            className="outline-button"
            href={localHref("/a-la-carte-menu")}
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/a-la-carte-menu");
            }}
          >
            See Our Dinner Menu
          </a>
        </MosaicCopy>
        <MosaicImage className="mosaic-image-wine" src={images.wine} order={6} parallax="12" />
      </div>
    </section>
  );
}

function MosaicCopy({ title, children, className = "", order }) {
  return (
    <div className={`mosaic-block mosaic-copy ${className}`} style={{ "--mobile-order": order }}>
      <MotionHeading>{title}</MotionHeading>
      <div className="copy-stack" data-motion="fade-up" data-motion-delay="160">{children}</div>
    </div>
  );
}

function MosaicImage({ src, className = "", order, parallax = "14" }) {
  return (
    <div className={`mosaic-block mosaic-image ${className}`} data-motion="image-clip" style={{ "--mobile-order": order }}>
      <SmartImage src={src} alt="" data-parallax={parallax} />
    </div>
  );
}

function ContactLines() {
  return (
    <div className="contact-lines">
      <a href="https://maps.google.com/?q=27%20Mac%20Dinh%20Chi%20Ho%20Chi%20Minh%20City" target="_blank" rel="noreferrer">
        <span className="contact-icon"><IconPin /></span>
        {site.address}
      </a>
      <a href={`mailto:${site.email}`}>
        <span className="contact-icon"><IconMail /></span>
        {site.email}
      </a>
      <a href="tel:+842835352957">
        <span className="contact-icon"><IconPhone /></span>
        {site.phone}
      </a>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="social-links" aria-label="Social links">
      <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
        <IconInstagram />
      </a>
      <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
        <IconFacebook />
      </a>
      <a href={site.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
        <IconTiktok />
      </a>
    </div>
  );
}

function SummaryCarousel({ title, items, showDates = true }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(getSummaryPageSize);
  const count = items.length;
  const pages = useMemo(() => {
    const chunks = [];

    for (let i = 0; i < count; i += pageSize) {
      chunks.push(items.slice(i, i + pageSize));
    }

    return chunks;
  }, [count, items, pageSize]);

  const maxPage = Math.max(0, pages.length - 1);
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === maxPage;

  useEffect(() => {
    const onResize = () => setPageSize(getSummaryPageSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setPageIndex((page) => Math.min(page, maxPage));
  }, [maxPage]);

  const prev = () => setPageIndex((page) => Math.max(0, page - 1));
  const next = () => setPageIndex((page) => Math.min(maxPage, page + 1));

  return (
    <section className="summary-section">
      <div className="summary-heading" data-motion="fade-up">
        <MotionHeading delay={80}>{title}</MotionHeading>
        <div className="arrows" aria-label="Navigation">
          <button
            className="arrow-button arrow-prev"
            type="button"
            onClick={prev}
            aria-label={`Previous ${title}`}
            disabled={isFirstPage}
          >
            <span aria-hidden="true" />
          </button>
          <button
            className="arrow-button arrow-next"
            type="button"
            onClick={next}
            aria-label={`Next ${title}`}
            disabled={isLastPage}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="summary-viewport" aria-live="polite" data-motion="fade-up" data-motion-delay="180">
        <div
          className="summary-track"
          style={{ "--carousel-page": pageIndex, "--summary-page-size": pageSize }}
        >
          {pages.map((page, pageSlot) => (
            <div
              key={`${title}-${pageSlot}`}
              className={`summary-page ${pageSlot === pageIndex ? "is-active" : ""}`}
              aria-hidden={pageSlot !== pageIndex}
            >
              {page.map((item, slot) => (
                <article
                  key={item.title}
                  className="summary-card"
                  style={{ "--card-delay": `${slot * 90}ms` }}
                >
                  {item.image ? (
                    <div className="summary-card-img">
                      <SmartImage src={item.image} alt={item.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="summary-card-img summary-card-img-empty" aria-hidden="true" />
                  )}
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  {showDates && item.date && <time dateTime={item.date}>{formatDate(item.date)}</time>}
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoStrip() {
  return (
    <section className="photo-strip" aria-label="Elgin gallery">
      <SmartImage src={images.dessert} alt="Dessert at Elgin" loading="lazy" data-motion="image-clip" />
      <SmartImage src={images.grill} alt="Grilling at Elgin" loading="lazy" data-motion="image-clip" data-motion-delay="90" />
      <SmartImage src={images.plateSocial} alt="Food plate" loading="lazy" data-motion="image-clip" data-motion-delay="180" />
      <SmartImage src={images.coasters} alt="Elgin coasters" loading="lazy" data-motion="image-clip" data-motion-delay="270" />
    </section>
  );
}

function MenuPage() {
  const [tab, setTab] = useState("food");
  const sections = tab === "food" ? foodMenuSections : wineMenuSections;

  return (
    <section className="page-shell menu-shell">
      <MotionHeading as="h1">Our menus</MotionHeading>
      <div className="menu-tabs" aria-label="Menu tabs" data-motion="fade-up" data-motion-delay="120">
        <button
          type="button"
          className={tab === "food" ? "active" : ""}
          aria-pressed={tab === "food"}
          onClick={() => setTab("food")}
        >
          Food
        </button>
        <button
          type="button"
          className={tab === "wine" ? "active" : ""}
          aria-pressed={tab === "wine"}
          onClick={() => setTab("wine")}
        >
          Wine
        </button>
      </div>
      <div className="menu-board" data-menu-tab={tab}>
        {sections.map((section, index) => {
          const midpoint = Math.ceil(section.items.length / 2);
          const columns = [section.items.slice(0, midpoint), section.items.slice(midpoint)];

          return (
            <section key={section.title} className="menu-section" data-motion="fade-up" data-motion-delay={index * 90}>
              <MotionHeading>{section.title}</MotionHeading>
              <div className="menu-items-grid">
                {columns.map((column, columnIndex) => (
                  <div className="menu-column" key={`${section.title}-${columnIndex}`}>
                    {column.map(([price, name, description]) => (
                      <div className="menu-item" key={`${section.title}-${name}`}>
                        <div>
                          <h3>{name}</h3>
                          <p>{description}</p>
                        </div>
                        <span>{price}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <p className="menu-note">
        All prices are quoted in '000 VND, and are subject to 5% service charge and 8% VAT. Please inform the team of
        any dietaries or allergies before ordering.
      </p>
    </section>
  );
}

function AboutPage({ onNavigate }) {
  return (
    <>
      <section className="page-split about-intro">
        <div data-motion="fade-up">
          <MotionHeading as="h1">About Elgin</MotionHeading>
          <SocialLinks />
          <p>
            The name Elgin is a nod to the street name in Hong Kong where our founders met, and serves as the
            inspiration behind the restaurant's food concept. The street itself is a bustling hub lined with mom & pop
            eateries to Michelin-starred restaurants serving a range of flavors and cuisines. We wanted to bring this
            vibrant energy and diversity to the forefront of our concept against the backdrop of Saigon.
          </p>
          <p>
            Elgin came together with the intention of offering a new-age casual dining option within the emerging dining
            scene in Saigon. We want it to be a place where guests feel welcomed for any occasion, whether it be a
            casual weekday bite or a special celebratory dinner. Our approach is restaurant dining with a bar-style
            service - warm and fun, proper but never stuffy!
          </p>
          <a className="outline-button" href={site.reservation} target="_blank" rel="noreferrer">
            Make a Reservation
          </a>
        </div>
        <SmartImage src={images.aboutHero} alt="" data-motion="image-clip" data-parallax="12" />
      </section>
      <section className="page-split reverse about-menu">
        <SmartImage src={images.aboutMenu} alt="" data-motion="image-clip" data-parallax="12" />
        <div data-motion="fade-up">
          <MotionHeading>about our menu</MotionHeading>
          <p>
            Our menu is inspired by our collective experiences and showcases glimpses of who we are as a team. Walking
            the line of fun and technical we strive to offer new, imaginative dishes using fresh local produce.
          </p>
          <p>The vibrant flavors of the menu are met with a curated eclectic wine program.</p>
          <p>
            The goal is for guests to expand the boundaries of their wine appreciation by exploring lesser-known grapes,
            styles, and countries of the wine world. We believe that wine is made to be enjoyed with every sip!
          </p>
          <div className="button-row">
            <a
              className="outline-button"
              href={localHref("/a-la-carte-menu")}
              onClick={(event) => {
                event.preventDefault();
                onNavigate("/a-la-carte-menu");
              }}
            >
              See our Dinner Menu
            </a>
            <a
              className="outline-button"
              href={localHref("/events")}
              onClick={(event) => {
                event.preventDefault();
                onNavigate("/events");
              }}
            >
              See our Events
            </a>
          </div>
        </div>
      </section>
      <section className="about-people">
        <div className="about-people-copy" data-motion="fade-up">
          <MotionHeading>about us</MotionHeading>
          <p>Have you ever met the people who keep Elgin running (and pouring)?</p>
          <p>
            Doug's the guy everyone still thinks is the chef (he's not), Mimi's the one who somehow keeps everything
            moving, and Dipti's the reason our wine list is that good.
          </p>
          <p>The trio that keeps Elgin buzzing, pouring, and smiling!</p>
        </div>
        <div className="people-grid" data-motion="fade-up" data-motion-delay="140">
          <figure>
            <SmartImage src={images.teamMimi} alt="Mimi" loading="lazy" />
            <figcaption>Mimi</figcaption>
          </figure>
          <figure>
            <SmartImage src={images.teamDoug} alt="Doug" loading="lazy" />
            <figcaption>Doug</figcaption>
          </figure>
          <figure>
            <SmartImage src={images.teamDipti} alt="Dipti" loading="lazy" />
            <figcaption>Dipti</figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}

function ListPage({ items, showOlder = false }) {
  return (
    <section className="page-shell list-shell">
      <div className="list-grid">
        {items.map((item, index) => (
          <article key={item.title} className="list-card" data-motion="fade-up" data-motion-delay={index * 70}>
            {item.image && (
              <div className="list-card-img" data-motion="image-clip" data-motion-delay={index * 70 + 90}>
                <SmartImage src={item.image} alt={item.title} loading="lazy" />
              </div>
            )}
            <time dateTime={item.date}>{formatDate(item.date)}</time>
            <MotionHeading>{item.title}</MotionHeading>
            <p>{item.summary}</p>
            <a
              href={item.href ? `https://www.elginsgn.com${item.href}` : "#read-more"}
              target={item.href ? "_blank" : undefined}
              rel={item.href ? "noreferrer" : undefined}
            >
              Read More
            </a>
          </article>
        ))}
      </div>
      {showOlder && <button className="older-button" type="button">Older Posts</button>}
    </section>
  );
}

function FunctionsPage() {
  return (
    <section className="page-split form-page">
      <div className="form-copy" data-motion="fade-up">
        <MotionHeading as="h1">Functions and Catering</MotionHeading>
        <p>
          We are able to accommodate in-house private hires of Elgin along with off-site catering services upon request.
          Our space is flexible and can host sit down dinners or standing cocktail hours. We have an existing selection
          of sharing plates and canapes for guests to choose from, but are also able to create a custom menu.
        </p>
        <p>
          <strong>Upstairs Dining Hall</strong><br />
          Private Dinner | Maximum 40 seats<br />
          Canapes | Up to 80 guests standing
        </p>
        <p>
          <strong>Downstairs Kitchen Bar</strong><br />
          Canapes / Welcome Drinks | Up to 30 guests standing
        </p>
        <p>For more information of our offerings for group dining and external catering, please refer to the Events Package below.</p>
        <p>
          For menu customizations and further assistance, please reach out to <a href={`mailto:${site.email}`}>{site.email}</a>
          and we'll figure something out for you!
        </p>
        <p>Looking forward to plan your next event together!</p>
      </div>
      <FunctionsForm />
    </section>
  );
}

function GiftCardsPage() {
  return (
    <section className="page-split form-page">
      <div className="form-copy" data-motion="fade-up">
        <MotionHeading as="h1">Gift Cards</MotionHeading>
        <p>A gift for any occasion!</p>
        <p>Treat your friends, family, or colleagues to the Elgin experience.</p>
        <p>
          Please contact us via the form or at <a href={`mailto:${site.email}`}>{site.email}</a> for more details.
        </p>
      </div>
      <GiftCardForm />
    </section>
  );
}

function ContactPage() {
  return (
    <section className="page-split form-page">
      <div className="form-copy" data-motion="fade-up">
        <MotionHeading as="h1">Contact us</MotionHeading>
        <p>
          Monday-Saturday 6pm-10pm<br />
          Sunday 5pm-9pm
        </p>
        <ContactLines />
        <SocialLinks />
      </div>
      <ContactForm />
    </section>
  );
}

function RequiredMark() {
  return <span className="field-required">(required)</span>;
}

function NameFields({ legend = "Name", first = "First Name", last = "Last Name" }) {
  return (
    <fieldset className="name-fieldset">
      <legend>{legend}</legend>
      <div className="name-grid">
        <label>
          <span>{first} <RequiredMark /></span>
          <input type="text" autoComplete="given-name" />
        </label>
        <label>
          <span>{last} <RequiredMark /></span>
          <input type="text" autoComplete="family-name" />
        </label>
      </div>
    </fieldset>
  );
}

function TextField({ label, required = false, type = "text", className = "" }) {
  return (
    <label className={className}>
      <span>{label} {required && <RequiredMark />}</span>
      <input type={type} />
    </label>
  );
}

function MessageField({ label = "Message", required = false }) {
  return (
    <label>
      <span>{label} {required && <RequiredMark />}</span>
      <textarea rows="6" />
    </label>
  );
}

function FormShell({ children }) {
  return (
    <form className="elgin-form" data-motion="fade-up" data-motion-delay="160" onSubmit={(event) => event.preventDefault()}>
      {children}
      <button className="outline-button" type="submit">
        Send
      </button>
    </form>
  );
}

function FunctionsForm() {
  return (
    <FormShell>
      <NameFields />
      <TextField label="Phone" />
      <TextField label="Email" required type="email" />
      <TextField label="Date of Event" type="date" className="short-field" />
      <TextField label="Budget" className="short-field" />
      <TextField label="Approximate Number of People" />
      <MessageField />
    </FormShell>
  );
}

function GiftCardForm() {
  return (
    <FormShell>
      <NameFields legend="Your Name" />
      <TextField label="Your Phone Number" />
      <TextField label="Your Email" required type="email" />
      <TextField label="Recipient Name" required />
      <label>
        <span>Gift Card Amount (VND) <RequiredMark /></span>
        <select defaultValue="">
          <option value="" disabled>
            Select an amount
          </option>
          <option>1,000,000 VND</option>
          <option>1,500,000 VND</option>
          <option>2,000,000 VND</option>
          <option>Other</option>
        </select>
      </label>
      <MessageField label="Anything else you need to tell us?" />
    </FormShell>
  );
}

function ContactForm() {
  return (
    <FormShell>
      <NameFields />
      <TextField label="Phone" />
      <TextField label="Email" required type="email" />
      <MessageField required />
    </FormShell>
  );
}

function NotFound({ onNavigate }) {
  return (
    <section className="page-shell not-found">
      <MotionHeading as="h1">Page not found</MotionHeading>
      <button className="outline-button" type="button" onClick={() => onNavigate("/")}>
        Back Home
      </button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="marquee" aria-hidden="true">
        <span>TASTY BITES FUNKY WINES&nbsp;&nbsp;✦&nbsp;&nbsp;TASTY BITES FUNKY WINES&nbsp;&nbsp;✦&nbsp;&nbsp;TASTY BITES FUNKY WINES&nbsp;&nbsp;✦&nbsp;&nbsp;TASTY BITES FUNKY WINES&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
        <span>TASTY BITES FUNKY WINES&nbsp;&nbsp;✦&nbsp;&nbsp;TASTY BITES FUNKY WINES&nbsp;&nbsp;✦&nbsp;&nbsp;TASTY BITES FUNKY WINES&nbsp;&nbsp;✦&nbsp;&nbsp;TASTY BITES FUNKY WINES&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
      </div>
      <div className="footer-inner">
        <img src={images.logoGreen} alt="Elgin" data-motion="fade-up" />
        <div className="footer-address" data-motion="fade-up" data-motion-delay="90">
          <p>{site.addressShort}</p>
          <p>{site.ward}</p>
        </div>
        <div className="footer-contact" data-motion="fade-up" data-motion-delay="180">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href="tel:+842835352957">{site.phone}</a>
        </div>
        <div className="footer-meta" data-motion="fade-up" data-motion-delay="270">
          <p>© 2026 Elgin. All Rights Reserved.</p>
          <p>Website by Thomas.</p>
        </div>
        <div data-motion="fade-up" data-motion-delay="340">
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}

export default App;
