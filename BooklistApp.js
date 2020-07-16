//book class : represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;

    }
}
//class UI: Handle user interface tasks
class UI {
    static dispalyBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete "> X </a></td>
            `;
        list.appendChild(row);

    }
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }

    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //vanish in 3 second
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

} //end of class UI 


//Store class:Handle Storgage
class Store {

    static getBooks() {

        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }
    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }

        });
        localStorage.setItem('books', JSON.stringify(books));

    }

} //end class Store

//Event Handling: Display of books
document.addEventListener('DOMContentLoaded', UI.dispalyBooks);

//Event: add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    //prevent default
    e.preventDefault();

    // Get form valules

    const title = document.querySelector('#title').value;
    const authore = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate values
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        //instantiate book
        const book = new Book(title, author, isbn);

        //add book UI
        UI.addBookToList(book);
        //add book to the store
        Store.addBook(book);

        //show success message when bood has been added
        UI.showAlert('bood added', ' success');
        //clear field
        UI.clearFields();
    }
});

//remove book
document.querySelector('book-list').addEventListener('click', (e) => {
    //remove book from UI

    UI.deleteBook(e.target);
    //remove book from store

    UI.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show success message
    UI.showAlert('Book removed', 'success');

});