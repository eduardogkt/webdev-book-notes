INSERT INTO books (
    title,
    author,
    isbn,
    cover_url,
    synopsis,
    review,
    rating,
    read_in
) VALUES 
(
    'Duna',
    'Frank Herbert',
    '9780441172719',
    'https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg',
    'Uma história sobre política, religião e poder no planeta desértico Arrakis.',
    'Excelente worldbuilding e temas políticos profundos.',
    5,
    '2025-02-10'
),
(
    '1984',
    'George Orwell',
    '9780451524935',
    'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg',
    'Um futuro distópico onde o governo controla tudo.',
    'Uma crítica poderosa ao totalitarismo.',
    4,
    '2025-03-15'
);

-- Inserir nota apenas para o primeiro livro
INSERT INTO notes (
    book_id,
    content
) VALUES
(
    1,
    'Capítulo 3 tem uma explicação muito boa sobre a especiaria e a política de Arrakis.'
);