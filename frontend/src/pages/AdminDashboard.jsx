import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, postsRes] = await Promise.all([
        axios.get('/admin/stats'),
        axios.get('/admin/users'),
        axios.get('/posts')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      setError('Failed to fetch admin data');
      console.error('Fetch admin data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (userId, userName) => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/users/${userId}/posts`);
      setUserPosts(response.data);
      setSelectedUser({ id: userId, name: userName });
      setActiveTab('userPosts');
    } catch (error) {
      setError('Failed to fetch user posts');
      console.error('Fetch user posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their posts.')) {
      return;
    }

    try {
      await axios.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      setPosts(posts.filter(p => p.author._id !== userId));
      // Refresh stats
      const statsRes = await axios.get('/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      setError('Failed to delete user');
      console.error('Delete user error:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`/admin/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
      // Also update userPosts if we're viewing user-specific posts
      if (activeTab === 'userPosts') {
        setUserPosts(userPosts.filter(p => p._id !== postId));
      }
      // Refresh stats
      const statsRes = await axios.get('/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      setError('Failed to delete post');
      console.error('Delete post error:', error);
    }
  };

  const handlePromoteUser = async (userId) => {
    try {
      await axios.put(`/admin/users/${userId}/promote`);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: 'admin' } : user
      ));
      // Refresh stats
      const statsRes = await axios.get('/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      setError('Failed to promote user');
      console.error('Promote user error:', error);
    }
  };

  const handleDemoteUser = async (userId) => {
    try {
      await axios.put(`/admin/users/${userId}/demote`);
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: 'user' } : u
      ));
      // Refresh stats
      const statsRes = await axios.get('/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      setError('Failed to demote user');
      console.error('Demote user error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container">
        <div className="error">Access denied. Admin privileges required.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div>Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>
      
      {error && <div className="error">{error}</div>}

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        {selectedUser && (
          <button 
            className={`tab-button ${activeTab === 'userPosts' ? 'active' : ''}`}
            onClick={() => setActiveTab('userPosts')}
          >
            {selectedUser.name}'s Posts
          </button>
        )}
      </div>

      {activeTab === 'stats' && stats && (
        <div className="admin-section">
          <h2>Platform Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Users</h4>
              <div className="stat-number">{stats.totalUsers}</div>
            </div>
            <div className="stat-card">
              <h4>Total Posts</h4>
              <div className="stat-number">{stats.totalPosts}</div>
            </div>
            <div className="stat-card">
              <h4>Total Admins</h4>
              <div className="stat-number">{stats.totalAdmins}</div>
            </div>
            <div className="stat-card">
              <h4>New Users (30 days)</h4>
              <div className="stat-number">{stats.recentUsers}</div>
            </div>
            <div className="stat-card">
              <h4>New Posts (30 days)</h4>
              <div className="stat-number">{stats.recentPosts}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>User Management</h2>
          <div className="user-list">
            {users.map(u => (
              <div key={u._id} className="user-item">
                <div className="user-info">
                  <h4>{u.name}</h4>
                  <p>{u.email}</p>
                  <p>Joined: {formatDate(u.createdAt)}</p>
                </div>
                <div className="user-actions">
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                  <button 
                    className="btn-small btn-info"
                    onClick={() => fetchUserPosts(u._id, u.name)}
                  >
                    Show Posts
                  </button>
                  {u.role === 'user' && (
                    <button 
                      className="btn-small btn-promote"
                      onClick={() => handlePromoteUser(u._id)}
                    >
                      Promote to Admin
                    </button>
                  )}
                  {u.role === 'admin' && u._id !== user.id && (
                    <button 
                      className="btn-small btn-demote"
                      onClick={() => handleDemoteUser(u._id)}
                    >
                      Demote to User
                    </button>
                  )}
                  {u._id !== user.id && (
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="admin-section">
          <h2>Post Management</h2>
          <div className="posts-list">
            {posts.map(post => (
              <div key={post._id} className="post-item">
                <div className="post-info">
                  <h4>By: {post.author.name}</h4>
                  <p className="post-content">{post.content.substring(0, 100)}...</p>
                  <p className="post-date">Posted: {formatDate(post.createdAt)}</p>
                </div>
                <div className="post-actions">
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'userPosts' && selectedUser && (
        <div className="admin-section">
          <h2>{selectedUser.name}'s Posts</h2>
          <div className="posts-list">
            {userPosts.length === 0 ? (
              <p className="no-posts">This user has no posts.</p>
            ) : (
              userPosts.map(post => (
                <div key={post._id} className="post-item">
                  <div className="post-info">
                    <h4>By: {post.author.name}</h4>
                    <p className="post-content">{post.content.substring(0, 100)}...</p>
                    <p className="post-date">Posted: {formatDate(post.createdAt)}</p>
                  </div>
                  <div className="post-actions">
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete Post
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
