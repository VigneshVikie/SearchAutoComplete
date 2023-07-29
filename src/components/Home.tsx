// Import the useState hook from React to manage state variables
import { useState } from "react";
// Import the custom hook "useDebounce" from "../hooks/useDebounce" to debounce API requests
import useDebounce from "../hooks/useDebounce";

import API_ENDPOINTS from "../constants";


// Define the type for the search result objects
type searchResult = {
  id: number;
  firstName: string;
};

// The Home component starts here
const Home = () => {
  // State variables to manage the search input, search results, error message, and loading state
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<searchResult[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Function to fetch search results from the server
  const fetchSearch = async () => {
    // Set loading to true to show loading message
    setLoading(true);
    
    // Create the API request URL using the API_ENDPOINTS constant and the search input
    const reqUrl = `${API_ENDPOINTS.search}?q=${search}`;
    
    // Make the API call using the fetch function
    const res = await fetch(reqUrl, { method: "GET" });
    
    // Parse the response data as JSON
    const data = await res.json();
    
    // Check if the response contains the "users" property
    if (data?.users) {
      // Filter the users array based on the search input (case-insensitive)
      const filteredArr = data?.users?.filter((item: searchResult) =>
        item?.firstName.toLowerCase().startsWith(search.toLowerCase())
      );
      // Update the searchResult state with the filtered array
      setSearchResult(filteredArr);
    }
    
    // Set loading to false after fetching is done
    setLoading(false);
  };

  // Function to handle changes in the search input
  const handleSearch = (value: string) => {
    // Regular expression to allow only alphabets and spaces
    const regex = /^[A-Za-z\s]*$/;
    if (value.match(regex)) {
      // If the input is valid, update the search state and clear any error message
      setSearch(value);
      setError("");
    } else {
      // If the input contains numerics or special characters, clear the search state and show an error message
      setSearch("");
      setError("Numerics and special characters are not allowed");
    }
  };

  // Use the custom "useDebounce" hook to debounce the fetchSearch function with a delay of 500ms
  useDebounce(fetchSearch, [search], 500);

  return (
    <div className="wrapper">
      <h1 style={{ color: "#15357a", fontSize: "32px" }}>deel.</h1>
      
      {/* Search input */}
      <input
        type="search"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="searchBox"
        placeholder="Search the available Users"
      />
      
      {/* Loading message */}
      {loading && (
        <p style={{ position: "fixed", marginTop: "30px", color: "#15357a", fontSize: "24px" }}>Loading....</p>
      )}
      
      {/* Error message */}
      {error && (
        <p style={{ position: "fixed" }}>{error}</p>
      )}
      
      {/* Display search results */}
      <div className="resultwrapper">
        {search?.length > 0 &&
          searchResult?.map((user) => (
            <div className="searchResults" key={user.id}>
              {user.firstName}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
