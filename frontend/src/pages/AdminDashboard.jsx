import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

// Modal Component
const UserPostsModal = ({ isOpen, user, posts, loading, onClose, onDeletePost, formatDate }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Posts by {user?.name}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        
        <div className="modal-content">
          {loading ? (
            <div className="modal-loading">
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="modal-empty">
              <p>This user hasn't created any posts yet.</p>
            </div>
          ) : (
            <div className="modal-posts-list">
              {posts.map(post => (
                <div key={post._id} className="modal-post-item">
                  <div className="modal-post-content">
                    <h4>{post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}</h4>
                    <p className="modal-post-date">
                      Posted on {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <div className="modal-post-actions">
                    <button 
                      className="btn-delete-post"
                      onClick={() => onDeletePost(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalUserPosts, setModalUserPosts] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
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

  const showUserPosts = async (user) => {
    setModalUser(user);
    setModalOpen(true);
    setModalLoading(true);
    
    try {
      const response = await axios.get(`/admin/users/${user._id}/posts`);
      setModalUserPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setError('Failed to load user posts');
      setModalUserPosts([]);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalUser(null);
    setModalUserPosts([]);
    setModalLoading(false);
  };

  const deletePostFromModal = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`/admin/posts/${postId}`);
      // Update the modal posts list
      setModalUserPosts(modalUserPosts.filter(p => p._id !== postId));
      // Update the main posts list
      setPosts(posts.filter(p => p._id !== postId));
      // Refresh stats
      const statsRes = await axios.get('/admin/stats');
      setStats(statsRes.data);
    } catch (error) {
      setError('Failed to delete post');
      console.error('Delete post error:', error);
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
                    onClick={() => showUserPosts(u)}
                  >
                    View Posts
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

      <UserPostsModal
        isOpen={modalOpen}
        user={modalUser}
        posts={modalUserPosts}
        loading={modalLoading}
        onClose={closeModal}
        onDeletePost={deletePostFromModal}
        formatDate={formatDate}
      />
    </div>
  );
};

export default AdminDashboard;
