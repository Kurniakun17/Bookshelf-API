const { nanoid } = require('nanoid');
const books = require('./books');

const postBooksHandler = (request, h) => {
  const id = nanoid(16);
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const finished = pageCount === readPage;

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id);

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  if (books.length > 0) {
    let allBooks = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    if (name) {
      allBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));
    }

    if (reading) {
      let bool = false;
      if (reading === 1) {
        bool = true;
      }

      allBooks = books.filter((book) => book.reading === bool).map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    }

    if (finished) {
      let bool = false;
      // eslint-disable-next-line eqeqeq
      if (finished == 1) {
        bool = true;
      }

      allBooks = books.filter((book) => book.finished === bool).map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    }

    const response = h.response({
      status: 'success',
      data: {
        books: allBooks,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: [],
    },
  });
  response.code(201);
  return response;
};

const detailedBook = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((note) => note.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBook = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    let finished;
    if (readPage === pageCount) {
      finished = true;
    } else {
      finished = false;
    }

    const updatedAt = new Date().toISOString();

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  postBooksHandler, getBooks, detailedBook, updateBook, deleteBook,
};
