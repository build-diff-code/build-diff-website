import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useTheme } from "~/src/theme/ThemeProvider";
import styles from "./Navbar.module.css";
type IconProps = { className?: string };

function MoonIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ChevronIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className }, ref) => (
  <svg ref={ref} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
));
ChevronIcon.displayName = "ChevronIcon";

const ArrowIcon = React.forwardRef<SVGSVGElement, IconProps>(({ className }, ref) => (
  <svg ref={ref} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
));
ArrowIcon.displayName = "ArrowIcon";

type TeamMember = {
  name: string;
  photo: string;
  linkedin?: string;
};

type NavItem = {
  label: string;
  href: string;
  highlight?: boolean;
  details?: { label: string; value: string }[];
  team?: TeamMember[];
};

// Placeholder set until real team photos + LinkedIn links are shared.
// Photo paths follow the same convention as jam covers: served from
// /team/member_N.jpg, so drop real files at that path in your public dir.
const TEAM_MEMBERS: TeamMember[] = [
  { name: "HEET MEHTA", photo: "/team/heet.jpg", linkedin: "https://www.linkedin.com/in/heet-mehta-68078b2b9/" },
  { name: "JATIN CHAUDHARY", photo: "/team/jatin.jpg", linkedin: "https://www.linkedin.com/in/jatin-chaudhary-a57b29263/" },
  { name: "PRITAM CHIKANE", photo: "/team/pritam.jpg", linkedin: "https://www.linkedin.com/in/pritam-chikane-0238492a7/" },
];

const NAV_ITEMS: NavItem[] = [
  {
    label: "CONTACT",
    href: "#contact",
    details: [
      { label: "Email", value: "builddiff@gmail.com" },
      { label: "Support", value: "teamdiff@gmail.com" },
      { label: "Phone", value: "98199 09275" },
    ],
  },
  { label: "ABOUT US", href: "#about", details: [{ label: "", value: "Content coming soon." }] },
  { label: "SERVICES", href: "#services", details: [{ label: "", value: "Content coming soon." }] },
  { label: "DREAMTEAM", href: "#dreamteam", team: TEAM_MEMBERS },
  // Highlighted CTA row — deliberately NOT an accordion. Keeps its
  // ArrowIcon and no `details`, so clicking it still navigates (via href,
  // once wired up) and closes the menu.
  { label: "SEE WHAT WE LOVE", href: "/what-we-like", highlight: true },
];

