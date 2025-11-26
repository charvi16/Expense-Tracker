import { useState, useEffect } from "react";
import API from "../api/axios";

export default function useFetch(url) {
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(url)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
}
