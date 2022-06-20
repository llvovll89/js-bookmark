document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
       event.preventDefault(); 
     } 
 }, false);

var lastTouchEnd = 0; 

document.documentElement.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
       event.preventDefault(); 
     } lastTouchEnd = now; 
 }, false);

// Book Class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class='btn-delete'>❌</a></td>
        `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("btn-delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.getElementById("book-form");
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static crearFields() {
    document.querySelector("#input-title").value = "";
    document.querySelector("#input-author").value = "";
    document.querySelector("#input-isbn").value = "";
  }
}

class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null ){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
       const books = Store.getBooks();

       books.forEach((book, index) => {
        if(book.isbn === isbn) {
            books.splice(index, 1);
        }
       });

       localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks);

document.getElementById("book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // Get value
  const title = document.querySelector("#input-title").value;
  const author = document.querySelector("#input-author").value;
  const isbn = document.querySelector("#input-isbn").value;

  // validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("제목/작가/책번호 다 기입해주세요..PLZ", "error");
  } else {
    // book 인스턴스화
    const book = new Book(title, author, isbn);

    // UI
    UI.addBookToList(book);

    // Add book to Store
    Store.addBook(book);

    // 성공 메시지
    UI.showAlert('책 추가 성공!' , 'success');

    // clear
    UI.crearFields();
  }
});

// Remove book
document.getElementById("book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  UI.showAlert('지워졌습니다🐼', 'success')
});
