import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
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
  // State to hold original array of schools returned from API
  // Initial values of loading for UI before API returns response
  const [schools, setSchools] = useState([
    { id: 0, name: "loading", county: "loading" },
  ]);
  // State to hold filtered school array returned from search bar
  // Initial values of loading for UI before API returns response
  const [filteredSchools, setFilteredSchools] = useState([
    { id: 0, name: "loading", county: "loading" },
  ]);

  // Fetches data from API and sets state
  useEffect(() => {
    async function fetchSchools() {
      const res = await fetch("https://api.sendbeacon.com/team/schools");

      // Checks for valid response
      if (!res || res.status !== 200) {
        setSchools([
          { id: 0, name: "failed to load", county: "failed to load" },
        ]);
      }
      const schoolData = await res.json();

      // Checks that response payload is valid
      // Possible improvement: Add JSON schema check to ensure API returns expected data structure
      if (!schoolData) {
        setSchools([
          { id: 0, name: "failed to load", county: "failed to load" },
        ]);
      }

      setSchools(schoolData.schools);
      setFilteredSchools(schoolData.schools);
    }
    fetchSchools();
  }, []);

  /**
   * Event handler that is passed to SearchBar component
   * @param searchBarInput - User input from search bar
   */
  function handleSearchBar(searchBarInput: string) {
    setSearchBarValue(searchBarInput);
    setFilteredSchools(
      schools.filter((school) =>
        school.name.toLowerCase().includes(searchBarValue.toLowerCase())
      )
    );
  }

  // Create school card for all schools included in filtered array
  const schoolCards = filteredSchools.map((school) => (
    <SchoolCard
      key={school.id}
      universityName={school.name}
      location={school.county}
    />
  ));

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
      <div className={styles.schoolCardContainer}>{schoolCards}</div>
    </main>
  );
}
