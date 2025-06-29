// Simple closure example for library management
function libraryManager() {
    let books = [];
    return {
        addBook: function(title, author) {
            books.push({ title, author });
            return `Book added: ${title} by ${author}`;
        },
        getBooks: function() {
            return books.map(b => `${b.title} by ${b.author}`).join('\n') || 'No books.';
        },
        updateBook: function(title, newAuthor) {
            const book = books.find(b => b.title === title);
            if (book) {
                book.author = newAuthor;
                return `Updated ${title} to new author: ${newAuthor}`;
            }
            return 'Book not found.';
        },
        deleteBook: function(title) {
            const initialLength = books.length;
            books = books.filter(b => b.title !== title);
            return initialLength !== books.length ? `Deleted book: ${title}` : 'Book not found.';
        }
    };
}

// Example usage:
const lib = libraryManager();
console.log(lib.addBook('1984', 'George Orwell'));
console.log(lib.addBook('Brave New World', 'Aldous Huxley'));
console.log(lib.getBooks());
console.log(lib.updateBook('1984', 'Orwell'));
console.log(lib.getBooks());
console.log(lib.deleteBook('1984'));
console.log(lib.getBooks());
