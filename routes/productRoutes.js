import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

// Mount review routes under /:productId/reviews
router.use('/:productId/reviews', reviewRoutes);

export default router;
