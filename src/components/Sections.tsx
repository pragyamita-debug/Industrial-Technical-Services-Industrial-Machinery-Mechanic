import { useEffect, useState, type CSSProperties } from 'react';
import assembly from '../assets/photos/assembly.jpg';
import blueprint from '../assets/photos/blueprint.jpg';
import cnc from '../assets/photos/cnc.jpg';
import container from '../assets/photos/container.jpg';
import gears from '../assets/photos/gears.jpg';
import pipeHall from '../assets/photos/pipe-hall.jpg';
import plantNight from '../assets/photos/plant-night.jpg';
import plantSunrise from '../assets/photos/plant-sunrise.jpg';
import quality from '../assets/photos/quality.jpg';
import shield from '../assets/photos/shield.jpg';
import steelMark from '../assets/photos/steel-mark.jpg';
import turbine from '../assets/photos/turbine.jpg';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';
import { distinctIcons, iconFor, leadNumber, splitHeadline, statement } from '../lib/mech';
import type { Resume } from '../lib/types';
import { GlowCard } from './GlowCard';
import { Icon } from './Icon';
import { Logo } from './Logo';

const firstYear = (r: Resume) => {
  const ys = r.experience.map((e) => e.period?.match(/(19|20)\d\d/)?.[0]).filter(Boolean) as string[];
  return ys.length ? Math.min(...ys.map(Number)) : null;
};

/** Small mono label with a rule after it, like "ADVANCED MANUFACTURING / EST. 1989 ——". */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/* ================= top bar ================= */

export const NAV = [
  { id: 'home', label: 'Overview' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'record', label: 'Record' },
];

