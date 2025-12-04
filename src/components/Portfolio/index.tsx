import { useState, useEffect } from "react";
import styles from "./Portfolio.module.css";
import { useParams } from "react-router-dom";

import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

import WorkCard from "../WorkCard";

function Portfolio() {
  const [works, setWorks] = useState<Record<string, string>[]>([]);
  const [workParameters, setWorkParameters] = useState<string[]>([]);
  const params = useParams();
  const portfolioId = params.pid;

  // Fetch works from Firestore
  useEffect(() => {
    const fetchWorks = async () => {
      const querySnapshot = await getDocs(
        collection(db, "portfolios", portfolioId!, "works")
      );

      setWorks(querySnapshot.docs.map((doc) => doc.data()));
    };

    const fetchWorkParameters = async () => {
      const querySnapshot = await getDoc(doc(db, "portfolios", portfolioId!));
      setWorkParameters(querySnapshot.data()?.work_parameters || []);
    };

    fetchWorks();
    fetchWorkParameters();
  }, [portfolioId]);

  return (
    <div className={styles.portfolioContainer}>
      {works.map((work) => (
        <WorkCard key={work.title} data={work} />
      ))}
    </div>
  );
}

export default Portfolio;
