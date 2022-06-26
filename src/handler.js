const { nanoid } = require('nanoid');
const books = require('./books');

//menyimpan data buku
const addBookHandler = (request, h) => {
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading,
    } = request.payload;

    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
        return response;
    }
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
        return response;
    }
    const id = nanoid(16);
    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toDateString();
    const updatedAt = insertedAt;

    const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  }

  books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess){
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            }
        }).code(201);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    }).code(500);
    return response;
}

//menampilkan semua data
const getAllBooksHandler = () => ({
    status: 'success',
    data: {
        books,
    },
});

//detail buku berdasarkan ID
const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((book) => book.id === id)[0];

    if(book){
        const response = h.response({
            status: 'success',
            data: {
                book,
            }
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

//mengedit data buku
const editBookHandler = (request, h) => {
    const { id } = request.params;

    const {
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage,
        reading,
    } = request.payload;

const index = books.findIndex((book) => book.id === id);
    if(index !== -1){
        if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const finished = pageCount === readPage ? true : false;
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
            finished,
            reading,
            updatedAt
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
      message:  'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


//Menghapus Buku berdasarkan ID
const deleteBookHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if(index > -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'succes',
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


module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookHandler, deleteBookHandler};