// imports
import './styles.scss';

import './showModal';
import {auth, callAPI} from './login';

import {friendsList1, filterInput1} from './selectors';

auth()
    .then(() => {
        return callAPI('friends.get', { fields: 'photo_50' });
    })
    .then(friends => {
        const template = document.querySelector('#friends-template').textContent;
        const render = Handlebars.compile(template);
        const html = render(friends);
        const results = document.querySelector('#friendsList1');

        results.innerHTML = html;
    });


filterInput1.addEventListener('input', () => {

    const {value} = filterInput1;

    for(const friendNode of friendsList1.children) {
        if(friendNode.textContent.includes(value)) {
            friendNode
        }
    }
});