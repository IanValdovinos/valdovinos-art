import { useState, useEffect } from "react";
import styles from "./Portfolio.module.css";
import { useParams } from "react-router-dom";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import WorkCard from "../WorkCard";

interface Work {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  measurements: string;
  technique: string;
}

function Portfolio() {
  const [works, setWorks] = useState<Work[]>([]);
  const params = useParams();
  const portfolioId = params.pid;

  useEffect(() => {
    const fetchWorks = async () => {
      const querySnapshot = await getDocs(
        collection(db, "portfolios", portfolioId!, "works")
      );
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
      setWorks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageUrl: doc.data().image_url,
          title: doc.data().title,
          date: doc.data().date,
          measurements: doc.data().measurements,
          technique: doc.data().technique,
        }))
      );
    };

    fetchWorks();
  }, [portfolioId]);

  return (
    <div>
      {works.map((work) => (
        <WorkCard
          key={work.id}
          title={work.title}
          imageUrl={work.imageUrl}
          date={work.date}
          measurements={work.measurements}
          technique={work.technique}
        />
      ))}
    </div>
  );
}

export default Portfolio;
