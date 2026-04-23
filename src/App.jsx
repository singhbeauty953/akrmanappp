import LogoBar      from './components/LogoBar';
import Navbar       from './components/Navbar';
import NewsPart1    from './components/NewsPart1';
import Subscription from './components/Subscription';
import PrimeArticle from './components/PrimeArticle';
import PremiumNewsSection from './components/PremiumNewsSection';
import NewsSection  from './components/NewsSection';
import Footer       from './components/Footer';
import { section1Cards, section2Cards, section3Cards } from './data/newsData';
import './App.css';

export default function App() {
  return (
    <>
      {/* 1. Logo */}
      <LogoBar />

      {/* 2. Navbar */}
      <Navbar />

      {/* 3. News Part 1 – Breaking + Featured */}
      <NewsPart1 />

      {/* 4. Subscription */}
      <Subscription />

      {/* 5. Prime Article – Ayurveda */}
      <PrimeArticle />

      {/* 6. Premium News Section */}
      <PremiumNewsSection />

      {/* 7. Main News Section 1 – भारत और विश्व */}
      <NewsSection
        id="section1"
        icon="🌏"
        title="भारत और विश्व"
        cards={section1Cards}
      />

      {/* 8. Main News Section 2 – स्वास्थ्य और जीवनशैली */}
      <NewsSection
        id="section2"
        icon="❤️"
        title="स्वास्थ्य और जीवनशैली"
        cards={section2Cards}
        altBg
        layout="mixed"
      />

      {/* 9. Main News Section 3 – तकनीक, खेल और व्यापार */}
      <NewsSection
        id="section3"
        icon="🚀"
        title="तकनीक, खेल और व्यापार"
        cards={section3Cards}
      />

      {/* Footer */}
      <Footer />
    </>
  );
}
