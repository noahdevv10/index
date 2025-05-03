const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://rest-religion.webflow.io' // ← Cambia este por tu dominio real si es diferente
}));

app.use(express.json());

app.post('/add-to-cart', async (req, res) => {
  try {
    const response = await fetch('https://yyr51c-ch.myshopify.com/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) throw new Error('Shopify no respondió correctamente.');

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

app.get('/get-cart', async (req, res) => {
  try {
    const response = await fetch('https://yyr51c-ch.myshopify.com/cart.js');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor proxy corriendo en http://localhost:${PORT}`);
});
