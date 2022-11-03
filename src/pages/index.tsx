import styles from "../styles/Home.module.css";

type SchoolCardProps = {
  universityName: string;
  location: string;
};

function SchoolCard(props: SchoolCardProps): JSX.Element {
  return (
    <section className={styles.schoolCard}>
      <div className={styles.initialContainer}>
        <p className={styles.initial}>
          {props.universityName.charAt(0).toUpperCase()}
        </p>
      </div>
      <h2 className={styles.h2Text}>{props.universityName}</h2>
      <p className={styles.locationText}>{props.location}</p>
    </section>
  );
}

export default function Home() {
  return (
    <main className={styles.container}>
      <h1>Pick Your School</h1>
      <SchoolCard
        universityName="Test School"
        location="Test Location"
      ></SchoolCard>
    </main>
  );
}
