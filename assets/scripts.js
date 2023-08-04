function menuShow() {
    let menuMobile = document.querySelector('.mobile-menu')
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.querySelector('.icon').src = "assets/img/icon-menu.png"
    } else {
        menuMobile.classList.add('open')
        document.querySelector('.icon').src = "assets/img/icon-menu-close.png"
    }
}

