import { useState, useEffect } from "react";
import styles from "./Home.module.css";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import PortfolioCover from "../components/PortfolioCover";

interface PortfolioCover {
  imageUrl: string;
  title: string;
}

function Home() {
  // State variables for portfolio covers
  const [portfolioCovers, setPortfolioCovers] = useState<PortfolioCover[]>([]);

  useEffect(() => {
    const fetchPortfolioCovers = async () => {
      const querySnapshot = await getDocs(collection(db, "project_covers"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
      setPortfolioCovers(
        querySnapshot.docs.map((doc) => ({
          imageUrl: doc.data().image_url,
          title: doc.data().title,
        }))
      );
    };

    fetchPortfolioCovers();
  }, []);

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
