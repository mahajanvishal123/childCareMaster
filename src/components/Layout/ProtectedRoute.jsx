const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem('role'); // Prefer using context or token decode
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;

