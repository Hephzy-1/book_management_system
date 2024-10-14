class Book {
  id: number;
  title: string;
  author: string;
  year: number;
  isbn: number;

  constructor(id: number, title: string, author: string, year: number, isbn: number) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.year = year;
    this.isbn = isbn;
  }

  static createBook(id: number, title: string, author: string, year: number, isbn: number): Book {
    return new Book(id, title, author, year, isbn);
  }
}

export { Book };