// Book Class : Represents a Book

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class : handle UI task

class UI {
    static displayBooks() {
       const books = Store.getBooks();
    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // delete after 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }

    static deleteBooks(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
}

// Store Class : handles Storage
class Store {
  static  getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

  static  addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

   static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book,index) => {
            if(book.isbn === isbn) {
                books.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Event: Display Books
document.addEventListener('DOMContentLoaded',UI.displayBooks);

// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    // Prevent actual submit

    e.preventDefault();

    //Get form values

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validate
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
    // Instatiate book
    const book = new Book(title, author, isbn);

    // Add Book to UI

    UI.addBookToList(book);
    
    // add book to store

    Store.addBook(book);

    // show succes message

    UI.showAlert('Book added', 'success');

    // Clear fields
    UI.clearFields();
    }
});

// Event: Remove a book

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBooks(e.target);

    UI.showAlert("Book deleted","danger");

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
})

