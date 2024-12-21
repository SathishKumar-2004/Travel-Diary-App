import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", data = null, headers = {}) => {
      setIsLoading(true);
      const cancelTokenSource = axios.CancelToken.source();
      activeHttpRequests.current.push(cancelTokenSource);

      try {
        const response = await axios({
          url,
          method,
          data,
          headers,
          cancelToken: cancelTokenSource.token,
        });

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (source) => source !== cancelTokenSource
        );

        setIsLoading(false);
        return response.data;
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          setError(err.response.data.message || "Something went wrong!");
        }
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((cancelTokenSource) =>
        cancelTokenSource.cancel("Operation canceled by the user.")
      );
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
