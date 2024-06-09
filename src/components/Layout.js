import Head from 'next/head';
import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>My Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md">
        <div className="container mx-auto py-4">
          <h1 className="text-3xl font-bold text-center">My Blog</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {children}
      </main>

      <footer className="bg-gray-200 text-center py-4">
        <p className="text-gray-700">© 2023 My Blog</p>
      </footer>
    </div>
  );
};

export default Layout;