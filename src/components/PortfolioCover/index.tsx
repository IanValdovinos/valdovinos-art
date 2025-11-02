import styles from "./PortfolioCover.module.css";

interface PortfolioCoverProps {
  imageUrl: string;
  title: string;
}

function PortfolioCover({ imageUrl, title }: PortfolioCoverProps) {
  return (
    <>
      <div className={styles.portfolioCover}>
        <img src={imageUrl} alt="Portfolio Cover" />
      </div>
      <h2 className={styles.portfolioTitle}>{title}</h2>
    </>
  );
}

export default PortfolioCover;
