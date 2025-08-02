import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      setPosts(response.data);
    } catch (error) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  if (loading) {
    return <div className="container">Loading posts...</div>;
  }

  return (
    <div className="container">
      <h1>Welcome to Community Platform</h1>
      
      {user && (
        <>
          <h2>Share Your Thoughts</h2>
          <PostForm onPostCreated={handlePostCreated} />
        </>
      )}
      
      <h2>Recent Posts</h2>
      {error && <div className="error">{error}</div>}
      <PostList posts={posts} />
    </div>
  );
};

export default Home;
