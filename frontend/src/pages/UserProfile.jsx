import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostList from '../components/PostList';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userResponse, postsResponse] = await Promise.all([
        axios.get(`/users/${userId}`),
        axios.get(`/posts/user/${userId}`)
      ]);
      
      setUser(userResponse.data);
      setPosts(postsResponse.data);
    } catch (error) {
      setError('Failed to load user profile');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="container">Loading user profile...</div>;
  }

  if (error) {
    return <div className="container"><div className="error">{error}</div></div>;
  }

  if (!user) {
    return <div className="container"><div className="error">User not found</div></div>;
  }

  return (
    <div className="container">
      <div className="profile-header">
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
        {user.bio && <p className="profile-bio">{user.bio}</p>}
        <p className="profile-email">Joined {formatDate(user.createdAt)}</p>
      </div>

      <h2>{user.name}'s Posts ({posts.length})</h2>
      <PostList posts={posts} />
    </div>
  );
};

export default UserProfile;
