const { MongoClient, ObjectId } = require('mongodb');


DB_NAME = 'categorias';
const MONGO_URI = process.env.MONGO_URI;
class MongoLib {
    constructor() {
        this.client = new MongoClient(MONGO_URI);
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            try {
                await this.client.connect();
                this.db = this.client.db(DB_NAME);
                console.log('Conectado a MongoDB Atlas');
            } catch (e) {
                console.error('Error en conexión a MongoDB Atlas:', e);
                throw e;
            }
        }
        return this.db;
    }

    async getAll(collection) {
        const db = await this.connect();
        return await db.collection(collection).find().toArray();
    }

    async addOne(collection, item) {
        const db = await this.connect();
        const result = await db.collection(collection).insertOne(item);
        return result.insertedId;
    }

    async deleteOne(collection, id) {
        const db = await this.connect();
        const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    }

    updateOne(collection, id, data) {
        return this.connect()
            .then(db => db.collection(collection).updateOne(
                { _id: typeof id === 'string' ? new ObjectId(id) : id },
                { $set: { items: data.items } }
            ));
    }

    async close() {
        if (this.client) {
            await this.client.close();
            console.log('Conexión a Mongo cerrada');
        }
    }
}

module.exports = MongoLib;