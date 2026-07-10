import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import { seedDefaultAdmin } from './controllers/authController.js';
import { seedDefaultDoctors } from './controllers/doctorController.js';
import { seedDefaultDepartments } from './controllers/departmentController.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Seed default data if database is empty
  await seedDefaultAdmin();
  await seedDefaultDoctors();
  await seedDefaultDepartments();

  // Start Express Listening
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
