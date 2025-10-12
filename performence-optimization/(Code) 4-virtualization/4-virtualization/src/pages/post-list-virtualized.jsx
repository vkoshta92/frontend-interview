/* eslint-disable react/prop-types */
import axios from "axios";
import PostCard from "../components/post-card";
import {useLoaderData} from "react-router-dom";
import {FixedSizeList} from "react-window";

const PostListVirtualized = () => {
  const {data: posts} = useLoaderData();

  const Post = ({index, style}) => (
    <div style={style}>
      <PostCard key={posts[index].id} post={posts[index]} />
    </div>
  );

  return (
    <div>
      <FixedSizeList
        height={window.innerHeight}
        itemCount={posts.length}
        itemSize={190}
        width="100%"
      >
        {Post}
      </FixedSizeList>
    </div>
  );
};

export async function postLoader() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts?_limit=50"
  );

  return response;
}

export default PostListVirtualized;
