let currentIndex = 0;
const backgrounds = [
    '/Assets/A2.jpg',
    '/Assets/A3.jpg', 
    '/Assets/A5.jpg',
    '/Assets/A4.jpg',
    '/Assets/A7.jpg',
    '/Assets/A6.jpg'
];

const welcomeSection = document.querySelector('.welcome');
welcomeSection.style.backgroundImage = `url('${backgrounds[currentIndex]}')`;

setInterval(() => {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    welcomeSection.style.backgroundImage = `url('${backgrounds[currentIndex]}')`;
}, 2000);

document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("popup");
    const closeBtn = document.getElementById("close-popup");

    if (popup) {
        popup.style.display = "block";

        closeBtn.addEventListener("click", function () {
            popup.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target === popup) {
                popup.style.display = "none";
            }
        });
    }
});

const mobileMenu = document.getElementById("mobile-menu");
if (mobileMenu) {
    mobileMenu.addEventListener("click", function() {
        document.querySelector(".nav-links").classList.toggle("active");
    });
}
