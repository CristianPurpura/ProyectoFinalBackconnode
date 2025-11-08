import express from 'express';
import ProductController from '../controllers/productController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const productController = new ProductController();
const authMiddleware = new AuthMiddleware();

// Ruta pública para obtener todos los productos (sin autenticación)
router.get('/', productController.getAllProducts.bind(productController));

// Ruta pública para obtener un producto por ID (sin autenticación)
router.get('/:id', productController.getProductById.bind(productController));

// Ruta protegida para crear un nuevo producto
router.post('/create', 
  authMiddleware.authenticate,
  productController.createProduct.bind(productController)
);

// Ruta protegida para actualizar un producto
router.put('/:id', 
  authMiddleware.authenticate,
  productController.updateProduct.bind(productController)
);

// Ruta protegida para eliminar un producto
router.delete('/:id', 
  authMiddleware.authenticate,
  productController.deleteProduct.bind(productController)
);

// Ruta pública para buscar productos por categoría
router.get('/category/:category', productController.getProductsByCategory.bind(productController));

export default router;