export function TopBar({ resume, active }: { resume: Resume; active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`top ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap top__inner">
        <a className="top__brand" href="#home">
          <Logo />
          <span>{resume.name}</span>
        </a>
        <nav className={`top__links ${open ? 'is-open' : ''}`} aria-label="Sections">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'is-active' : ''} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
        <a className="pill pill--sm top__cta" href="#contact">
          Get in Touch <Icon name="arrowRight" size={14} />
        </a>
        <button className="icon-btn top__burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? 'close' : 'menu'} size={17} />
        </button>
      </div>
    </header>
  );
}

/* ================= hero ================= */

function HeroStat({ value, plus, label, run, delay }: { value: number; plus?: boolean; label: string; run: boolean; delay: number }) {
  const v = useCountUp(value, run, { duration: 2200, delay });
  return (
    <div className="hstat">
      <b>
        {Math.round(v)}
        {plus ? '+' : ''}
      </b>
      <small>{label}</small>
    </div>
  );
}

export function Hero({ resume }: { resume: Resume }) {
  const [role, focus] = splitHeadline(resume.headline);
  const [l1, l2] = statement(resume.tagline || resume.summary || role);
  const since = firstYear(resume);
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  return (
    <section className="hero" id="home" aria-label="Introduction">
      <div className="hero__art" aria-hidden>
        {/* a sunrise burning up behind the steel */}
        <span className="hero__sun" />
        <div className="hero__gears">
          <img src={gears} alt="" />
          <span className="hero__glint" />
        </div>
        <span className="hero__sparks">
          {Array.from({ length: 16 }, (_, i) => (
            <i key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </span>
      </div>
      <div className="wrap hero__copy">
        <Eyebrow>
          {role}
          {since ? ` / Since ${since}` : focus ? ` / ${focus}` : ''}
        </Eyebrow>
        <h1 className="hero__title">
          <span>{l1}</span>
          {l2 && <span>{l2}</span>}
        </h1>
        <p className="hero__lede">{focus ? `${focus}. ` : ''}{resume.summary.split(/(?<=\.)\s/)[0]}</p>
        <div className="hero__actions">
          <a className="pill hero__btn" href="#capabilities">
            View Skills <Icon name="arrowRight" size={16} />
          </a>
          <span className="hero__sep" aria-hidden />
          <a className="text-link hero__link" href="#experience">
            View Experience <Icon name="arrowRight" size={15} />
          </a>
        </div>
        <div className="hero__stats" ref={ref}>
          <HeroStat value={resume.stats.years} plus={resume.stats.yearsPlus} label="Years of experience" run={inView} delay={200} />
          <HeroStat value={resume.certifications.length} label="Certifications" run={inView} delay={400} />
          <HeroStat value={resume.projects.length} plus={resume.stats.projectsPlus} label="Projects" run={inView} delay={600} />
        </div>
      </div>
    </section>
  );
}

/* ================= capabilities: three numbered photo cards ================= */

const CAP_PHOTOS = [cnc, assembly, quality];
const CAP_DOTS = ['#ff5a1f', '#b9b9b5', '#b6f36a'];

function lineFor(skill: string, resume: Resume) {
  const word = skill.split(/[\s&/,]+/).find((w) => w.length > 4);
  if (word) {
    const re = new RegExp(word.slice(0, 6), 'i');
    for (const e of resume.experience) {
      const hit = e.bullets.find((b) => re.test(b));
      if (hit) return hit.replace(/\.$/, '');
    }
  }
  return 'A core skill, used across every role.';
}

export function Capabilities({ resume }: { resume: Resume }) {
  const core = resume.skills.slice(0, 3);
  const rest = resume.skills.slice(3);
  const icons = distinctIcons(core);
  return (
    <section className="wrap section" id="capabilities" aria-label="Capabilities">
      <div className="section__head">
        <div>
          <Eyebrow>Skills</Eyebrow>
          <h2 className="section__title">Core skills. Clearly shown.</h2>
          <p className="section__lede">The three core skills, each matched to a line from real experience.</p>
        </div>
        <p className="section__note">
          {resume.skills.length} skills
          <br />
          {resume.certifications.length} certifications
          <br />
          {resume.stats.years}
          {resume.stats.yearsPlus ? '+' : ''} years
        </p>
      </div>
      <div className="caps">
        {core.map((s, i) => (
          <div key={s} className="cap" style={{ '--i': i } as CSSProperties}>
            <p className="cap__num">
              <i style={{ background: CAP_DOTS[i] }} /> {String(i + 1).padStart(2, '0')}
            </p>
            <GlowCard className="cap__card" accent="amber" speed={9} phase={i * 0.33}>
              <div className="cap__photo">
                <img src={CAP_PHOTOS[i]} alt="" loading="lazy" />
              </div>
              <div className="cap__body">
                <h3>
                  <Icon name={icons[i]} size={18} /> {s}
                </h3>
                <p>{lineFor(s, resume)}</p>
                <div className="cap__foot">
                  {rest[i] && <span className="tag">{rest[i]}</span>}
                  <Icon name="arrowRight" size={16} />
                </div>
              </div>
            </GlowCard>
          </div>
        ))}
      </div>
      {rest.length > 3 && (
        <ul className="toolbelt">
          {rest.slice(3).map((s, i) => (
            <li key={s} style={{ '--i': i } as CSSProperties}>
              <Icon name={iconFor(s, i)} size={14} /> {s}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ================= experience: the plant at sunrise, roles as rows with thumbnails ================= */

const ROLE_THUMBS = [container, turbine, pipeHall];

export function Experience({ resume }: { resume: Resume }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  const [open, setOpen] = useState(0);
  const roles = resume.experience.slice(0, 4);
  const y = useCountUp(resume.stats.years, inView, { duration: 2200, delay: 200 });
  const r = useCountUp(resume.experience.length, inView, { duration: 1600, delay: 400 });
  const a = useCountUp(resume.achievements.length, inView, { duration: 1600, delay: 600 });
  return (
    <section className="band" id="experience" aria-label="Experience">
      <div className="band__art" aria-hidden>
        <img className="band__plant" src={plantSunrise} alt="" />
        <span className="band__sun" />
      </div>
      <div className="wrap band__grid" ref={ref}>
        <div className="band__copy">
          <Eyebrow>Experience</Eyebrow>
          <h2 className="section__title">Experience, role by role.</h2>
          <p className="section__lede">Every position held — open one to see its responsibilities and results.</p>
          <div className="band__stats">
            <p>
              <b>
                {Math.round(y)}
                {resume.stats.yearsPlus ? '+' : ''}
              </b>
              <small>Years of experience</small>
            </p>
            <p>
              <b>{Math.round(r)}</b>
              <small>Roles held</small>
            </p>
            <p>
              <b>{Math.round(a)}</b>
              <small>Results delivered</small>
            </p>
          </div>
        </div>
        <ul className="roles">
          {roles.map((e, i) => (
            <li key={e.role + i}>
              <GlowCard className={`role ${open === i ? 'is-open' : ''}`} accent="amber" speed={10} phase={i * 0.25} tilt={false} active={open === i}>
                <button className="role__head" onClick={() => setOpen(i)} aria-expanded={open === i}>
                  <img src={ROLE_THUMBS[i % ROLE_THUMBS.length]} alt="" />
                  <span>
                    <b>{e.role}</b>
                    <small>{[e.company, e.period].filter(Boolean).join(' · ')}</small>
                  </span>
                  {e.current && <em>Now</em>}
                </button>
                <ul className="role__more">
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </GlowCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ================= projects over the glowing blueprint ================= */

export function Projects({ resume }: { resume: Resume }) {
  const [ref, inView] = useInView<HTMLElement>(0.2);
  if (!resume.projects.length) return null;
  return (
    <section ref={ref} className={`wrap section blueprint ${inView ? 'is-in' : ''}`} id="projects" aria-label="Projects">
      <div className="blueprint__art" aria-hidden>
        <img src={blueprint} alt="" />
      </div>
      <div className="blueprint__copy">
        <Eyebrow>Projects</Eyebrow>
        <h2 className="section__title">Projects and the work behind them.</h2>
        <p className="section__lede">Each project with its description and the tools used.</p>
      </div>
      <ul className="plist">
        {resume.projects.slice(0, 6).map((p, i) => (
          <li key={p.title} style={{ '--i': i } as CSSProperties}>
            <span className="plist__icon">
              <Icon name={iconFor(`${p.title} ${p.tags.join(' ')} ${p.description}`, i)} size={20} />
            </span>
            <span>
              <b>{p.title}</b>
              <small>{p.description}</small>
              {p.tags.length > 0 && <em>{p.tags.join(' · ')}</em>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ================= record: the glowing shield, results that count, certifications ================= */

function Result({ text, run, delay }: { text: string; run: boolean; delay: number }) {
  const lead = leadNumber(text);
  const v = useCountUp(lead?.n ?? 0, run, { duration: 1800, delay });
  const shown = lead ? `${lead.pre}${lead.n % 1 ? v.toFixed(1) : Math.round(v).toLocaleString()}${lead.post}` : '';
  return (
    <li>
      <b>{lead ? shown : <Icon name="trophy" size={24} />}</b>
      <span>{text}</span>
    </li>
  );
}

export function Record({ resume }: { resume: Resume }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  return (
    <section className="wrap section" id="record" aria-label="Track record">
      <div className="record" ref={ref}>
        <div className="record__main">
          <Eyebrow>Track record</Eyebrow>
          <h2 className="section__title">Results, certifications and training.</h2>
          <ul className="results">
            {resume.achievements.map((a, i) => (
              <Result key={a} text={a} run={inView} delay={i * 150} />
            ))}
          </ul>
        </div>
        <div className="record__side">
          <div className="shield" aria-hidden>
            <img src={shield} alt="" />
            <span className="shield__pulse" />
          </div>
          <GlowCard className="certs" accent="amber" speed={11} phase={0.4} tilt={false}>
            <p className="eyebrow eyebrow--plain">Certifications</p>
            <ul>
              {resume.certifications.map((c) => (
                <li key={c}>
                  <Icon name="award" size={16} /> {c}
                </li>
              ))}
            </ul>
            <p className="eyebrow eyebrow--plain">Training</p>
            <ul>
              {resume.education.map((e) => (
                <li key={e.degree}>
                  <Icon name="graduation" size={16} />
                  <span>
                    {e.degree}
                    <small>{[e.institution, e.year].filter(Boolean).join(' · ')}</small>
                  </span>
                </li>
              ))}
            </ul>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}

/* ================= orange call-to-action band ================= */

export function CallToAction({ resume }: { resume: Resume }) {
  const [a, b] = statement(resume.motto || 'Built to keep things moving.');
  const goal = resume.goals[0];
  return (
    <section className="cta" aria-label="Work together">
      <div className="wrap cta__grid">
        <div>
          <Eyebrow>Next step</Eyebrow>
          <h2 className="cta__title">
            <span>{a}</span>
            {b && <span>{b}</span>}
          </h2>
          <p className="cta__lede">{goal ? `Next: ${goal.value}${goal.note ? ` (${goal.note})` : ''}.` : 'Add a motto and goals to the profile and they appear here.'}</p>
          <div className="cta__actions">
            <a className="pill pill--dark" href={resume.email ? `mailto:${resume.email}` : '#contact'}>
              Get in Touch <Icon name="arrowRight" size={16} />
            </a>
            <span>{resume.location || 'Contact details below'}</span>
          </div>
        </div>
        <div className="cta__art" aria-hidden>
          <img src={steelMark} alt="" />
        </div>
      </div>
    </section>
  );
}

/* ================= steel footer ================= */

export function Footer({ resume }: { resume: Resume }) {
  const web = (u: string) => (u.startsWith('http') ? u : `https://${u}`);
  return (
    <footer className="foot" id="contact">
      <div className="foot__plates" aria-hidden>
        <img src={plantNight} alt="" />
      </div>
      <div className="wrap foot__grid">
        <div className="foot__plate">
          <p className="foot__name">{resume.name}</p>
          <p className="eyebrow eyebrow--plain">{resume.headline}</p>
        </div>
        <ul className="foot__plate foot__links">
          {resume.email && (
            <li>
              <a href={`mailto:${resume.email}`}>{resume.email}</a>
            </li>
          )}
          {resume.phone && (
            <li>
              <a href={`tel:${resume.phone.replace(/[^\d+]/g, '')}`}>{resume.phone}</a>
            </li>
          )}
          {resume.links.linkedin && (
            <li>
              <a href={web(resume.links.linkedin)} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          )}
        </ul>
        <div className="foot__plate foot__end">
          <p>{resume.location || 'Your city'}</p>
          <p className="eyebrow eyebrow--plain">Available for new opportunities</p>
        </div>
      </div>
      {resume.cvUrl && (
        <div className="wrap foot__actions">
          <a className="pill pill--line pill--sm" href={resume.cvUrl} download>
            <Icon name="download" size={15} /> Download CV
          </a>
        </div>
      )}
    </footer>
  );
}
