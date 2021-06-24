class BaseManager {
  constructor(collection, client) {
    this.colllection = collection;
    this.client = client;
  }

  countCollectionDocuments() {
    return this.client.database.collection(this.colllection).countDocuments();
  }

  find(filter = {}) {
    return this.client.database.collection(this.colllection).findOne(filter);
  }

  delete(filter = {}) {
    return this.client.database.collection(this.colllection).deleteOne(filter);
  }

  create(schema) {
    return this.client.database.collection(this.colllection).insertOne(schema, { upsert: true });
  }
}

module.exports = BaseManager;
