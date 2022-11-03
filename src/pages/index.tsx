import styles from "../styles/Home.module.css";
import { useState } from "react";
import Image from "next/image";

type SchoolCardProps = {
  universityName: string;
  location: string;
};

type SearchBarProps = {
  searchBarValue: string;
  handleSearchBarValue: (searchBarInput: string) => void;
};

// I would typically have all of these components broken up into individual files
// but requirements requested everything be done in the index.tsx file.

// I would also typically have all component CSS styles in individual module files
// but requirements requested everything be done in the Home.module.css file

// I moved the svg files into the public folder as this is easier to integrate
// with the Next.js Image component.

// I created a custom _document.tsx file as a general template for the Next.js page. The primary
// purpose was to add the html=en tag as well as import the Poppins font from Google fonts. This
// is the recommended best practice from the Next.js docs.

/**
 * React controlled input (State handled by parent React Container instead of HTML DOM. Best practice)
 * https://reactjs.org/docs/forms.html#controlled-components
 * @param universityName - University name from API
 * @param location - Location from API
 * @returns Search bar for user to search through universities returned from API
 */
function SearchBar(props: SearchBarProps): JSX.Element {
  return (
    <div className={styles.searchBarContainer}>
      <Image
        src="/search.svg"
        alt="Magnifying glass for search bar"
        width={18}
        height={19}
      />
      <input
        type="text"
        placeholder="Search for your school..."
        value={props.searchBarValue}
        onChange={(e) => {
          props.handleSearchBarValue(e.target.value);
        }}
        className={styles.searchBar}
      ></input>
    </div>
  );
}

/**
 *
 * @param searchBarValue - Current value of search bar. This is held in React state in Home component
 * @param handleSearchBarValue - Updates search bar state in Home component
 * @returns School card component with info received from API
 */
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
  const [searchBarValue, setSearchBarValue] = useState("");

  /**
   * Event handler that is passed to SearchBar component
   * @param searchBarInput - User input from search bar
   */
  function handleSearchBar(searchBarInput: string) {
    setSearchBarValue(searchBarInput);
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Image src="/logo.svg" alt="Beacon logo" width={27} height={22} />
        <p>BEACON</p>
      </header>
      <h1>Pick Your School</h1>
      <SearchBar
        searchBarValue={searchBarValue}
        handleSearchBarValue={handleSearchBar}
      />
      <SchoolCard
        universityName="Test School"
        location="Test Location"
      ></SchoolCard>
    </main>
  );
}
