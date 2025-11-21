import { useEffect, useState } from "react";
import styles from "./PortfolioList.module.css";
import { Link } from "react-router-dom";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import PortfolioCover from "../PortfolioCover";

interface PortfolioCover {
  id: string;
  imageUrl: string;
  title: string;
}

function PortfolioList() {
  const [portfolioCovers, setPortfolioCovers] = useState<PortfolioCover[]>([]);

  useEffect(() => {
    const fetchPortfolioCovers = async () => {
      const querySnapshot = await getDocs(collection(db, "portfolios"));

      setPortfolioCovers(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageUrl: doc.data().image_url,
          title: doc.data().title,
        }))
      );
    };

    fetchPortfolioCovers();
  }, []);

  return (
    <div className={styles.portfolioSection}>
      {portfolioCovers.map((portfolio) => (
        <Link to={`/portfolio/${portfolio.id}`} key={portfolio.id}>
          <PortfolioCover
            imageUrl={portfolio.imageUrl}
            title={portfolio.title}
          />
        </Link>
      ))}
    </div>
  );
}

export default PortfolioList;
