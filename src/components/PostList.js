import { useState, useEffect } from 'react';
import Post from './Post';
import { Toaster, toast } from 'react-hot-toast'; 
import { useSession } from 'next-auth/react';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const { data: session } = useSession(); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/posts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        });
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('An error occurred while fetching posts. Please try again later.');
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditingPost(post);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingPost(null);
  };

  const handleUpdatePost = (updatedPost) => {
    const updatedPosts = posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    setPosts(updatedPosts);
    setEditingPostId(null);
    setEditingPost(null);
  };

  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh the post list 
        toast.success('Post deleted successfully!');
        // Fetch updated posts after deletion
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error deleting post. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster /> {/* Render the toasts */}
      <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
      <ul className="list-none p-0">
        {posts.map((post) => (
          <li key={post.id} className="mb-4">
            {editingPostId === post.id ? (
              <PostForm 
                postId={post.id}
                title={editingPost.title}
                content={editingPost.content} 
                onSubmit={handleUpdatePost}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-700">{post.content}</p>
                <div className="flex justify-end mt-2">
                  {post.authorId === session?.user?.id || session?.user?.role === 'admin' ? (
                    <>
                      <button onClick={() => handleEdit(post)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;