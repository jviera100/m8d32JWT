import express from 'express';
import router from './routes/routes.js';
import setupMiddlewares from './middlewares/middlewares.js';
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
// Configuración de la carpeta estática y los middlewares
setupMiddlewares(app);
//Routes
app.use('/', router);

app.listen(PORT, () => console.log(`Servidor corriendo en port http://localhost:${PORT}`));