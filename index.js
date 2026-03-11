import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

db.connect();
let books = [
    {
        isbn: "1234567890",
        title: "Waste Books",
        author: "Georg Christoph Lichtenberg",
        rating: 4,
        readIn: moment().format("DD/MM/YYYY"),
        synopsis:
            "Tweets from 1765-1799 by a 4’9” hunchback physicist, friends with Goethe and Kant, admired by Nietzsche, Schopenhauer, etc. Such wonderful random thoughts, beautiful perspectives on thinking for yourself, observing nature, language, freedom, philosophy, religion, and more. Hundreds of initial insights, especially inspiring because they’re undeveloped.",
        review: "Very thought provoking.",
        notes: "He called them his “waste books” after the name given to notebooks kept by accountants in England for their rough calculations and lists of transactions, which were later transferred to a journal and finally to a formal ledger. There is never a time when we are not doing philosophy, since our common language is embedded with philosophical views and commitments with which we always operate. To match versification to thought is a very difficult art, the neglect of which is responsible for much ridiculous verse. Versification and thought are",
        cover: "<img src='https://placehold.co/160x240' alt='' />",
    },
    {
        isbn: "0987654321",
        title: "You Can Negotiate Anything",
        author: "Herb Cohen",
        rating: 5,
        readIn: moment().format("DD/MM/YYYY"),
        synopsis:
            "Everything is negotiable. Challenge authority. You have the power in any situation. This is how to realize it and use it. A must-read classic from 1980 from a master negotiator. My notes here aren’t enough because the little book is filled with so many memorable stories — examples of great day-to-day moments of negotiation that will stick in your head for when you need them. (I especially loved the one about the power of the prisoner in solitary confinement.) So go buy and read the book. I’m giving it a 10/10 rating even though the second half of the book loses steam, because the first half is so crucial.",
        review: "Excelet book",
        notes: "Power is the capacity or ability to get things done. It determines whether you can or can’t influence your environment. It gives you a sense of mastery over your life. All power is based on perception. If you think you’ve got it, then you’ve got it. You have more power if you believe you have power and view your life’s encounters as negotiations. Most people firmly believe that they can’t negotiate. This is a prime example of creating a self-fulfilling prophecy.",
        cover: "<img src='https://placehold.co/160x240' alt='' />",
    },
];

async function getBooks() {
    const res = await db.query("SELECT * FROM books;");
    books = res.rows;
    return books;
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    let books = await getBooks();
    // console.log(books);
    res.render("index.ejs", { books: books });
});

app.get("/books/:id", (req, res) => {
    const book = books.find((book) => book.id == req.params.id);
    if (book) {
        res.render("book.ejs", { book: book });
    } else {
        res.render("index.ejs", { books: getBooks() });
    }
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.post("/add", async (req, res) => {
    const book = {
        isbn: req.body.isbn || "0000000000",
        title: req.body.title || "No title",
        author: req.body.author || "No author",
        rating: req.body.rating || 0,
        readIn: req.body.readin || null,
        synopsis: req.body.synopsis || "",
        review: req.body.review || "",
        notes: req.body.notes || "",
        coverUrl: `https://example.com/${req.body.isbn}`,
    };

    try {
        let query = `
        INSERT INTO books 
        (isbn, title, author, rating, read_in, synopsis, review, cover_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
        RETURNING *`;

        let values = [
            book.isbn,
            book.title,
            book.author,
            book.rating,
            book.readIn,
            book.synopsis,
            book.review,
            book.coverUrl,
        ];
        console.log(values);

        let response = await db.query(query, values);
        console.log(response);
        const bookId = response.rows[0].id;

        if (book.notes) {
            const notesQuery = `INSERT INTO notes (book_id, content) VALUES ($1, $2) RETURNING *`;
            response = await db.query(notesQuery, [bookId, book.notes]);
            console.log(response);
        }

        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao inserir livro1");
    }
});

app.get("/books/:id/edit", (req, res) => {
    const book = books.find((book) => book.id == req.params.id);
    if (book) {
        res.render("edit.ejs", { book: book });
    }
});

app.post("/books/:id/edit", (req, res) => {});

app.post("/books/:id/delete", (req, res) => {});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
