import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Make a request to your backend API to authenticate the user
        try {
          const response = await fetch('http://localhost:3001/api/login', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials) 
          });

          if (response.ok) {
            const data = await response.json();
            // Check if data was returned from the backend
            if (data && data.userId && data.role && data.name && data.email) { 
              return {
                id: data.userId, 
                email: data.email,
                role: data.role,
                name: data.name
              }; 
            } else {
              // Handle case where backend response is invalid
              console.error('Invalid user data received from backend.');
              return null; 
            }
          } else {
            // Handle errors from the backend (e.g., incorrect credentials)
            console.error('Authentication error:', response.status);
            return null; // Return null if the credentials are incorrect
          }
        } catch (error) {
          console.error('Error making authentication request:', error);
          return null; // Return null if the request fails
        }
      },
    }),
  ],
  // No need to specify session strategy anymore
  callbacks: {
    // Session callback 
    session: async ({ session, token }) => {
      // Ensure the session has user data
      if (token.id && token.role) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  }
});