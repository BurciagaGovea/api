import User from "../models/userModel.js";
import { userCreatedEvent } from "../services/rabbitServicesEvent.js";
import jwt from 'jsonwebtoken';

export const getUser = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al listar usuarios: ', error);
        res.status(500)
            .json({ message: 'Error al obtener los usuarios' });
    }
};

export const createUser = async (req, res) => {
    const { password, username, phone } = req.body;

    if (!phone || !username) {
        return res.status(400).json({ mensaje: 'Teléfono y correo son obligatorios' });
    } 

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ mensaje: 'Este usuario ya existe' });
    }

    if (phone.length > 10) {
        return res.status(400).json({ mensaje: 'El número de teléfono debe contener 10 dígitos máximo' });
    }

    if (password.length < 8) {
        return res.status(400).json({ mensaje: 'La contraseña debe contener mínimo 8 caracteres' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof username !== "string" || username.trim() === "" || !emailRegex.test(username)) {
        return res.status(400).json({ mensaje: 'Formato de correo no válido' });
    }

    try {
        const newUser = await User.create({
            phone,
            username,
            password,
            status: true,
            crationDate: new Date(),
        });

        await userCreatedEvent(newUser);
        console.log(newUser);
        return res.status(201).json({ mensaje: "Usuario creado", data: newUser });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ mensaje: 'Error al crear usuario' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { password, phone } = req.body;

    if (!password || !phone) {
        return res.status(400).json({ mensaje: "Por favor envíe los datos necesarios" });
    }

    if (password.length < 8) {
        return res.status(400).json({ mensaje: 'La contraseña debe contener mínimo 8 caracteres' });
    }

    if (phone.length > 10) {
        return res.status(400).json({ mensaje: 'El número de teléfono debe contener 10 dígitos máximo' });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
        return res.status(400).json({ mensaje: 'Este teléfono ya está registrado' });
    }

    try {
        const [updatedRows] = await User.update(
            { phone, password },
            { where: { id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado o sin cambios" });
        }

        return res.status(200).json({ mensaje: "Usuario actualizado correctamente" });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ mensaje: 'Error al actualizar' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id){
        return res.status(400).json({ mensaje: "Envíe un id para dar de baja" });
    }

    const userExists = await User.findOne({ where: {id} });
    if (!userExists){
        return res.status(404).json({ mensaje: `El usuario con ID ${id} no existe`});
    }

    if (!userExists.status) {
        return res.status(200).json({ mensaje: `El usuario ${userExists.username} con ID ${id} ya tiene un status inactivo`});
    }

    try {
        const affectedRow = await User.update(
            { status: false },
            {where: {id}},
        );

        if (affectedRow[0] > 0){
            return res.status(200).json({
                mensaje: `Usuario ${userExists.username} con ID ${id} ahora es inactivo`
            });
        }   

        return res.status(400).json({ mensaje: 'No se pudo actualizar el estado del usuario'});
        
    } catch (error) {
        console.error('Error: ', error);
        return res.status(400).json({ mensaje: `Error al dar de baja al usuario ${id}` });
    }
}

const SECRET_KEY = process.env.SECRET_KEY || '';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
        }

        const user = await User.findOne({ where: { username, password, status: true } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado o credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, phone: user.phone },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: `Inicio de sesión exitoso: ${username}`, token });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export async function createUserFromClient(clientData) {
    const { id, name, lastName, email, phone, password } = clientData;

    const existingUser = await User.findOne({ where: { username: email } });
    if (existingUser) {
        console.log("Usuario ya existe: ", email);
        return;
    }

    const newUser = await User.create({
        username: email,
        password,
        phone,
        status: true,
        creationDate: new Date(),
    });

    console.log("Usuario creado:", newUser.username);
}
