// imports
import './styles.scss';
import './model';

import './showModal';
import {buttonOpen} from './selectors';

// Authorize VK

Model.login(6491454, 2 | 8192)
    .then(() => {
        console.log('Вы успешно авторизовались!')
    })
    .catch(e => {
        console.error(e);
        alert('Ошибка: ' + e.message);
    });


// Model.getFriends({fields: 'photo_100'})
//     .then((data) => {
//         console.log(data)
//     })
//     .catch(e => {
//         console.error(e);
//     });

const friendsGet = async () => {
    const result = await Model.getFriends({fields: 'photo_100'});
    console.log(result);
};

const getBtn = document.querySelector('#buttonGet');

getBtn.addEventListener('click', friendsGet());
