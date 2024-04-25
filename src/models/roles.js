// roles.js

// Definimos los roles de los agentes
const roles = {
    admin: ['create', 'read', 'update', 'delete'], // Rol de administrador con todos los permisos
    supervisor: ['read', 'update'], // Rol de supervisor con permisos de lectura y actualización
    agent: ['read'] // Rol de agente con permiso de lectura solamente
  };
  
  export default roles;
  