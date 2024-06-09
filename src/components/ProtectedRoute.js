import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePermission } from '@permify/react-role';

const ProtectedRoute = ({ children, permission, subject, redirectTo = '/' }) => {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        // If there's a session, check permission
        if (subject) {
          const allowed = await usePermission(permission, subject); 
          setHasAccess(allowed);
        } else {
          // No session, set hasAccess to false
          setHasAccess(false); 
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasAccess(false);
      }
    };

    // Check permissions only on the client-side
    if (typeof window !== 'undefined') { 
      checkPermission();
    }
  }, [permission, subject]); 

  // Redirect only on the client-side
  if (!hasAccess && typeof window !== 'undefined') { 
    return router.push(redirectTo); 
  }

  // Return the children if there is no session *and* it's not the initial render
  if (!subject && router.isFallback) {
    return null; // Don't render anything on the initial render if there's no session
  }

  return children; 
};

export default ProtectedRoute;