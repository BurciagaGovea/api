import express from "express";
import { createUser, getUser, updateUser, deleteUser } from "../controllers/userController.js"

const router = express.Router();

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
 */
router.get('/all', getUser);

/**
 * @swagger
 * /api/users/createUser:
 *   post:
 *     summary: Crear un usuario nuevo
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 format: email
 *                 description: Nombre del usuario
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 */
router.post('/createUser', createUser);


/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 */
router.put('/update/:id', updateUser);

/**
 * @swagger
 * /api/users/delete/{id}:
 *   put:
 *     summary: Dar de baja un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a dar de baja
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario dado de baja exitosamente
 */
router.put('/delete/:id', deleteUser);



export default router