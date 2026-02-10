import { useEffect, useState } from "react";

const LIMIT = 10;

export default function PaginationExample() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${LIMIT}`
      );
      const json = await res.json();

      setData(json);
      setLoading(false);
    };

    fetchData();
  }, [page]);

  return (
    <div>
      <h2>Pagination</h2>

      {data.map((item) => (
        <p key={item.id}>{item.title}</p>
      ))}

      {loading && <p>Loading...</p>}

      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Prev
      </button>

      <span> Page {page} </span>

      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
