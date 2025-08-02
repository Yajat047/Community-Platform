const adminAuth = (req, res, next) => {
  // Check if user is authenticated (should be used after auth middleware)
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

module.exports = adminAuth;
