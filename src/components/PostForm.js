import { useState } from 'react';

const PostForm = ({ postId, title, content, onSubmit }) => {
  const [formTitle, setFormTitle] = useState(title || '');
  const [formContent, setFormContent] = useState(content || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(postId ? `http://localhost:3001/api/posts/${postId}` : 'http://localhost:3001/api/posts', {
        method: postId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title: formTitle, content: formContent })
      });

      if (response.ok) {
        const newPost = await response.json();
        onSubmit(newPost);
        setFormTitle('');
        setFormContent('');
      } else {
        console.error('Error creating/updating post:', response.status);
      }
    } catch (error) {
      console.error('Error creating/updating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
        <input
          type="text"
          id="title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content:</label>
        <textarea
          id="content"
          value={formContent}
          onChange={(e) => setFormContent(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {postId ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default PostForm;