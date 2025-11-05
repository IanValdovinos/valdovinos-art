import styles from "./Portfolio.module.css";
import { useParams } from "react-router-dom";

function Portfolio() {
  const params = useParams();
  const portfolioId = params.pid;

  return <div>{portfolioId}</div>;
}

export default Portfolio;
