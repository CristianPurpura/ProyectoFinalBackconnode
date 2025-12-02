import ProductService from '../services/productService.js';

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  async getAllProducts(req, res, next) {
    try {
      const result = await this.productService.getAllProducts();
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          data: null,
          message: result.message
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.productService.getProductById(id);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: result.message
        });
      } else {
        const statusCode = result.message === 'Producto no encontrado' ? 404 : 400;
        res.status(statusCode).json({
          success: false,
          data: null,
          message: result.message
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const productData = req.body;
      const result = await this.productService.createProduct(productData);
      
      if (result.success) {
        res.status(201).json({
          success: true,
          data: result.data,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          data: null,
          message: result.message
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await this.productService.updateProduct(id, updateData);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: result.message
        });
      } else {
        const statusCode = result.message === 'Producto no encontrado' ? 404 : 400;
        res.status(statusCode).json({
          success: false,
          data: null,
          message: result.message
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.productService.deleteProduct(id);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: null,
          message: result.message
        });
      } else {
        const statusCode = result.message === 'Producto no encontrado' ? 404 : 400;
        res.status(statusCode).json({
          success: false,
          data: null,
          message: result.message
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getProductsByCategory(req, res, next) {
    try {
      const { category } = req.query;
      const result = await this.productService.getProductsByCategory(category);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          data: null,
          message: result.message
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;