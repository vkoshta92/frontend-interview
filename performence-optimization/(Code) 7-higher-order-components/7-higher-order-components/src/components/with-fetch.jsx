import {useEffect, useState} from "react";

const withFetch =
  (url, options = {method: "GET"}) =>
  (WrappedComponent) => {
    const FetchComponent = (props) => {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const response = await fetch(url, {...options});
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const result = await response.json();
            setData(result);
          } catch (error) {
            setError(error);
          } finally {
            setLoading(false);
          }
        };

        if (url) {
          fetchData();
        }
      }, [url]);

      return (
        <WrappedComponent
          {...props}
          data={data}
          loading={loading}
          error={error}
        />
      );
    };

    return FetchComponent;
  };

export default withFetch;
