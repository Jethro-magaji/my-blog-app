import { useState, useEffect } from 'react'; // Import useState and useEffect
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import PostList from '../components/PostList';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router'; // Import useRouter

const Home = () => {
  const router = useRouter(); 
  const [user, setUser] = useState(null); 

  useEffect(() => {
    // Get user data from local storage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // useEffect to handle the case when the user logs out
  useEffect(() => {
    const handleRouteChange = () => {
      // Check if the user is logged out (user is null)
      if (!user) {
        // Redirect to the login page if not logged in
        router.push('/login');
      }
    };

    // Add a listener for route changes
    router.events.on('routeChangeStart', handleRouteChange);

    // Remove the listener when the component unmounts
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, user]);

  return (
    <Layout>
      {/*  The ProtectedRoute checks if there's a session and redirects if not */}
      <ProtectedRoute permission='view:dashboard' subject={user?.id} redirectTo='/'> 
        <div>
          {/* Only render the Dashboard if the ProtectedRoute resolves to true */}
          {user && <Dashboard />}
        </div>
      </ProtectedRoute>
      <PostList />
    </Layout>
  );
};

export default Home;