import { Router } from 'express';
import { homeControl, inicioSesionControl,dashboardControl } from '../src/controllers/controller.js';

const router = Router();

router.get('/', homeControl);
router.get('/signIn', inicioSesionControl);
router.get('/dashboard',dashboardControl)

export default router;
