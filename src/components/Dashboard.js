import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Suspense } from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const DashboardPage = () => {
  // You don't need to use useSession here because the ProtectedRoute handles the session context

  return (
    <Layout>
      <SessionProvider> 
        <Suspense fallback={<div>Loading...</div>}>
          {/*  The ProtectedRoute checks if there's a session and redirects if not */}
          <ProtectedRoute permission='view:dashboard' subject={1} redirectTo='/'> {/* Redirects to the login page if no session */}
            <Dashboard />
          </ProtectedRoute>
        </Suspense>
      </SessionProvider>
    </Layout>
  );
};

export default DashboardPage;