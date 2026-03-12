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

const optBtn = document.getElementById("opt-btn");

optBtn?.addEventListener("click", () => {
    const menu = document.getElementById("opt-menu");
    menu.classList.toggle("hide");
});
