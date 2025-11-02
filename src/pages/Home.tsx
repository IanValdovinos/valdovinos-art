import styles from "./Home.module.css";
import PortfolioCover from "../components/PortfolioCover";

function Home() {
  const portfolioCovers = [
    {
      imageUrl: "/images/traditional_art_portfolio_cover_image.jpg",
      title: "Traditional Art Portfolio",
    },
    {
      imageUrl: "/images/traditional_art_portfolio_cover_image.jpg",
      title: "Traditional Art Portfolio",
    },
    {
      imageUrl: "/images/traditional_art_portfolio_cover_image.jpg",
      title: "Traditional Art Portfolio",
    },
  ];

  return (
    <div className={styles.home}>
      <div className={styles.portfolioSection}>
        {portfolioCovers.map((portfolio, index) => (
          <PortfolioCover
            key={index}
            imageUrl={portfolio.imageUrl}
            title={portfolio.title}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
