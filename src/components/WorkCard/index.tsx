import { useEffect, useState } from "react";
import styles from "./WorkCard.module.css";

interface WorkCardProps {
  data: Record<string, string>;
  parameters: string[];
}

function WorkCard({ data, parameters }: WorkCardProps) {
  const [descriptionItems, setDescriptionItems] = useState<string[]>([]);

  useEffect(() => {
    const orderedItems: string[] = [];
    parameters.forEach((param) => {
      if (data[param]) {
        orderedItems.push(param);
      }
    });
    setDescriptionItems(orderedItems);
  }, [parameters, data]);

  return (
    <div className={styles.workCard}>
      <div className={styles.imageContainer}>
        <img src={data.image_url} alt={data.title} className={styles.image} />
      </div>
      <h2 className={styles.title}>{data.title}</h2>

      {/* Work Description Parameters */}
      {descriptionItems.map((key) => {
        if (key === "title") return null;

        return (
          <p key={key} className={styles.description}>
            <strong>
              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:
            </strong>{" "}
            {data[key]}
          </p>
        );
      })}
    </div>
  );
}

export default WorkCard;
