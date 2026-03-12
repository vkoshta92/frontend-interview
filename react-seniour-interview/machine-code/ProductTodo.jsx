import { useEffect, useState, useCallback } from "react";

const LIMIT = 10;

export default function ProductTodo() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${LIMIT}`
    );
    const data = await res.json();

    setItems((prev) => [...prev, ...data]);
    setHasMore(data.length === LIMIT);
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Infinite scroll
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

  // Filter logic
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  // Edit item
  const updateItem = (id, newTitle) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item
      )
    );
  };

  return (
    <div>
      <h2>E-commerce Todo List</h2>

      {/* Filter */}
      <input
        placeholder="Search item"
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* List */}
      {filteredItems.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          onUpdate={updateItem}
        />
      ))}

      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more items</p>}
    </div>
  );
}
