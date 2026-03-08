import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

const app = express();
const port = 3000;
const db = new pg.Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
});
db.connect();

let books = [
    {
        isbn: "1234567890",
        title: "My book",
        author: "Im the Author",
        rating: 3,
        readIn: moment().format("DD/MM/YYYY"),
        synopsis:
            "Tweets from 1765-1799 by a 4’9” hunchback physicist, friends with Goethe and Kant, admired by Nietzsche, Schopenhauer, etc. Such wonderful random thoughts, beautiful perspectives on thinking for yourself, observing nature, language, freedom, philosophy, religion, and more. Hundreds of initial insights, especially inspiring because they’re undeveloped. Hundreds of initial insights, especially inspiring because they’re undeveloped.",
        review: "Tweets from 1765-1799 by a 4’9” hunchback physicist, friends with Goethe and Kant, admired by Nietzsche, Schopenhauer, etc. Such wonderful random thoughts, beautiful perspectives on thinking for yourself, observing nature, language, freedom, philosophy, religion, and more. Hundreds of initial insights, especially inspiring because they’re undeveloped. Hundreds of initial insights, especially inspiring because they’re undeveloped.",
        notes: "Tweets from 1765-1799 by a 4’9” hunchback physicist, friends with Goethe and Kant, admired by Nietzsche, Schopenhauer, etc. Such wonderful random thoughts, beautiful perspectives on thinking for yourself, observing nature, language, freedom, philosophy, religion, and more. Hundreds of initial insights, especially inspiring because they’re undeveloped. Hundreds of initial insights, especially inspiring because they’re undeveloped.\
        Tweets from 1765-1799 by a 4’9” hunchback physicist, friends with Goethe and Kant, admired by Nietzsche, Schopenhauer, etc. Such wonderful random thoughts, beautiful perspectives on thinking for yourself, observing nature, language, freedom, philosophy, religion, and more. Hundreds of initial insights, especially inspiring because they’re undeveloped. Hundreds of initial insights, especially inspiring because they’re undeveloped.",
        cover: "<img src='https://placehold.co/160x240' alt='' />",
    },
];

async function getBooks() {
    return books;
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    const books = await getBooks();
    console.log(books);
    res.render("index.ejs", { books: books });
});

app.get("/books/:id", (req, res) => {
    const book = books.find((book) => book.isbn === req.params.id);
    if (book) {
        res.render("book.ejs", { book: book });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
