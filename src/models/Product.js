import { db } from '../config/firebase.js';

class ProductModel {
  constructor() {
    this.collection = 'products';
  }

  async getAllProducts() {
    try {
      const productsRef = db.collection(this.collection);
      const snapshot = await productsRef.get();
      
      if (snapshot.empty) {
        return [];
      }

      const products = [];
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return products;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const productRef = db.collection(this.collection).doc(id);
      const doc = await productRef.get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      const requiredFields = ['name', 'description', 'price', 'category'];
      for (const field of requiredFields) {
        if (!productData[field]) {
          throw new Error(`El campo ${field} es requerido`);
        }
      }

      const product = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock) || 0,
        active: productData.active !== undefined ? productData.active : true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await db.collection(this.collection).add(product);
      
      return {
        id: docRef.id,
        ...product
      };
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  async updateProduct(id, updateData) {
    try {
      const productRef = db.collection(this.collection).doc(id);
      const doc = await productRef.get();
      if (!doc.exists) {
        return null;
      }

      const updatedData = {
        ...updateData,
        updatedAt: new Date()
      };

      if (updatedData.price) {
        updatedData.price = parseFloat(updatedData.price);
      }

      if (updatedData.stock !== undefined) {
        updatedData.stock = parseInt(updatedData.stock);
      }

      await productRef.update(updatedData);

      const updatedDoc = await productRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const productRef = db.collection(this.collection).doc(id);
      const doc = await productRef.get();
      if (!doc.exists) {
        return null;
      }

      await productRef.delete();
      return { success: true, message: 'Producto eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  async getProductsByCategory(category) {
    try {
      const productsRef = db.collection(this.collection);
      const snapshot = await productsRef.where('category', '==', category).get();
      
      if (snapshot.empty) {
        return [];
      }

      const products = [];
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return products;
    } catch (error) {
      throw new Error(`Error al buscar productos por categoría: ${error.message}`);
    }
  }
}

export default ProductModel;