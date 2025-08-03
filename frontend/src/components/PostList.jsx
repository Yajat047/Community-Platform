import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PostList = ({ posts, onPostsUpdate }) => {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  
  // Load like status for all posts when component mounts or posts change
  useEffect(() => {
    const loadLikeStatus = async () => {
      if (!user || !posts.length) return;
      
      try {
        const likePromises = posts.map(async (post) => {
          const response = await axios.get(`/posts/${post._id}/like-status`);
          return { postId: post._id, ...response.data };
        });
        
        const likeStatuses = await Promise.all(likePromises);
        const newLikedPosts = new Set();
        const newLikeCounts = {};
        
        likeStatuses.forEach(({ postId, isLiked, likeCount }) => {
          if (isLiked) {
            newLikedPosts.add(postId);
          }
          newLikeCounts[postId] = likeCount;
        });
        
        setLikedPosts(newLikedPosts);
        setLikeCounts(newLikeCounts);
      } catch (error) {
        console.error('Error loading like status:', error);
      }
    };
    
    loadLikeStatus();
  }, [posts, user]);
  
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
      const newLikeCounts = { ...likeCounts };
      const wasLiked = likedPosts.has(postId);
      
      if (wasLiked) {
        newLikedPosts.delete(postId);
        newLikeCounts[postId] = Math.max(0, (newLikeCounts[postId] || 0) - 1);
      } else {
        newLikedPosts.add(postId);
        newLikeCounts[postId] = (newLikeCounts[postId] || 0) + 1;
      }
      
      setLikedPosts(newLikedPosts);
      setLikeCounts(newLikeCounts);

      // Make API call to backend to save the like
      const response = await axios.post(`/posts/${postId}/like`);
      
      // Update with server response to ensure consistency
      if (response.data.isLiked) {
        newLikedPosts.add(postId);
      } else {
        newLikedPosts.delete(postId);
      }
      newLikeCounts[postId] = response.data.likeCount;
      
      setLikedPosts(new Set(newLikedPosts));
      setLikeCounts({ ...newLikeCounts });
      
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert the like state if API call fails
      const revertedLikedPosts = new Set(likedPosts);
      const revertedLikeCounts = { ...likeCounts };
      
      if (likedPosts.has(postId)) {
        revertedLikedPosts.add(postId);
      } else {
        revertedLikedPosts.delete(postId);
      }
      
      setLikedPosts(revertedLikedPosts);
      setLikeCounts(revertedLikeCounts);
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
                  <span>Like {likeCounts[post._id] > 0 && `(${likeCounts[post._id]})`}</span>
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
