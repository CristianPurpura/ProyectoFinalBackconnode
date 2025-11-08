import ProductModel from '../models/Product.js';

class ProductService {
  constructor() {
    this.productModel = new ProductModel();
  }

  // Obtener todos los productos
  async getAllProducts() {
    try {
      const products = await this.productModel.getAllProducts();
      return {
        success: true,
        data: products,
        message: 'Productos obtenidos correctamente'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Obtener producto por ID
  async getProductById(id) {
    try {
      if (!id) {
        return {
          success: false,
          data: null,
          message: 'ID del producto es requerido'
        };
      }

      const product = await this.productModel.getProductById(id);
      
      if (!product) {
        return {
          success: false,
          data: null,
          message: 'Producto no encontrado'
        };
      }

      return {
        success: true,
        data: product,
        message: 'Producto obtenido correctamente'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Crear nuevo producto
  async createProduct(productData) {
    try {
      // Validaciones adicionales del negocio
      if (productData.price <= 0) {
        return {
          success: false,
          data: null,
          message: 'El precio debe ser mayor a 0'
        };
      }

      if (productData.stock < 0) {
        return {
          success: false,
          data: null,
          message: 'El stock no puede ser negativo'
        };
      }

      const newProduct = await this.productModel.createProduct(productData);
      
      return {
        success: true,
        data: newProduct,
        message: 'Producto creado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Actualizar producto
  async updateProduct(id, updateData) {
    try {
      if (!id) {
        return {
          success: false,
          data: null,
          message: 'ID del producto es requerido'
        };
      }

      // Validaciones adicionales
      if (updateData.price !== undefined && updateData.price <= 0) {
        return {
          success: false,
          data: null,
          message: 'El precio debe ser mayor a 0'
        };
      }

      if (updateData.stock !== undefined && updateData.stock < 0) {
        return {
          success: false,
          data: null,
          message: 'El stock no puede ser negativo'
        };
      }

      const updatedProduct = await this.productModel.updateProduct(id, updateData);
      
      if (!updatedProduct) {
        return {
          success: false,
          data: null,
          message: 'Producto no encontrado'
        };
      }

      return {
        success: true,
        data: updatedProduct,
        message: 'Producto actualizado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Eliminar producto
  async deleteProduct(id) {
    try {
      if (!id) {
        return {
          success: false,
          data: null,
          message: 'ID del producto es requerido'
        };
      }

      const result = await this.productModel.deleteProduct(id);
      
      if (!result) {
        return {
          success: false,
          data: null,
          message: 'Producto no encontrado'
        };
      }

      return {
        success: true,
        data: null,
        message: 'Producto eliminado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // Obtener productos por categoría
  async getProductsByCategory(category) {
    try {
      if (!category) {
        return {
          success: false,
          data: null,
          message: 'Categoría es requerida'
        };
      }

      const products = await this.productModel.getProductsByCategory(category);
      
      return {
        success: true,
        data: products,
        message: `Productos de la categoría ${category} obtenidos correctamente`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }
}

export default ProductService;