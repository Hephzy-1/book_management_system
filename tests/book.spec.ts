import request from 'supertest';
import app from '../app'; 

describe('Book API', () => {
  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const newBook = {
        title: 'Book 1',
        author: 'Jane',
        year: 2013,
        isbn: '234-098-987'
      };

      const res = await request(app)
        .post('/api/books')
        .send(newBook);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(newBook.title);
    });

    it('should return an error for missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/books')
        .send({ title: 'Incomplete Book' }); // Missing other required fields

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Please provide all the fields');
    });
  });

  describe('GET /api/books', () => {
    it('should return all books', async () => {
      const response = await request(app).get('/api/v1/books');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.books)).toBe(true);
    });
  });
});