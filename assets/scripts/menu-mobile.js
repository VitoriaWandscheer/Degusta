/** MENU MOBILE */
function menuShow() {
    let menuMobile = document.querySelector('.mobile-menu')
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.querySelector('.icon').src = "../assets/imagens/icon-menu.svg"
    } else {
        menuMobile.classList.add('open')
        document.querySelector('.icon').src = "../assets/imagens/icon-menu-close.svg"
    }
}

/** Animação da Página ao Cliclar em um .nav-link*/
document.addEventListener('DOMContentLoaded', function() {
    const smoothScrollLinks = document.querySelectorAll('.nav-link');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const target = document.querySelector(link.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
