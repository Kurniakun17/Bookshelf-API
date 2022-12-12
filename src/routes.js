const {
  postBooksHandler, getBooks, deleteBook, updateBook, detailedBook,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: postBooksHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBooks,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: detailedBook,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBook,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBook,
  },
];

module.exports = routes;
