// Select elements

const buttonOpen = document.querySelector('#buttonOpen');
const modalFilter = document.querySelector('#modalFilter');
const modalClose = document.querySelector('#modalFilter  .modalClose');
const overlay = document.querySelector('#modalFilter .overlay');

// Show modals with click on button

buttonOpen.addEventListener('click', () => {
    modalFilter.style.display = 'flex';
});

modalClose.addEventListener('click', () => {
    modalFilter.style.display = 'none';
});

overlay.addEventListener('click', () => {
    modalFilter.style.display = 'none';
});


