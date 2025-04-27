const MongoLib = require('../lib/mongo');
const { ObjectId } = require('mongodb');

class CategoriasService {
    constructor() {
        this.collection = 'categorias';
        this.mongoDB = new MongoLib();
    }

    async getCategorias() {
        return await this.mongoDB.getAll(this.collection);
    }

    async addCategoria(categoria) {
        return await this.mongoDB.addOne(this.collection, { ...categoria, items: [] });
    }

    async deleteCategoria(id) {
        return await this.mongoDB.deleteOne(this.collection, id);
    }

    async addUrlToCategory(categoryId, urlItem) {
        const categorias = await this.getCategorias();
        const category = categorias.find(c => c._id.toString() === categoryId);
        
        if (!category) throw new Error("Categoría no encontrada");

        urlItem._id = new ObjectId(); 
        category.items.push(urlItem);

        return await this.mongoDB.updateOne(this.collection, categoryId, category);
    }

    async deleteUrl(categoryId, urlId) {
        const categorias = await this.getCategorias();
        const category = categorias.find(c => c._id.toString() === categoryId);
        
        if (!category) throw new Error("Categoría no encontrada");
        
        category.items = category.items.filter(url => url._id.toString() !== urlId);
        return await this.mongoDB.updateOne(this.collection, categoryId, category);
    }

    async updateUrl(categoryId, updatedUrl) {
        const categorias = await this.getCategorias();
        const category = categorias.find(c => c._id.toString() === categoryId);
        
        if (!category) throw new Error("Categoría no encontrada");

        const urlIndex = category.items.findIndex(url => url._id.toString() === updatedUrl._id);
        if (urlIndex === -1) throw new Error("URL no encontrada");

        category.items[urlIndex] = { ...updatedUrl };
        return await this.mongoDB.updateOne(this.collection, categoryId, category);
    }
}

module.exports = CategoriasService;
