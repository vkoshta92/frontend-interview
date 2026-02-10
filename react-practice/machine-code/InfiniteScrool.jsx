import { useEffect, useState, useCallback } from "react";

const LIMIT = 10;

export default function InfiniteScrollExample() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${LIMIT}`
    );
    const json = await res.json();

    setData((prev) => [...prev, ...json]);
    setHasMore(json.length === LIMIT);
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setPage((p) => p + 1);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <h2>Infinite Scroll</h2>

      {data.map((item) => (
        <p key={item.id}>{item.title}</p>
      ))}

      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more data</p>}
    </div>
  );
}
