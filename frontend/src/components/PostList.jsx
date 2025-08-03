import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PostList = ({ posts, onPostsUpdate }) => {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState(new Set());
  
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

  const handleLike = async (postId) => {
    if (!user) return;

    try {
      // Toggle like in local state immediately for better UX
      const newLikedPosts = new Set(likedPosts);
      if (likedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      setLikedPosts(newLikedPosts);

      // Here you can add API call to backend to save the like
      // await axios.post(`/posts/${postId}/like`);
      
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert the like state if API call fails
      setLikedPosts(likedPosts);
    }
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
            {user && (
              <div className="post-actions">
                <button
                  className={`like-button ${likedPosts.has(post._id) ? 'liked' : ''}`}
                  onClick={() => handleLike(post._id)}
                >
                  <span>{likedPosts.has(post._id) ? '❤️' : '🤍'}</span>
                  <span>Like</span>
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;
