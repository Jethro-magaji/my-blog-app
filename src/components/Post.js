import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Post = ({ post }) => {
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [token, setToken] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    // Check if the user is the author or an admin
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (storedToken) {
      setShowDeleteButton(post.authorId === session?.user?.id || session?.user?.role === 'admin');
    }
  }, [post, session]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh the post list (you'll need to add logic to re-fetch posts here)
        console.log('Post deleted successfully');
      } else {
        console.error('Error deleting post:', response.status);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-700">{post.content}</p>
      {showDeleteButton && (
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Delete
        </button>
      )}
    </div>
  );
};

export default Post;