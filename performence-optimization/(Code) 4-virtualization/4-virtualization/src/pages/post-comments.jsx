import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

const PostComments = () => {
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const {postId} = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`),
        axios.get(
          `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
        ),
      ]);

      setPost(postResponse.data);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {post && (
            <div className="post-card">
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
          )}
          <h2>Comments</h2>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <strong>{comment.name}</strong>: {comment.body}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default PostComments;
