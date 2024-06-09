const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const permify = require('@permify/permify-node');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3001; 

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize Permify Client
const client = new permify.grpc.newClient({
    endpoint: 'localhost:3478', // Replace with your Permify server endpoint
});

// Mock database (In real world, you'd use a database)
let posts = [
  { id: 1, title: 'First Post', content: 'This is the first post.', authorId: 1 },
  { id: 2, title: 'Second Post', content: 'Another blog post!', authorId: 2 },
  // ... more posts
];

// Mock user data (in real world, you'd use a database)
const users = {
  1: { id: 1, email: 'user@example.com', password: 'password123', role: 'editor' }, // Editor role
  2: { id: 2, email: 'admin@example.com', password: 'admin123', role: 'admin' }  // Admin role
};

// Authentication Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users[email];

  if (user && user.password === password) {
    // Return the user data, NextAuth.js will handle the session
    res.json({ userId: user.id, role: user.role, name: user.name, email: user.email }); // Send back the user data
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

// Route: Get All Posts
app.get('/api/posts', async (req, res) => {
  // All users can view posts
  res.json(posts);
});

// Route: Create New Post
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  
  // Check permission using Permify 
  try {
    const permissionResult = await client.permission.check({
      tenantId: 't1', // Replace with your tenant ID
      metadata: { schemaVersion: 'cpi73hpisfs3ioefk1ag' },
      entity: { type: 'post' },
      permission: 'create',
      subject: { type: 'user', id: req.body.userId } 
    });

    if (permissionResult.can === permify.grpc.PermissionCheckResponse_Result.RESULT_ALLOWED) {
      const newPost = {
        id: posts.length + 1,
        title,
        content,
        authorId: req.body.userId,
      };
      posts.push(newPost);
      res.json(newPost);
    } else {
      res.status(403).send({ message: 'Forbidden: You do not have permission to create posts.' }); 
    }
  } catch (error) {
    console.error('Error checking Permify permission:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

// Route: Update Post
app.put('/api/posts/:postId', async (req, res) => {
  const postId = parseInt(req.params.postId);
  const { title, content } = req.body;
  const index = posts.findIndex(post => post.id === postId);

  if (index !== -1) {
    // Check permission using Permify
    try {
      const permissionResult = await client.permission.check({
        tenantId: 't1', // Replace with your tenant ID
        metadata: { schemaVersion: 'cpi73hpisfs3ioefk1ag' },
        entity: { type: 'post', id: postId },
        permission: 'edit',
        subject: { type: 'user', id: req.body.userId } 
      });

      if (permissionResult.can === permify.grpc.PermissionCheckResponse_Result.RESULT_ALLOWED) {
        posts[index] = { ...posts[index], title, content };
        res.json(posts[index]);
      } else {
        res.status(403).send({ message: 'Forbidden: You do not have permission to edit this post.' }); 
      }
    } catch (error) {
      console.error('Error checking Permify permission:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  } else {
    res.status(404).send({ message: 'Post not found.' }); 
  }
});

// Route: Delete Post
app.delete('/api/posts/:postId', async (req, res) => {
  const postId = parseInt(req.params.postId);
  const index = posts.findIndex(post => post.id === postId);

  if (index !== -1) {
    // Check permission using Permify
    try {
      const permissionResult = await client.permission.check({
        tenantId: 't1', // Replace with your tenant ID
        metadata: { schemaVersion: 'cpi73hpisfs3ioefk1ag' },
        entity: { type: 'post', id: postId },
        permission: 'delete',
        subject: { type: 'user', id: req.body.userId } 
      });

      if (permissionResult.can === permify.grpc.PermissionCheckResponse_Result.RESULT_ALLOWED) {
        posts.splice(index, 1);
        res.json({ message: 'Post deleted' });
      } else {
        res.status(403).send({ message: 'Forbidden: You do not have permission to delete this post.' }); 
      }
    } catch (error) {
      console.error('Error checking Permify permission:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  } else {
    res.status(404).send({ message: 'Post not found.' }); 
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});