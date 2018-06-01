// Show modals with click on button

import {buttonOpen, modalClose, modalFilter, overlay} from './selectors';


buttonOpen.addEventListener('click', () => {
    modalFilter.style.display = 'flex';
});


modalClose.addEventListener('click', () => {
    modalFilter.style.display = 'none';
});

overlay.addEventListener('click', () => {
    modalFilter.style.display = 'none';
});

