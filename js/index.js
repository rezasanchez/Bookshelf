books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("bookForm");
    submitForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();

        document.getElementById("bookForm").reset();
    });

    function addBook() {
        const bookFormTitle = document.getElementById("bookFormTitle").value;
        const bookFormAuthor = document.getElementById("bookFormAuthor").value;
        const bookFormYear = parseInt(
            document.getElementById("bookFormYear").value
        );
        const bookFormIsComplete =
            document.getElementById("bookFormIsComplete").checked;

        const generatedID = generateId();
        const bookObject = generateBookObject(
            generatedID,
            bookFormTitle,
            bookFormAuthor,
            bookFormYear,
            bookFormIsComplete
        );
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function generateId() {
        return +new Date();
    }

    function generateBookObject(id, title, author, year, isComplete) {
        return {
            id,
            title,
            author,
            year,
            isComplete,
        };
    }

    document.addEventListener(RENDER_EVENT, function () {
        const uncompletedBOOKList =
            document.getElementById("incompleteBookList");
        uncompletedBOOKList.innerHTML = "";

        const completedBOOKList = document.getElementById("completeBookList");
        completedBOOKList.innerHTML = "";

        for (const bookItem of books) {
            const bookElement = makeBook(bookItem);
            if (!bookItem.isComplete) uncompletedBOOKList.append(bookElement);
            else completedBOOKList.append(bookElement);
        }
    });

    function makeBook(bookObject) {
        const bookItemTitle = document.createElement("h3");
        bookItemTitle.innerText = bookObject.title;
        bookItemTitle.classList.add("book-item");
        bookItemTitle.dataset.testid = "bookItemTitle";

        const bookItemAuthor = document.createElement("p");
        bookItemAuthor.innerText = "Penulis :" + bookObject.author;
        bookItemAuthor.classList.add("book-item");
        bookItemAuthor.dataset.testid = "bookItemAuthor";

        const bookItemYear = document.createElement("p");
        bookItemYear.innerText = "Tahun :" + bookObject.year;
        bookItemYear.classList.add("book-item");
        bookItemYear.dataset.testid = "bookItemYear";

        const containerBook = document.createElement("div");
        containerBook.classList.add("container-book");
        containerBook.append(bookItemTitle, bookItemAuthor, bookItemYear);
        containerBook.dataset.bookid = `book-${bookObject.id}`;
        containerBook.dataset.testid = "bookItem";

        if (bookObject.isComplete) {
            const undoButton = document.createElement("button");
            undoButton.classList.add("toggle-button");
            undoButton.dataset.testid = "bookItemIsCompleteButton";
            undoButton.innerText = "Belum Selesai Di baca";

            undoButton.addEventListener("click", function () {
                undoItemFromCompleted(bookObject.id);
            });

            const editButton = document.createElement("button");
            editButton.classList.add("toggle-button");
            editButton.dataset.testid = "bookItemEditButton";
            editButton.innerText = "Edit";

            editButton.addEventListener("click", function () {
                editItemBookIscompleted(bookObject.id);
            });

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-button");
            removeButton.dataset.testid = "bookItemDeleteButton";
            removeButton.innerText = "Hapus Buku";

            removeButton.addEventListener("click", function () {
                removeItemFromCompleted(bookObject.id);
            });

            containerBook.append(undoButton, editButton, removeButton);
        } else {
            const checkButton = document.createElement("button");
            checkButton.classList.add("toggle-button");
            checkButton.dataset.testid = "bookItemIsCompleteButton";
            checkButton.innerText = "Selesai";

            checkButton.addEventListener("click", function () {
                addItemToCompleted(bookObject.id);
            });

            const editButton = document.createElement("button");
            editButton.classList.add("toggle-button");
            editButton.dataset.testid = "bookItemEditButton";
            editButton.innerText = "Edit";

            editButton.addEventListener("click", function () {
                editItemBookIscompleted(bookObject.id);
            });

            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-button");
            removeButton.dataset.testid = "bookItemDeleteButton";
            removeButton.innerText = "Hapus Buku";

            removeButton.addEventListener("click", function () {
                removeItemFromCompleted(bookObject.id);
            });

            containerBook.append(checkButton, editButton, removeButton);
        }

        return containerBook;
    }

    function removeItemFromCompleted(bookId) {
        const bookTarget = findBookIndex(bookId);

        if (bookTarget === -1) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function undoItemFromCompleted(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function addItemToCompleted(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBook(bookId) {
        for (const bookItem of books) {
            if (bookItem.id === bookId) {
                return bookItem;
            }
        }
        return null;
    }

    function findBookIndex(bookId) {
        for (const index in books) {
            if (books[index].id === bookId) {
                return index;
            }
        }

        return -1;
    }

    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const titleSearch = document
            .getElementById("searchBookTitle")
            .value.toLowerCase();
        const allTitle = document.querySelectorAll(".container-book h3");

        for (const title of allTitle) {
            if (title.innerText.toLowerCase().includes(titleSearch)) {
                title.parentElement.style.display = "block";
            } else {
                title.parentElement.style.display = "none";
            }
            console.log(title.innerText.toLowerCase(), titleSearch);
        }

        document.getElementById("searchBook").reset();
    });

    const updateBook = (bookId) => {
        const bookTarget = findBook(bookId);
        const bookIndex = findBookIndex(bookId);

        if (bookIndex === -1) return;
        books.splice(bookIndex, 1);

        const updateTitle = document.getElementById("bookFormTitle").value;
        const updateAuthor = document.getElementById("bookFormAuthor").value;
        const updateYear = document.getElementById("bookFormYear").value;

        bookTarget.title = updateTitle;
        bookTarget.autor = updateAuthor;
        bookTarget.year = updateYear;
        bookTarget.isComplete = bookFormIsComplete.checked;

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    };

    function editItemBookIscompleted(bookId) {
        const bookTarget = findBookIndex(bookId);

        if (bookTarget !== -1) {
            document.getElementById("bookFormTitle").value =
                books[bookTarget].title;
            document.getElementById("bookFormAuthor").value =
                books[bookTarget].author;
            document.getElementById("bookFormYear").value =
                books[bookTarget].year;

            const bookSubmit = document.getElementById("bookFormSubmit");
            bookSubmit.innerText = "Simpan";

            const inputBookFrom = document.getElementById("bookForm");
            inputBookFrom.dataset.mode = "edit";

            const updateBookHandler = () => {
                if (books && books[bookTarget] && books[bookTarget].id) {
                    const bookId = books[bookTarget].id;
                    updateBook(bookId);
                }
            };
            bookSubmit.addEventListener("click", updateBookHandler);
        } else {
            console.error("Buku yang ingin di edit tidak ditemukan");
        }
    }

    function isStorageExist() {
        if (typeof Storage === undefined) {
            alert("Browser kamu tidak mendukung local storage");
            return false;
        }
        return true;
    }

    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    document.addEventListener(SAVED_EVENT, function () {
        console.log(localStorage.getItem(STORAGE_KEY));
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Your book has been saved",
            showConfirmButton: false,
            timer: 1500,
        });
    });

    function loadDataFormStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if (data !== null) {
            for (const book of data) {
                books.push(book);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
    if (isStorageExist()) {
        loadDataFormStorage();
    }
});
