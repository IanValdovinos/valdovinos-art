import styles from "./WorkCard.module.css";

interface WorkCardProps {
  data: Record<string, string>;
}

function WorkCard({ data }: WorkCardProps) {
  return (
    <div className={styles.workCard}>
      <div className={styles.imageContainer}>
        <img src={data.image_url} alt={data.title} className={styles.image} />
      </div>
      <h2 className={styles.title}>{data.title}</h2>

      {/* Work Description Parameters */}
      {Object.entries(data).map(([key, value]) => {
        if (key !== "title" && key !== "image_url" && key !== "thumbnail_url") {
          return (
            <p key={key} className={styles.description}>
              <strong>
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                :
              </strong>{" "}
              {value}
            </p>
          );
        }
      })}
    </div>
  );
}

export default WorkCard;
