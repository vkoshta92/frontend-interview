import useFetch from "../hooks/use-fetch";

const PostList = () => {
  const {data, loading, error} = useFetch(
    "https://jsonplaceholder.typicode.com/posts"
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h4>Post List</h4>
      {data && (
        <ul>
          {data.slice(0, 5).map((post) => (
            <li key={post.id}>
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
