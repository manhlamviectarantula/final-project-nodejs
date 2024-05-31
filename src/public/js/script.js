let searchForm = document.querySelector('.header .search-form');
let navbar = document.querySelector('.header .navbar');

//search form
document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
}

//menu btn
document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
}

//cuộn trang sẽ xóa search form hoặc menu
window.onscroll = () =>{
    searchForm.classList.remove('active');
    navbar.classList.remove('active');
}

// slide
let slides = document.querySelectorAll('.home .slide');
let index = 0;

function next(){
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev(){
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}


// $(document).ready(function () {
//     let searchForm = $('.header .search-form');
//     let navbar = $('.header .navbar');
//     let slides = $('.home .slide');
//     let index = 0;

//     // Search form
//     $('#search-btn').click(function () {
//         searchForm.toggleClass('active');
//         navbar.removeClass('active');
//     });

//     // Menu button
//     $('#menu-btn').click(function () {
//         navbar.toggleClass('active');
//         searchForm.removeClass('active');
//     });

//     // Xóa search form hoặc menu khi cuộn trang
//     $(window).scroll(function () {
//         searchForm.removeClass('active');
//         navbar.removeClass('active');
//     });

//     // Slide
//     function next() {
//         slides.eq(index).removeClass('active');
//         index = (index + 1) % slides.length;
//         slides.eq(index).addClass('active');
//     }

//     function prev() {
//         slides.eq(index).removeClass('active');
//         index = (index - 1 + slides.length) % slides.length;
//         slides.eq(index).addClass('active');
//     }
// });
