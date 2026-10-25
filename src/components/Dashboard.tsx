import { useScrollSpy } from '../hooks/useScrollSpy';
import type { StoredProfile } from '../lib/types';
import { CallToAction, Capabilities, Experience, Footer, Hero, HowItWorks, NAV, Projects, Record, TopBar } from './Sections';
import './Dashboard.css';

const IDS = NAV.map((n) => n.id);

interface Props {
  profile: StoredProfile;
  isExample: boolean;
  onUploadNew: () => void;
  onEdit: () => void;
  onReset: () => void;
  onDownloadCv: () => void;
}

export function Dashboard({ profile, isExample, onUploadNew, onEdit, onReset, onDownloadCv }: Props) {
  const { resume } = profile;
  const active = useScrollSpy(IDS, 140);
  return (
    <>
      <TopBar resume={resume} active={active} isExample={isExample} onUpload={onUploadNew} />
      <main>
        <Hero resume={resume} isExample={isExample} onUpload={onUploadNew} />
        {isExample && <HowItWorks onUpload={onUploadNew} />}
        <Capabilities resume={resume} />
        <Experience resume={resume} />
        <Projects resume={resume} />
        <Record resume={resume} />
        <CallToAction resume={resume} />
      </main>
      <Footer resume={resume} isExample={isExample} onUpload={onUploadNew} onEdit={onEdit} onReset={onReset} onDownloadCv={onDownloadCv} />
    </>
  );
}
