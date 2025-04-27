const express = require('express');
const cors = require("cors");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

const categoriasAPI = require('./rutas/categorias');
categoriasAPI(app);

app.use(express.static('public'));

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});