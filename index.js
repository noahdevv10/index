const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura CORS para permitir solicitudes desde tu dominio de frontend (ajusta si es necesario)
app.use(cors({
  origin: 'https://rest-religion.webflow.io' // Cambia esto por tu dominio si es diferente
}));

// Middleware para permitir imágenes base64 en la política CSP
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:;");
  next();
});

app.use(express.json());

// Ruta para la página principal (para solucionar "Cannot GET /")
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Ruta para agregar productos al carrito de Shopify
app.post('/add-to-cart', async (req, res) => {
  try {
    console.log('Solicitud recibida en /add-to-cart:', req.body); // Verifica lo que recibes
    const response = await fetch('https://yyr51c-ch.myshopify.com/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) throw new Error('Shopify no respondió correctamente.');

    const data = await response.json();
    console.log('Respuesta de Shopify en /add-to-cart:', data); // Verifica la respuesta
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

// Ruta para obtener el carrito de Shopify
app.get('/get-cart', async (req, res) => {
  try {
    const response = await fetch('https://yyr51c-ch.myshopify.com/cart.js');
    const data = await response.json();
    console.log('Respuesta de Shopify en /get-cart:', data); // Verifica la respuesta
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en http://localhost:${PORT}`);
});
