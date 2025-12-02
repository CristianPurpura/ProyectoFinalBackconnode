import express from 'express';
import ProductController from '../controllers/productController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const productController = new ProductController();
const authMiddleware = new AuthMiddleware();

router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

router.post('/create', 
  authMiddleware.authenticate,
  productController.createProduct.bind(productController)
);

router.put('/:id', 
  authMiddleware.authenticate,
  productController.updateProduct.bind(productController)
);

router.delete('/:id', 
  authMiddleware.authenticate,
  productController.deleteProduct.bind(productController)
);

router.get('/category/:category', productController.getProductsByCategory.bind(productController));

export default router;