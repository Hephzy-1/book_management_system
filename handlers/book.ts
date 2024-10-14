import express from 'express';
import { createBook, getBooks, getBook, updateBook, deleteBook, searchBook } from '../repository/bookRepo';

const router = express.Router();

router.route('/').post(createBook).get(getBooks);
router.route('/search').get(searchBook);
router.route('/:id').put(updateBook).delete(deleteBook);
router.route('/:isbn').get(getBook);

export default router;
