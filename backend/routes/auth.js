const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Por favor, complete todos los campos requeridos.' });
    }

    // Verificar si el usuario ya existe
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      password: passwordEncriptado,
      rol: rol || 'vendedor'
    });

    await nuevoUsuario.save();

    // Generar token JWT
    const token = jwt.sign(
      { userId: nuevoUsuario._id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error al registrar usuario.' });
  }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor, proporcione email y contraseña.' });
    }

    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});

module.exports = router;
