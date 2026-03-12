const header = document.getElementById("header");
const headerLink = document.getElementById("header-link");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
        headerLink.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
        headerLink.classList.remove("scrolled");
    }
});

document.getElementById("opt-btn")?.addEventListener("click", () => {
    const menu = document.getElementById("opt-menu");
    menu.classList.toggle("hide");
});

document.getElementById("search-cover").addEventListener("click", async () => {
    const isbn = document.getElementById("isbn").value;

    if (!isbn) {
        alert("Enter an ISBN to search for a cover");
        return;
    }

    const res = await fetch(`/cover?isbn=${isbn}`);
    const data = await res.json();

    document.querySelector(".book-img img").src = data.cover;
    document.getElementById("cover-url").value = data.cover;
});
