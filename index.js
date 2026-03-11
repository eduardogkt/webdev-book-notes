import express, { response } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === "production";
const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
});

db.connect();

function buildBook(body) {
    return {
        isbn: body.isbn || "0000000000",
        title: body.title || "No title",
        author: body.author || "No author",
        rating: body.rating || 0,
        readIn: body.readin || null,
        synopsis: body.synopsis || "",
        review: body.review || "",
        notes: body.notes || "",
        coverUrl: `https://example.com/${body.isbn}`,
    };
}

async function getBooks() {
    const response = await db.query("SELECT * FROM books;");
    return response.rows;
}

async function getBookById(id) {
    const response = await db.query("SELECT * FROM books WHERE id = $1", [id]);
    return response.rows[0];
}

async function addBook(book) {
    if (!book) throw new Error("Book cannot be null.");

    const query = `
        INSERT INTO books 
        (isbn, title, author, rating, read_in, synopsis, review, cover_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
        RETURNING *`;

    const values = [
        book.isbn,
        book.title,
        book.author,
        book.rating,
        book.readIn,
        book.synopsis,
        book.review,
        book.coverUrl,
    ];
    const response = await db.query(query, values);
    return response.rows[0];
}

async function addNotes(bookId, bookNotes) {
    const query = `
        INSERT INTO notes (book_id, content) 
        VALUES ($1, $2) 
        RETURNING *`;

    const values = [bookId, bookNotes];

    const response = await db.query(query, values);
    return response.rows[0];
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    const books = await getBooks();
    res.render("index.ejs", { books: books });
});

app.get("/books/:id", async (req, res) => {
    const book = await getBookById(req.params.id);
    console.log("Found book: ", book);

    if (book) {
        res.render("book.ejs", { book: book });
    } else {
        res.redirect("/");
    }
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.post("/add", async (req, res) => {
    try {
        const book = buildBook(req.body);
        const createdBook = await addBook(book);

        if (book.notes) {
            const response = await addNotes(createdBook.id, book.notes);
        }

        res.redirect("/");
    } catch (error) {
        console.error("Erro ao inserir livro: " + error);
        res.status(500).send("Erro ao inserir livro");
    }
});

app.get("/books/:id/edit", async (req, res) => {
    const book = await getBookById(req.params.id);
    if (book) {
        res.render("edit.ejs", { book: book });
    } else {
        res.redirect("/");
    }
});

app.post("/books/:id/edit", (req, res) => {});

app.post("/books/:id/delete", (req, res) => {});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
