import { useEffect, useCallback } from "react";

// Custom hook to debounce a function call
const useDebounce = (callback: () => void, dependencies: string[], delay: number) => {
  // Created a debounced version of the callback function using useCallback
  const debouncedCallback = useCallback(() => {
    // Created a timer using setTimeout that will call the original callback after the specified delay
    const timer = setTimeout(callback, delay);

    // Return a cleanup function that clears the timer when the dependencies change
    return () => clearTimeout(timer);
  }, [callback, delay]); 

  // Use useEffect to set up the debounced callback as a side effect
  useEffect(debouncedCallback, dependencies); // The effect will re-run if any value in the dependencies array changes
};

export default useDebounce;
