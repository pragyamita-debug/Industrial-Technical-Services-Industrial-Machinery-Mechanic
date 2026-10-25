import { useScrollSpy } from '../hooks/useScrollSpy';
import type { Resume } from '../lib/types';
import { CallToAction, Capabilities, Experience, Footer, Hero, NAV, Projects, Record, TopBar } from './Sections';
import './Dashboard.css';

const IDS = NAV.map((n) => n.id);

export function Dashboard({ resume }: { resume: Resume }) {
  const active = useScrollSpy(IDS, 140);
  return (
    <>
      <TopBar resume={resume} active={active} />
      <main>
        <Hero resume={resume} />
        <Capabilities resume={resume} />
        <Experience resume={resume} />
        <Projects resume={resume} />
        <Record resume={resume} />
        <CallToAction resume={resume} />
      </main>
      <Footer resume={resume} />
    </>
  );
}
