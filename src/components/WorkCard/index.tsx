import styles from "./WorkCard.module.css";

interface WorkCardProps {
  title: string;
  imageUrl: string;
  date?: string;
  measurements?: string;
  technique?: string;
  description?: string;
}

function WorkCard({
  title,
  imageUrl,
  date,
  measurements,
  technique,
  description,
}: WorkCardProps) {
  return (
    <div className={styles.workCard}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} className={styles.image} />
      </div>
      <h2 className={styles.title}>{title}</h2>
      {date && <p className={styles.date}>{date}</p>}
      {measurements && <p className={styles.measurements}>{measurements}</p>}
      {technique && <p className={styles.technique}>{technique}</p>}
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}

export default WorkCard;
