import { useEffect, useMemo, useRef, useState } from "react";
import { eventItems, images, menuDocuments, navItems, photoStrips, pressItems, site } from "./data.js";
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

function findPostByPath(path) {
  const clean = normalizePath(path);
  return [...pressItems, ...eventItems].find((item) => normalizePath(item.href) === clean) || null;
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
    const post = findPostByPath(path);

    if (post) {
      return <PostDetailPage item={post} onNavigate={navigate} />;
    }

    switch (path) {
      case "/":
        return <HomePage onNavigate={navigate} />;
      case "/a-la-carte-menu":
        return <MenuPage />;
      case "/about":
        return <AboutPage onNavigate={navigate} />;
      case "/press":
        return <ListPage items={pressItems} title="Press" onNavigate={navigate} />;
      case "/events":
        return <ListPage items={eventItems} title="Events" showOlder onNavigate={navigate} />;
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
        <img src={images.logo} alt="Kai Maison" />
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
  return 3;
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

function ElginStamp({ className = "" }) {
  const stampText = "RESERVE YOUR TABLE + RESERVE YOUR TABLE +";
  const chars = stampText.split("");

  return (
    <a
      className={`elgin-stamp ${className}`}
      href={site.reservation}
      target="_blank"
      rel="noreferrer"
      aria-label="Reserve your table"
      data-motion="stamp"
      data-motion-delay="360"
    >
      <span className="elgin-stamp-ring" aria-hidden="true">
        {chars.map((char, index) => (
          <span
            className="elgin-stamp-char"
            key={`${char}-${index}`}
            style={{ "--char-angle": `${(360 / chars.length) * index}deg` }}
          >
            {char}
          </span>
        ))}
      </span>
      <span className="elgin-stamp-core" aria-hidden="true">Kai</span>
    </a>
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
      <section className="hero" aria-label="Kai Maison">
        <SmartImage src={images.hero} alt="" loading="eager" data-motion="image-clip" data-parallax="18" />
        <h1 className="hero-logo" data-motion="fade-up" data-motion-delay="260">
          <span>kai</span>
          <span>maison</span>
        </h1>
        <ElginStamp className="hero-stamp" />
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
    <section className="home-mosaic" aria-label="Kai Maison story">
      <div className="mosaic-column mosaic-column-left">
        <MosaicCopy className="mosaic-copy-welcome" title="Kai Maison" order={1}>
          <p>
            Kai Maison is a modern casual dining restaurant and art & music venue, inspired by the spirit of
            Maybachufer - a place of diversity, creativity, and vibrant life along Berlin's Landwehr Canal.
          </p>
          <p>
            We offer French-Vietnamese inspired cuisine, with a menu shaped by the seasons and a wine list carefully
            paired to complement the unique character of each dish.
          </p>
          <p>
            <strong>Opening Hours:</strong>
          </p>
          <p>{site.hours}</p>
          <ContactLines />
          <SocialLinks />
          <a className="outline-button" href={site.reservation} target="_blank" rel="noreferrer">
            Make a Reservation
          </a>
        </MosaicCopy>
        <MosaicImage className="mosaic-image-menu" src={images.menuHand} order={4} parallax="12" />
        <MosaicCopy className="mosaic-copy-natural" title="Drinks collection" order={5}>
          <p>
            The drink menu is shaped by the team's shared experience with wine, cocktails, and mixed drinks. For food
            and wine pairing, we simply celebrate the diversity of grapes, styles, and countries across the wine world.
          </p>
          <p>We believe that drinking wine should be easygoing, fun, and always enjoyed with good food.</p>
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
        <MosaicCopy className="mosaic-copy-sharing" title="Menu" order={3}>
          <p>
            Our menu reflects the team's appreciation for seasonal and local produce, as well as the art of cooking.
          </p>
          <p>
            We believe in creating a concept that welcomes diversity and people from all walks of life - a place where
            they come together to celebrate the spirit of food culture and creativity.
          </p>
          <p>
            Kai Maison's offerings are available in a variety of formats, including lunch, dinner, set menus, and
            bespoke options.
          </p>
          <a
            className="outline-button"
            href={localHref("/a-la-carte-menu")}
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/a-la-carte-menu");
            }}
          >
            See Our Menu
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

function ContactLines({ showEmail = true } = {}) {
  return (
    <div className="contact-lines">
      <a href={site.maps} target="_blank" rel="noreferrer">
        <span className="contact-icon"><IconPin /></span>
        {site.address}
      </a>
      {showEmail && (
        <a href={`mailto:${site.email}`}>
          <span className="contact-icon"><IconMail /></span>
          {site.email}
        </a>
      )}
      <a href={`tel:${site.phoneHref}`}>
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
  const [transition, setTransition] = useState({ previous: null, direction: "next", active: false });
  const transitionTimer = useRef(null);
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
  const isMoving = transition.active;

  useEffect(() => {
    const onResize = () => setPageSize(getSummaryPageSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(transitionTimer.current);
  }, []);

  useEffect(() => {
    setPageIndex((page) => Math.min(page, maxPage));
    setTransition({ previous: null, direction: "next", active: false });
  }, [maxPage]);

  const navigatePage = (nextPage, direction) => {
    if (nextPage === pageIndex || isMoving) return;

    window.clearTimeout(transitionTimer.current);
    setTransition({ previous: pageIndex, direction, active: true });
    setPageIndex(nextPage);
    transitionTimer.current = window.setTimeout(() => {
      setTransition({ previous: null, direction, active: false });
    }, 820);
  };

  const prev = () => navigatePage(Math.max(0, pageIndex - 1), "prev");
  const next = () => navigatePage(Math.min(maxPage, pageIndex + 1), "next");

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
            disabled={isFirstPage || isMoving}
          >
            <span aria-hidden="true" />
          </button>
          <button
            className="arrow-button arrow-next"
            type="button"
            onClick={next}
            aria-label={`Next ${title}`}
            disabled={isLastPage || isMoving}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
      <div
        className={`summary-viewport${isMoving ? ` is-moving is-moving-${transition.direction}` : ""}`}
        aria-live="polite"
        data-motion="fade-up"
        data-motion-delay="180"
      >
        <div
          className="summary-track"
          style={{ "--carousel-page": pageIndex, "--summary-page-size": pageSize }}
        >
          {pages.map((page, pageSlot) => (
            <div
              key={`${title}-${pageSlot}`}
              className={`summary-page${pageSlot === pageIndex ? " is-active" : ""}${
                transition.previous === pageSlot ? ` is-leaving is-leaving-${transition.direction}` : ""
              }`}
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

function PhotoStrip({ items = photoStrips.form }) {
  return (
    <section className="photo-strip" aria-label="Kai Maison gallery" data-motion="gallery-soft">
      {items.map((item) => (
        <SmartImage key={item.src} src={item.src} alt={item.alt} loading="lazy" />
      ))}
    </section>
  );
}

function AboutGallery() {
  return (
    <section className="about-gallery" aria-label="Kai Maison details" data-motion="gallery-soft">
      {photoStrips.about.map((item) => (
        <SmartImage key={item.src} src={item.src} alt={item.alt} loading="lazy" />
      ))}
    </section>
  );
}

function MenuPage() {
  const [tab, setTab] = useState("food");
  const menu = menuDocuments[tab];

  return (
    <>
      <section className={`page-shell menu-shell menu-code-shell menu-code-shell-${tab}`}>
        <MotionHeading as="h1">Our menus</MotionHeading>
        <div className="menu-tabs" aria-label="Menu tabs" data-motion="fade-up" data-motion-delay="120">
          {Object.entries(menuDocuments).map(([key, document]) => (
            <button
              key={key}
              type="button"
              className={tab === key ? "active" : ""}
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
            >
              {document.label}
            </button>
          ))}
        </div>
        <div className="menu-code-actions" data-motion="fade-up" data-motion-delay="180">
          <p>{menu.note}</p>
          <a className="menu-code-link" href={menu.pdf} target="_blank" rel="noreferrer">
            Original PDF
          </a>
        </div>
        <div className="kai-menu" data-menu-tab={tab} aria-label={`${menu.label} menu`}>
          {tab === "food" ? <FoodMenu menu={menu} /> : <DrinkMenu menu={menu} />}
        </div>
      </section>
      <PhotoStrip items={photoStrips.menu} />
    </>
  );
}

function FoodMenu({ menu }) {
  return (
    <div className="kai-menu-grid kai-menu-grid-food">
      {menu.sections.map((section, index) => (
        <MenuPanel key={section.title} section={section} delay={260 + index * 45} />
      ))}
      {menu.footnote && (
        <p className="kai-menu-footnote kai-menu-food-footnote" data-motion="fade-up">
          {menu.footnote}
        </p>
      )}
    </div>
  );
}

function DrinkMenu({ menu }) {
  return (
    <div className="kai-menu-grid kai-menu-grid-drinks">
      {menu.sections.map((section, index) => (
        <MenuPanel key={section.title} section={section} variant="drinks" delay={260 + index * 45} />
      ))}
    </div>
  );
}

function MenuPanel({ section, variant = "food", delay = 0 }) {
  const groups = section.groups || [{ items: section.items || [] }];

  return (
    <article
      className={`kai-menu-panel kai-menu-panel-${variant}${section.wide ? " kai-menu-panel-wide" : ""}${
        section.compact ? " kai-menu-panel-compact" : ""
      }`}
      data-motion="card"
      data-motion-delay={delay}
    >
      <header className="kai-menu-panel-header">
        <h2>{section.title}</h2>
      </header>
      <div className="kai-menu-panel-body">
        {groups.map((group, groupIndex) => (
          <MenuGroup key={`${section.title}-${group.title || groupIndex}`} group={group} />
        ))}
      </div>
      {section.footnote && <p className="kai-menu-footnote">{section.footnote}</p>}
    </article>
  );
}

function MenuGroup({ group }) {
  return (
    <section className="kai-menu-group">
      {(group.title || group.note) && (
        <header className="kai-menu-group-header">
          {group.title && <h3>{group.title}</h3>}
          {group.note && <span>{group.note}</span>}
        </header>
      )}
      <ul className="kai-menu-list">
        {(group.items || []).map((item) => (
          <MenuListItem key={`${item.name}-${item.price || ""}`} item={item} />
        ))}
      </ul>
    </section>
  );
}

function MenuListItem({ item }) {
  return (
    <li className="kai-menu-item">
      <div className="kai-menu-item-line">
        <h4>{item.name}</h4>
        {item.price && <span>{item.price}</span>}
      </div>
      {item.desc && <p>{item.desc}</p>}
    </li>
  );
}

function AboutPage({ onNavigate }) {
  return (
    <>
      <section className="page-split about-intro">
        <div data-motion="fade-up">
          <MotionHeading as="h1">Inspiration</MotionHeading>
          <SocialLinks />
          <p>
            There will be thousands more "Maison" in this world, but we love the meaning of Maison - a home, a home
            where we ourselves find great feasts and vibrant energy and diversity through the form of art and cuisine.
          </p>
          <p>
            The French and Vietnamese fusion menu might say it all about us and about Maison. More than just that, we
            came with the intention of offering a new-age casual dining experience within the emerging dining scene of
            Berlin, Berlin art, and lifestyle. Our approach combines the fun of Berlin-cool art culture with the
            structure and quality of proper F&B dining.
          </p>
          <p>And Kai? We would be happy to share more while having a drink or a bite at Maybachufer 23.</p>
          <a className="outline-button" href={site.reservation} target="_blank" rel="noreferrer">
            Make a Reservation
          </a>
        </div>
        <SmartImage src={images.aboutHero} alt="" data-motion="image-clip" />
      </section>
      <section className="page-split reverse about-menu">
        <SmartImage src={images.aboutMenu} alt="" data-motion="image-clip" />
        <div data-motion="fade-up">
          <MotionHeading>Our menu</MotionHeading>
          <p>
            Our menu is inspired by the art of Vietnamese cuisine, where our mom and grandma back home would go to the
            market twice a day to get the freshest local produce, as well as the incredible philosophy of French cooking
            - the two share many similarities.
          </p>
          <p>
            From this year, our menu will lean into the seasons, aiming to highlight vibrant flavours paired with
            eclectic wine selections. We believe a good dish is at its best when accompanied by a good sip of drink,
            especially wine.
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
        <div className="about-people-copy">
          <MotionHeading>About us</MotionHeading>
          <p>Walking the line between fun and technique, we laugh and truly enjoy what we do here.</p>
          <p>
            Have you met Phuong, who talks to everyone and dances along with the guests? Have you met Hung, the guy who
            has his own corner and creates incredibly tasty and fancy canapes?
          </p>
          <p>
            We wouldn't list everyone here, because each person has their own talent and role that keeps Kai Maison
            going. But yes, our team is forever young, enthusiastic, and truly loves what we do.
          </p>
        </div>
        <div className="people-grid">
          <figure>
            <SmartImage src={images.teamMimi} alt="Kai Maison service moment" loading="lazy" />
            <figcaption>Phuong</figcaption>
          </figure>
          <figure>
            <SmartImage src={images.teamDoug} alt="Kai Maison dining detail" loading="lazy" />
            <figcaption>Hung</figcaption>
          </figure>
          <figure>
            <SmartImage src={images.teamDipti} alt="Kai Maison team detail" loading="lazy" />
            <figcaption>Team</figcaption>
          </figure>
        </div>
      </section>
      <AboutGallery />
    </>
  );
}

function ListPage({ items, showOlder = false, onNavigate }) {
  const handleReadMore = (event, href) => {
    if (!href || !onNavigate) return;
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <section className="page-shell list-shell">
      <div className="list-grid">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="list-card"
            data-motion="card"
            data-motion-delay={Math.min(index % 3, 2) * 90}
          >
            {item.image && (
              <div className="list-card-img">
                <SmartImage src={item.image} alt={item.title} loading="lazy" />
              </div>
            )}
            <time dateTime={item.date}>{formatDate(item.date)}</time>
            <MotionHeading>{item.title}</MotionHeading>
            <p>{item.summary}</p>
            <a
              href={item.href ? localHref(item.href) : "#read-more"}
              onClick={(event) => handleReadMore(event, item.href)}
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

function PostDetailPage({ item, onNavigate }) {
  const parentHref = item.href?.startsWith("/events") ? "/events" : "/press";
  const parentLabel = parentHref === "/events" ? "Events" : "Press";

  const handleBack = (event) => {
    event.preventDefault();
    onNavigate(parentHref);
  };

  return (
    <article className="page-shell post-detail">
      <a className="post-back" href={localHref(parentHref)} onClick={handleBack}>
        Back to {parentLabel}
      </a>
      {item.image && (
        <div className="post-detail-img" data-motion="image-clip">
          <SmartImage src={item.image} alt={item.title} />
        </div>
      )}
      <time dateTime={item.date}>{formatDate(item.date)}</time>
      <MotionHeading as="h1" className="post-title">{item.title}</MotionHeading>
      <p className="post-summary">{item.summary}</p>
    </article>
  );
}

function FunctionsPage() {
  return (
    <>
      <section className="page-split form-page">
        <div className="form-copy" data-motion="fade-up">
          <MotionHeading as="h1">Functions and Catering</MotionHeading>
          <p>
            Since the start, functions and events have been a signature service of Kai Maison. We are able to
            accommodate in-house private hires at Kai Maison, along with off-site catering services upon request.
          </p>
          <p>
            We offer an existing selection of outstanding seasonal dishes on our menu, and we are also able to create
            canapes for guests to choose from, as well as a custom menu.
          </p>
          <p>
            <strong>Dining capacity:</strong><br />
            80 indoor seats | Maximum 100 seats<br />
            Canapes | Up to 150 guests (standing)<br />
            100 outdoor seats<br />
            There is also space for live music and DJs.
          </p>
          <p>
            We have worked with many top artists in Berlin over the past year to create not only a dining space, but
            also an art and culture event experience.
          </p>
          <p>
            For more information about our group dining and external catering offerings, please reach out to{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>, and we will be happy to create something for you.
          </p>
        </div>
        <ContactForm />
      </section>
      <PhotoStrip items={photoStrips.form} />
    </>
  );
}

function GiftCardsPage() {
  return (
    <>
      <section className="page-split form-page">
        <div className="form-copy" data-motion="fade-up">
          <MotionHeading as="h1">Gift Cards</MotionHeading>
          <p>A gift for any occasion!</p>
          <p>Treat your friends, family, or colleagues to the Kai Maison experience.</p>
          <p>
            Please contact us via the form or at <a href={`mailto:${site.email}`}>{site.email}</a> for more details.
          </p>
        </div>
        <ContactForm />
      </section>
      <PhotoStrip items={photoStrips.form} />
    </>
  );
}

function ContactPage() {
  return (
    <>
      <section className="page-split form-page">
        <div className="form-copy" data-motion="fade-up">
          <MotionHeading as="h1">Contact us</MotionHeading>
          <ContactLines showEmail={false} />
          <a className="outline-button direction-button" href={site.maps} target="_blank" rel="noreferrer">
            Direction
          </a>
          <p>
            For any marketing, media & PR enquiries, billing or other enquiry, please email:{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>
            <strong>Opening Hours:</strong><br />
            {site.hours}
          </p>
          <SocialLinks />
        </div>
        <div className="contact-form-stack">
          <ContactForm />
          <a className="outline-button reservation-button" href={site.reservation} target="_blank" rel="noreferrer">
            Make a Reservation
          </a>
        </div>
      </section>
      <PhotoStrip items={photoStrips.contact} />
    </>
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
  const marqueeText = "ART VENUE  |  SEASONAL MENU  |  EVENTS  |  WINE PAIRING  ✦";
  const renderMarqueeGroup = (group) =>
    Array.from({ length: 4 }, (_, index) => <span key={`${group}-${index}`}>{marqueeText}</span>);

  return (
    <footer className="site-footer">
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <div className="marquee-group">{renderMarqueeGroup("a")}</div>
          <div className="marquee-group">{renderMarqueeGroup("b")}</div>
        </div>
      </div>
      <div className="footer-inner">
        <div className="footer-logo" data-motion="fade-up">
          <img src={images.logo} alt="Kai Maison" loading="lazy" />
        </div>
        <div className="footer-address" data-motion="fade-up" data-motion-delay="90">
          <p>{site.addressShort}</p>
          <p>{site.ward}</p>
        </div>
        <div className="footer-contact" data-motion="fade-up" data-motion-delay="180">
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
        </div>
        <div className="footer-meta" data-motion="fade-up" data-motion-delay="270">
          <p>© 2026 Kai Maison. All Rights Reserved.</p>
          <p>Coded by TUTTYLAB.</p>
        </div>
        <div data-motion="fade-up" data-motion-delay="340">
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}

export default App;
