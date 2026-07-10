import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Import backend dependencies
import connectDB from './server/config/db.js';
import app from './server/app.js';
import { seedDefaultAdmin } from './server/controllers/authController.js';
import { seedDefaultDoctors } from './server/controllers/doctorController.js';
import { seedDefaultDepartments } from './server/controllers/departmentController.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startFullStackServer() {
  console.log('Connecting to MongoDB Atlas...');
  // Connect to MongoDB Database
  await connectDB();

  console.log('Seeding initial data if collections are empty...');
  // Seed initial data
  await seedDefaultAdmin();
  await seedDefaultDoctors();
  await seedDefaultDepartments();

  // Integrated Vite + Express Middleware
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting development server (Express + Vite)...');
    
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    console.log('Starting production server (Serving compiled React frontend)...');
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static client assets
    app.use(express.static(distPath));
    
    // SPA Fallback: send index.html for any unhandled routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Single entrypoint port listening
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Full-stack server listening on http://0.0.0.0:${PORT}`);
  });
}

startFullStackServer().catch((error) => {
  console.error('Failed to start Full-Stack server:', error);
});