// Import styles
import styles from "./HeroSection.module.css";

function HeroSection() {
  return (
    <>
      <div className={styles.heroSection}>
        {/* Background Image */}
        <div className={styles.imageContainer}>
          <img src="/images/Valdovin University.jpg" alt="Hero Image" />
        </div>

        {/* Avatar */}
        <div className={styles.avatarContainer}>
          <img src="/images/profile_picture.jpg" alt="Avatar" />
        </div>
      </div>

      <div className={styles.nameContainer}>
        <h1 className={styles.nameContainerItem}>
          David J. Valdovinos Granados
        </h1>
        <h2 className={styles.nameContainerItem}>
          Architect | Traditional Artist | Art Teacher
        </h2>
      </div>
    </>
  );
}

export default HeroSection;
