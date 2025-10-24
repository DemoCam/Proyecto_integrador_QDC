/**
 * Script para poblar la base de datos con productos de prueba
 * Ejecutar: node backend/scripts/seedProducts.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

// Productos de prueba
const productosEjemplo = [
  {
    nombre: 'Ácido Sulfúrico 98%',
    descripcion: 'Ácido sulfúrico concentrado de alta pureza para uso industrial',
    codigo: 'QUI-001',
    precio: 45000,
    stock: 150,
    stockMinimo: 30,
    categoria: 'Químicos',
    unidadMedida: 'L',
    proveedor: 'Químicos Industriales S.A.'
  },
  {
    nombre: 'Hidróxido de Sodio',
    descripcion: 'Soda cáustica en escamas, grado industrial',
    codigo: 'QUI-002',
    precio: 25000,
    stock: 200,
    stockMinimo: 50,
    categoria: 'Químicos',
    unidadMedida: 'Kg',
    proveedor: 'Distribuidora Química del Sur'
  },
  {
    nombre: 'Ácido Clorhídrico 37%',
    descripcion: 'Ácido clorhídrico concentrado para limpieza y tratamiento',
    codigo: 'QUI-003',
    precio: 32000,
    stock: 8,
    stockMinimo: 25,
    categoria: 'Químicos',
    unidadMedida: 'L',
    proveedor: 'Químicos Industriales S.A.'
  },
  {
    nombre: 'Acetona Industrial',
    descripcion: 'Solvente de alta pureza para limpieza y dilución',
    codigo: 'SOL-001',
    precio: 18000,
    stock: 120,
    stockMinimo: 40,
    categoria: 'Solventes',
    unidadMedida: 'L',
    proveedor: 'Solventes y Químicos Ltda.'
  },
  {
    nombre: 'Alcohol Isopropílico 99%',
    descripcion: 'Alcohol isopropílico de alta pureza',
    codigo: 'SOL-002',
    precio: 22000,
    stock: 5,
    stockMinimo: 30,
    categoria: 'Solventes',
    unidadMedida: 'L',
    proveedor: 'Solventes y Químicos Ltda.'
  },
  {
    nombre: 'Thinner Industrial',
    descripcion: 'Diluyente para pinturas y recubrimientos',
    codigo: 'SOL-003',
    precio: 15000,
    stock: 180,
    stockMinimo: 50,
    categoria: 'Solventes',
    unidadMedida: 'Galón',
    proveedor: 'Pinturas del Valle'
  },
  {
    nombre: 'Guantes de Nitrilo Caja x100',
    descripcion: 'Guantes desechables de nitrilo talla M',
    codigo: 'INS-001',
    precio: 35000,
    stock: 0,
    stockMinimo: 20,
    categoria: 'Insumos',
    unidadMedida: 'Caja',
    proveedor: 'Seguridad Industrial S.A.'
  },
  {
    nombre: 'Mascarilla Respirador N95',
    descripcion: 'Mascarilla de protección respiratoria N95',
    codigo: 'INS-002',
    precio: 8500,
    stock: 250,
    stockMinimo: 100,
    categoria: 'Insumos',
    unidadMedida: 'Unidad',
    proveedor: 'Seguridad Industrial S.A.'
  },
  {
    nombre: 'Gafas de Seguridad',
    descripcion: 'Gafas de protección transparentes antiempañantes',
    codigo: 'INS-003',
    precio: 12000,
    stock: 75,
    stockMinimo: 30,
    categoria: 'Insumos',
    unidadMedida: 'Unidad',
    proveedor: 'Seguridad Industrial S.A.'
  },
  {
    nombre: 'Probeta Graduada 100ml',
    descripcion: 'Probeta de vidrio graduada de 100ml',
    codigo: 'EQU-001',
    precio: 28000,
    stock: 15,
    stockMinimo: 10,
    categoria: 'Equipos',
    unidadMedida: 'Unidad',
    proveedor: 'Laboratorios y Equipos S.A.'
  },
  {
    nombre: 'Pipeta Volumétrica 25ml',
    descripcion: 'Pipeta volumétrica de vidrio clase A',
    codigo: 'EQU-002',
    precio: 35000,
    stock: 20,
    stockMinimo: 8,
    categoria: 'Equipos',
    unidadMedida: 'Unidad',
    proveedor: 'Laboratorios y Equipos S.A.'
  },
  {
    nombre: 'Balanza Analítica Digital',
    descripcion: 'Balanza de precisión 0.001g capacidad 200g',
    codigo: 'EQU-003',
    precio: 1250000,
    stock: 3,
    stockMinimo: 2,
    categoria: 'Equipos',
    unidadMedida: 'Unidad',
    proveedor: 'Laboratorios y Equipos S.A.'
  },
  {
    nombre: 'Peróxido de Hidrógeno 30%',
    descripcion: 'Agua oxigenada concentrada para uso industrial',
    codigo: 'QUI-004',
    precio: 28000,
    stock: 90,
    stockMinimo: 25,
    categoria: 'Químicos',
    unidadMedida: 'L',
    proveedor: 'Químicos Industriales S.A.'
  },
  {
    nombre: 'Etanol 96%',
    descripcion: 'Alcohol etílico de alta pureza',
    codigo: 'SOL-004',
    precio: 24000,
    stock: 110,
    stockMinimo: 40,
    categoria: 'Solventes',
    unidadMedida: 'L',
    proveedor: 'Solventes y Químicos Ltda.'
  },
  {
    nombre: 'Overol Tyvek Desechable',
    descripcion: 'Overol de protección desechable Tyvek',
    codigo: 'INS-004',
    precio: 45000,
    stock: 3,
    stockMinimo: 15,
    categoria: 'Insumos',
    unidadMedida: 'Unidad',
    proveedor: 'Seguridad Industrial S.A.'
  }
];

// Función principal para poblar la base de datos
const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando población de base de datos...\n');

    // Conectar a la base de datos
    await connectDB();

    // Limpiar productos existentes (opcional - comentar si no quieres borrar)
    console.log('🗑️  Limpiando productos existentes...');
    await Product.deleteMany({});
    console.log('✅ Productos existentes eliminados\n');

    // Insertar productos de prueba
    console.log('📦 Insertando productos de prueba...');
    const productosCreados = await Product.insertMany(productosEjemplo);
    console.log(`✅ Se insertaron ${productosCreados.length} productos exitosamente\n`);

    // Mostrar resumen
    console.log('📊 Resumen de productos creados:');
    console.log('─────────────────────────────────────────');
    
    const porCategoria = productosCreados.reduce((acc, prod) => {
      acc[prod.categoria] = (acc[prod.categoria] || 0) + 1;
      return acc;
    }, {});

    Object.entries(porCategoria).forEach(([categoria, cantidad]) => {
      console.log(`   ${categoria}: ${cantidad} productos`);
    });

    console.log('─────────────────────────────────────────');
    
    // Productos con stock bajo
    const stockBajo = productosCreados.filter(p => p.stock <= p.stockMinimo && p.stock > 0);
    const sinStock = productosCreados.filter(p => p.stock === 0);
    
    console.log(`\n⚠️  Productos con stock bajo: ${stockBajo.length}`);
    if (stockBajo.length > 0) {
      stockBajo.forEach(p => {
        console.log(`   - ${p.nombre} (${p.codigo}): Stock ${p.stock}/${p.stockMinimo}`);
      });
    }

    console.log(`\n❌ Productos sin stock: ${sinStock.length}`);
    if (sinStock.length > 0) {
      sinStock.forEach(p => {
        console.log(`   - ${p.nombre} (${p.codigo})`);
      });
    }

    console.log('\n✨ ¡Base de datos poblada exitosamente!');
    console.log('🚀 Ahora puedes probar la aplicación con estos datos\n');

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('👋 Conexión cerrada. Script finalizado.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar el script
seedDatabase();
