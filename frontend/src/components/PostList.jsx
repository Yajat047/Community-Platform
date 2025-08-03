import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PostList = ({ posts }) => {
  const { user } = useAuth();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              {user && post.author._id === user.id ? (
                <Link to="/profile" className="post-author">
                  {post.author.name}
                </Link>
              ) : (
                <Link to={`/user/${post.author._id}`} className="post-author">
                  {post.author.name}
                </Link>
              )}
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
