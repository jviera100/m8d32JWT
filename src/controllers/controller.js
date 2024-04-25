// agents.js

import path from "path";
import jwt from "jsonwebtoken";
import { agents } from "../models/agentes.js";
import { roles } from "../models/roles.js"; // Roles de los agentes
import { permissions } from "../models/permissions.js"; // Permisos de los agentes

process.loadEnvFile();

const __dirname = import.meta.dirname;
const secretKey = process.env.SECRET_KEY;

// Función para manejar el inicio de sesión de los agentes
const inicioSesionControl = (req, res) => {
  try {
    const { email, password } = req.query;
    const agent = agents.find((agent) => {
      return agent.email === email && agent.password === password;
    });

    if (!agent) {
      res.send("Usuario o contraseña incorrecta!");
      return;
    }

    const { role } = agent;
    const permissionsForRole = roles[role].map(permission => permissions[permission]);

    // Genera un token JWT con el correo electrónico, rol y permisos del agente
    let token = jwt.sign({ email, role, permissions: permissionsForRole }, secretKey, { expiresIn: "2m" });
    
    // Envía la respuesta al cliente con el token y una página de bienvenida
    res.send(`<p> Agente autenticado, bienvenido <b>${email}</b>
      Su token está en el sessionStorage </p>
      <a href="/dashboard?token=${token}"> Ir al Dashboard</a>
      <script>
        // Guarda el token en el sessionStorage para usarlo en futuras solicitudes
        sessionStorage.setItem('token', JSON.stringify("${token}"))
      </script>`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error en el servidor");
  }
};

// Función para mostrar el dashboard de los agentes autenticados
const dashboardControl = (req, res) => {
  try {
    const { token } = req.query;
    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        res.status(401).send(`ALERTA ALERTA AGENTES ARRIBANDO A SU POSICION ${err.message}`);
        return;
      }

      // Obtener el rol del agente desde el token decodificado
      const { role } = data;

      // Servir la vista correspondiente según el rol del agente
      let dashboardView;
      if (role === 'admin') {
        dashboardView = 'admin.html';
      } else if (role === 'supervisor') {
        dashboardView = 'supervisor.html';
      } else if (role === 'agent') {
        dashboardView = 'agent.html';
      } else {
        dashboardView = 'default.html';
      }

      // Enviar la vista correspondiente al cliente
      res.sendFile(path.join(__dirname, `../views/${dashboardView}`));
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error en el servidor");
  }
};


// Función para mostrar la página de inicio
const homeControl = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
};

export { inicioSesionControl, dashboardControl, homeControl };
