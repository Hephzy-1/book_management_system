import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/errorResponse';
import asyncHandler from '../middlewares/async';
import booksData from '../data/books.json'; 

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  isbn: string;
}

const books: Book[] = booksData; 

export const createBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => { 
    let id = books.length + 1;
    const { title, author, year, isbn } = req.body;
    
    // Check if the required fields are provided
    if (!title || !author || !year || !isbn) { 
        return next(new ErrorResponse('Please provide all the fields', 400));
    }

    // Check if the book already exists
    const existingBook = books.find(book => book.isbn === isbn);
    if (existingBook) {
      return next(new ErrorResponse('Book already exists', 400));
    }

    // Create the book
    const book: Book = { id, title, author, year, isbn }; // Create a book object directly
    books.push(book);
    res.status(201).json({ success: true, data: book });
});

export const getBooks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => { 
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results: any = {};

    if (endIndex < books.length) {
        results.next = { page: page + 1 };
    }

    if (startIndex > 0) { 
        results.previous = { page: page - 1 };
    }

    results.books = books.slice(startIndex, endIndex);
    results.total = books.length;

    res.status(200).json({ success: true, data: results });
});

export const getBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => { 
    const { isbn } = req.params;
    if (!isbn) {
        return next(new ErrorResponse('Please provide a valid isbn', 400));
    }

    const book = books.find(book => book.isbn === isbn.toString());
    if (!book) { 
        return next(new ErrorResponse('Book not found', 404));
    }
    res.status(200).json({ success: true, data: book });
});

export const updateBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Check if id is provided
    if (!id) {
        return next(new ErrorResponse('Please provide a valid id', 400));
    }

    // Check if the book exists
    const book = books.find(book => book.id === parseInt(id));
    if (!book) {
        return next(new ErrorResponse('Book not found', 404));
    }

    // Update the book with the provided data
    const { title, author, year, isbn } = req.body;

    // Check if no data is provided
    if (!title && !author && !year && !isbn) { 
        return next(new ErrorResponse('Please provide the data to be updated', 400));
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (year) book.year = year;
    if (isbn) book.isbn = isbn;

    res.status(200).json({ success: true, data: book });
});

export const deleteBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => { 
    const { id } = req.params;

    // Check if the book exists
    const book = books.find(book => book.id === parseInt(id));
    if (!book) {
        return next(new ErrorResponse('Book not found', 404));
    }

    // Delete the book
    const index = books.indexOf(book);
    books.splice(index, 1);
    res.status(200).json({ success: true, data: {} });
});

export const searchBook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => { 
    const { author, title } = req.body;

    // Check if the author or title is provided
    if (!author && !title) { 
        return next(new ErrorResponse('Please provide an author or title', 400));
    }

    // Search for the book
    let book: Book[];
    if (author) { 
        book = books.filter(book => book.author === author);
    } else if (title) { 
        book = books.filter(book => book.title === title);
    } else {
      book = []; // Default to empty if both are not provided
    }

    if (book.length === 0) { 
        return next(new ErrorResponse('Book not found', 404));
    }

    res.status(200).json({ success: true, data: book });
});
