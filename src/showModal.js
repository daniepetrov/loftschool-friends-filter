// Show modals with click on button

import {buttonOpen, modalClose, modalFilter, overlay} from './selectors';



modalClose.addEventListener('click', () => {
    modalFilter.style.display = 'none';
});

overlay.addEventListener('click', () => {
    modalFilter.style.display = 'none';
});

