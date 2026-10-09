import { Crew } from '../components/Crew';
import { Faq } from '../components/Faq';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { MadeBetter } from '../components/MadeBetter';
import { Marquee } from '../components/Marquee';
import { Order } from '../components/Order';
import { Problem } from '../components/Problem';
import { Proof } from '../components/Proof';
import { StickyBar } from '../components/StickyBar';
import { UseCases } from '../components/UseCases';
import { WhyDifferent } from '../components/WhyDifferent';

export function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Problem />
        <HowItWorks />
        <WhyDifferent />
        <Crew />
        <UseCases />
        <MadeBetter />
        <Proof />
        <Faq />
        <Order />
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}
