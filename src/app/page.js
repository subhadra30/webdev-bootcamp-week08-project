import styles from "./page.module.css";

export default async function HomePage() {
  return (
    <div className={styles.homepage}>
      <h3>Welcome to Scribble Board</h3>
      <p>
        Here is a single stop platform for all enthusiasts where one can find
        blogs about various topics, add your own and express your opinions on
        any blog posted.
      </p>
    </div>
  );
}
