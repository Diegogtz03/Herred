import express, { Request, Response } from 'express';
import exampleRoutes from './routes/example';

const app = express();
const port = process.env.PORT || 3000;

app.use('/api', exampleRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});