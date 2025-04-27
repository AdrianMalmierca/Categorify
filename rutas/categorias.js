const express = require('express');
const CategoriasService = require('../servicios/categoriasService');
const Categoria = require('../modelos/categoria');


function categoriasAPI(app) {
    const router = express.Router();
  
    app.use('/api/categorias', (req, res, next) => {
      console.log(`Llamada entrante: ${req.method} ${req.url}`);
      next();
    });
  
    app.use('/api/categorias', router);
  
    const categoriasService = new CategoriasService();
  
    //Obtener todas las categorías
    router.get('/', async (req, res) => {
        try {
            const categorias = await categoriasService.getCategorias();
            res.status(200).json(categorias);
        } catch (error) {
            console.error('Error en GET categorias:', error);
            res.status(500).json({ error: "Error obteniendo categorías" });
        }
    });    

    //Crear una nueva categoría
    router.post('/', async (req, res) => {
        try {
            const categoria = req.body;
            await categoriasService.addCategoria(categoria);
            res.status(201).json({ message: "Categoría añadida correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error añadiendo categoría" });
        }
    });

    //Eliminar una categoría
    router.delete('/:id', async (req, res) => {
        try {
            const resultado = await categoriasService.deleteCategoria(req.params.id);
            res.status(200).json({ message: resultado ? "Categoría eliminada" : "No se encontró la categoría" });
        } catch (error) {
            res.status(500).json({ error: "Error eliminando categoría" });
        }
    });

    //Añadir una URL a una categoría
    router.post('/:id/urls', async (req, res) => {
        try {
            const { id } = req.params;
            const urlItem = req.body;
            await categoriasService.addUrlToCategory(id, urlItem);
            res.status(201).json({ message: "URL añadida correctamente" });
        } catch (error) {
            res.status(500).json({ error: "Error añadiendo URL" });
        }
    });

    //Agregar URL
    router.put('/:id/add-url', async (req, res) => {
        try {
            const { id } = req.params;
            const urlItem = req.body;
    
            await categoriasService.addUrlToCategory(id, urlItem);
            res.status(201).json({ message: "URL añadida correctamente" });
        } catch (error) {
            console.error("Error en el endpoint PUT /add-url:", error);
            res.status(500).json({ error: "Error añadiendo URL (PUT)" });
        }
    });
    
    //Actualizar una URL existente en una categoría
    router.put('/:categoryId/update-url/:urlId', async (req, res) => {
        const { categoryId, urlId } = req.params;
        const updatedUrl = req.body;

        try {
            const categoriasService = new CategoriasService();
            await categoriasService.updateUrl(categoryId, updatedUrl);
            res.status(200).json({ message: "URL actualizada correctamente" });
        } catch (error) {
            console.error("Error actualizando URL:", error);
            res.status(500).json({ error: "Error actualizando URL" });
        }
    });

    //Eliminar url card
    router.delete('/:categoryId/delete-url/:urlId', async (req, res) => {
        const { categoryId, urlId } = req.params;
      
        try {
          const categoriasService = new CategoriasService();
          await categoriasService.deleteUrl(categoryId, urlId);
          res.status(200).json({ message: "URL eliminada correctamente" });
        } catch (error) {
          console.error("Error eliminando URL:", error);
          res.status(500).send("Error del servidor");
        }
      });
}

module.exports = categoriasAPI;