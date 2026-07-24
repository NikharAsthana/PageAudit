import { useState, useCallback } from "react";
import { fetchAudit } from "../services/api.js";

/*
In React, useState manages a component's local data state and 
triggers re-renders on changes, 
while useCallback caches (memoizes) a function definition to 
maintain a stable reference across those re-renders 
*/

export function useAudit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitAudit = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchAudit(url);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, submitAudit };
}
