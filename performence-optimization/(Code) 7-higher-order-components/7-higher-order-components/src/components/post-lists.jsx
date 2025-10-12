/* eslint-disable react/prop-types */

import withFetch from "./with-fetch";

const PostList = ({data, loading, error}) => {
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

export default withFetch("https://jsonplaceholder.typicode.com/posts")(
  PostList
);
