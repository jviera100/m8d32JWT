import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const JWT_SECRET = 'secreto_ultra_secreto'; // Secreto para firmar el token JWT

export default function setupMiddlewares(app) {
  // Middleware para archivos estáticos
  app.use(express.static(path.join(__dirname, '..', 'assets')));
  app.use(express.static(path.join(__dirname, '..', 'views')));
  // Middleware para el análisis de cuerpos JSON
  app.use(bodyParser.json());
  // Middleware de manejo de errores global
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Ha ocurrido un error en el servidor');
  });

  // Middleware para verificar el token JWT
  const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).send('Token no proporcionado');

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).send('Token inválido');
      req.agentEmail = decoded.email;
      next();
    });
  };

  // Función para manejar rutas restringidas
  const restrictedRoute = (req, res) => {
    res.send(`<h1>Bienvenido ${req.agentEmail} a la zona restringida</h1>`);
  };

  // Exportar middleware y funciones
  return { verifyToken, restrictedRoute };
}
