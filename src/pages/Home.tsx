import { Outlet } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.home}>
      <Outlet />
    </div>
  );
}

export default Home;