const SOCIALS = ["LinkedIn", "Behance", "Instagram", "Pinterest", "Spotify"];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  // Which accordion row is currently expanded — only one at a time.
  const [openItem, setOpenItem] = React.useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/product");
  const isWhatWeLikePage = location.pathname.startsWith("/what-we-like");

  const overlayRef = React.useRef<HTMLElement>(null);
  const labelInnerRefs = React.useRef<Map<string, HTMLSpanElement>>(new Map());
  const iconRefs = React.useRef<Map<string, SVGSVGElement>>(new Map());
  const socialsRef = React.useRef<HTMLDivElement>(null);
  const panelRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  const navigate = useNavigate();

  const handleRowClick = (item: NavItem) => {
    if (item.details || item.team) {
      setOpenItem((current) => (current === item.label ? null : item.label));
      return;
    }
    setOpen(false);
    navigate(item.href);
  };
  // Timeline built once (paused), then played/reversed on toggle so open
  // and close are exact mirrors of each other rather than two separately
  // hand-tuned animations.
  const menuTl = React.useRef<gsap.core.Timeline | null>(null);

  const setLabelRef = (label: string) => (el: HTMLSpanElement | null) => {
    if (el) labelInnerRefs.current.set(label, el);
    else labelInnerRefs.current.delete(label);
  };
  const setIconRef = (label: string) => (el: SVGSVGElement | null) => {
    if (el) iconRefs.current.set(label, el);
    else iconRefs.current.delete(label);
  };
  const setPanelRef = (label: string) => (el: HTMLDivElement | null) => {
    if (el) panelRefs.current.set(label, el);
    else panelRefs.current.delete(label);
  };

  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setOpenItem(null);
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Build the open/close timeline once refs exist. Curtain-style clip-path
  // reveal on the overlay, then each label mask slides up into view
  // (staggered), then socials — matching the creativegiants.art-inspired
  // reveal pattern (overlay wipe -> text reveal -> secondary content).
  React.useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const socials = socialsRef.current;
    if (!overlay || !socials) return;

    const labels = NAV_ITEMS.map((item) => labelInnerRefs.current.get(item.label)).filter(
      Boolean,
    ) as HTMLSpanElement[];
    const icons = NAV_ITEMS.map((item) => iconRefs.current.get(item.label)).filter(Boolean) as SVGSVGElement[];

    const ctx = gsap.context(() => {
      gsap.set(overlay, { clipPath: "inset(0% 0% 100% 0%)", visibility: "hidden" });
      gsap.set(labels, { yPercent: 110 });
      gsap.set(icons, { opacity: 0, scale: 0.6 });
      gsap.set(socials, { opacity: 0, y: 12 });

      const dur = reduceMotion ? 0 : undefined;

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut" },
        onStart: () => gsap.set(overlay, { visibility: "visible" }),
        onReverseComplete: () => gsap.set(overlay, { visibility: "hidden" }),
      });

      tl.to(overlay, { clipPath: "inset(0% 0% 0% 0%)", duration: dur ?? 0.6 })
        .to(
          labels,
          { yPercent: 0, duration: dur ?? 0.7, ease: "power4.out", stagger: reduceMotion ? 0 : 0.06 },
          reduceMotion ? undefined : "-=0.3",
        )
        .to(
          icons,
          { opacity: 1, scale: 1, duration: dur ?? 0.4, ease: "power2.out", stagger: reduceMotion ? 0 : 0.06 },
          "<",
        )
        .to(socials, { opacity: 1, y: 0, duration: dur ?? 0.4, ease: "power2.out" }, reduceMotion ? undefined : "-=0.25");

      menuTl.current = tl;
    }, overlay);

    return () => ctx.revert();
  }, [reduceMotion]);

  React.useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (open) tl.play();
    else tl.reverse();
  }, [open]);

  // Accordion: animate to real content height (not a guessed max-height).
  // Applies to both plain-text (`details`) and team-grid (`team`) panels.
  React.useLayoutEffect(() => {
    NAV_ITEMS.forEach((item) => {
      if (!item.details && !item.team) return;
      const panel = panelRefs.current.get(item.label);
      if (!panel) return;

      const isExpanded = openItem === item.label;
      gsap.to(panel, {
        height: isExpanded ? "auto" : 0,
        opacity: isExpanded ? 1 : 0,
        duration: reduceMotion ? 0 : 0.4,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    });
  }, [openItem, reduceMotion]);

  return (
    <>
      <header className={`navbar ${styles.navbar}`} data-theme={theme}>
      <div className={styles.navbar__leftGroup}>
  <button
    type="button"
    className={styles.navbar__menuBtn}
    onClick={() => setOpen((o) => !o)}
  >
    {open ? "CLOSE" : "MENU"}
  </button>

  {isProductPage || isWhatWeLikePage ? (
    <Link to="/" className={styles.navbar__gridView}>
      HOME
    </Link>
  ) : (
    <Link to="/product/img1" className={styles.navbar__gridView}>
      GRID VIEW
    </Link>
  )}
</div>


        <div className={styles.navbar__iconGroup}>
          <button
            type="button"
            className={styles.navbar__theme}
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={dark}
          >
            {dark ? (
              <SunIcon className={styles.navbar__themeIcon} />
            ) : (
              <MoonIcon className={styles.navbar__themeIcon} />
            )}
          </button>
          <img src="/assets/Logo.png" alt="Logo" className={styles.navbar__sparkle} />
        </div>
      </header>

      {/* Sibling of .navbar, not a child — so this never gets swept into
          .navbar's mix-blend-mode: difference flattening/blend group. */}
      <nav
        ref={overlayRef}
        className={`${styles.navbar__overlay} ${open ? styles.navbar__overlayOpen : ""}`}
        aria-hidden={!open}
      >
        <div className={styles.navbar__navList}>
          {NAV_ITEMS.map((item) => {
            const isExpanded = openItem === item.label;

            return (
              <div key={item.label} className={styles.navbar__navRow}>
                <button
                  type="button"
                  className={`${styles.navbar__navHeader} ${item.highlight ? styles.navbar__navItemHighlight : ""}`}
                  onClick={() => handleRowClick(item)}
                  aria-expanded={item.details || item.team ? isExpanded : undefined}
                >
                  <span className={styles.navbar__navLabelMask}>
                    <span className={styles.navbar__navLabelInner} ref={setLabelRef(item.label)}>
                      {item.label}
                    </span>
                  </span>
                  {item.highlight && !item.details && !item.team ? (
                    <ArrowIcon ref={setIconRef(item.label)} className={styles.navbar__navIcon} />
                  ) : (
                    <ChevronIcon
                      ref={setIconRef(item.label)}
                      className={`${styles.navbar__navIcon} ${isExpanded ? styles.navbar__navIconOpen : ""}`}
                    />
                  )}
                </button>

                {item.team ? (
                  <div ref={setPanelRef(item.label)} className={styles.navbar__navPanel}>
                    <div className={styles.navbar__teamGrid}>
                      {item.team.map((member) => (
                        <div key={member.name} className={styles.navbar__teamCard}>
                          <div className={styles.navbar__teamPhotoWrap}>
                            <img src={member.photo} alt={member.name} className={styles.navbar__teamPhoto} />
                            {member.linkedin && (
                              <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.navbar__teamSocialBadge}
                                aria-label={`${member.name} on LinkedIn`}
                              >
                                in
                              </a>
                            )}
                          </div>
                          <span className={styles.navbar__teamName}>{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  item.details && (
                    <div ref={setPanelRef(item.label)} className={styles.navbar__navPanel}>
                      <div className={styles.navbar__navPanelInner}>
                        {item.details.map((d) => (
                          <span key={d.label || d.value}>{d.value}</span>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div ref={socialsRef} className={styles.navbar__socials}>
          {SOCIALS.map((s) => (
            <a key={s} href="#" className={styles.navbar__socialLink}>
              {s}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}