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

type SchoolObject = {
  coordinates: {
    lat: number;
    long: number;
  };
  county: string;
  id: string;
  name: string;
};

// I would typically have all of these components and functions broken up into individual files
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

/**
 *
 * @param lat1 - Latitude of user
 * @param lon1 - Longitude of user
 * @param lat2 - Latitude of university
 * @param lon2 - Longitude of university
 * @returns Distance from user to university in KM
 */
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

/**
 *
 * @param deg - Difference between lat or long
 * @returns Degree between two locations
 */
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
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
  // State to hold whether user allows location privileges
  const [locationAllowed, setLocationAllowed] = useState(false);
  // State to hold user's latitude
  const [latitude, setLatitude] = useState(0);
  // State to hold user's longitude
  const [longitude, setLongitude] = useState(0);

  /**
   * Event handler that is passed to SearchBar component
   * @param searchBarInput - User input from search bar
   */
  function handleSearchBar(searchBarInput: string) {
    setSearchBarValue(searchBarInput);
  }

  /**
   * Sets latitude and longitude state if location services allowed
   */
  function getLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationAllowed(true);
        },
        function (error) {
          setLocationAllowed(false);
        }
      );
    }
  }

  // Fetches data from API and sets state
  // The actual fetch call I would typically include in a separate file
  useEffect(() => {
    /**
     * Fetches data from API and sorts it depending on location preferances
     */
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

      if (locationAllowed) {
        // Sort by location
        setSchools(
          schoolData.schools.sort((a: SchoolObject, b: SchoolObject) => {
            const latA = a.coordinates.lat;
            const longA = a.coordinates.long;
            const latB = b.coordinates.lat;
            const longB = b.coordinates.long;
            const distanceA = getDistanceFromLatLonInKm(
              latitude,
              longitude,
              latA,
              longA
            );
            const distanceB = getDistanceFromLatLonInKm(
              latitude,
              longitude,
              latB,
              longB
            );
            if (distanceA < distanceB)
              return -1; // if return -1 then sort a before b
            else if (distanceA > distanceB)
              return 1; // if return 1 then sort b before a
            else return 0; // distances equal. keep original order of a and b
          })
        );
        setFilteredSchools(
          schoolData.schools.sort((a: SchoolObject, b: SchoolObject) => {
            const latA = a.coordinates.lat;
            const longA = a.coordinates.long;
            const latB = b.coordinates.lat;
            const longB = b.coordinates.long;
            const distanceA = getDistanceFromLatLonInKm(
              latitude,
              longitude,
              latA,
              longA
            );
            const distanceB = getDistanceFromLatLonInKm(
              latitude,
              longitude,
              latB,
              longB
            );
            if (distanceA < distanceB)
              return -1; // if return -1 then sort a before b
            else if (distanceA > distanceB)
              return 1; // if return 1 then sort b before a
            else return 0; // distances equal
          })
        );
      } else {
        // Sort alphabetically
        setSchools(
          schoolData.schools.sort((a: SchoolObject, b: SchoolObject) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1; // if return -1 then sort a before b
            else if (nameA > nameB)
              return 1; // if return 1 then sort b before a
            else return 0; // names equal
          })
        );
        setFilteredSchools(
          schoolData.schools.sort((a: SchoolObject, b: SchoolObject) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1; // if return -1 then sort a before b
            else if (nameA > nameB)
              return 1; // if return 1 then sort b before a
            else return 0; // names equal
          })
        );
      }
    }
    getLocation();
    fetchSchools();
    // only want this useEffect to fire on initial render and when locationAllowed changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationAllowed]);

  // Filters array of schools based on user input
  useEffect(() => {
    setFilteredSchools(
      schools.filter((school) =>
        school.name.toLowerCase().includes(searchBarValue.toLowerCase())
      )
    );
  }, [schools, searchBarValue]);

  // Create school card for all schools included in filtered array
  // Best practice to include map function outside of return
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
