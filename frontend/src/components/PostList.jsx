import { Link } from 'react-router-dom';

const PostList = ({ posts }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="posts-list">
      {posts.length === 0 ? (
        <div className="post">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post">
            <div className="post-header">
              <Link to={`/user/${post.author._id}`} className="post-author">
                {post.author.name}
              </Link>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
            <div className="post-content">
              {post.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;
