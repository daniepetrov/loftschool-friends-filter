// imports
import './styles.scss';
import {isEmpty} from './helpers';
import './showModal';
import {auth, callAPI} from './login';

import {
    friendsList1,
    friendsList2,
    filterInput1,
    filterInput2,
    buttonOpen,
    modalFilter
} from './selectors';

if (localStorage.friendsList1) {
    renderFriends(JSON.parse(localStorage.getItem('friendsList1')), friendsList1)
} else {
    auth()
        .then(() => {
            return callAPI('friends.get', {fields: 'photo_50'});
        })
        .then(friends => {
            writeToStorage('friendsList1', friends.items);
            renderFriends(friends.items, friendsList1);
        });
}

const friendsObj = JSON.parse(localStorage.getItem('friendsList1'));
const filteredObj = [];

function writeToStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj))
}

function createFriendNode(friend) {
    return `<div class="friend">
        <div class="friendImg">
            <img src="${friend.photo_50}" alt="">
        </div>
        <div class="friendName">${friend.first_name} ${friend.last_name}</div>
        <button class="friendAddBtn"></button>
    </div>`;
}

function createFriendNodeFiltered(friend) {
    return `<div class="friend">
        <div class="friendImg">
            <img src="${friend.photo_50}" alt="">
        </div>
        <div class="friendName">${friend.first_name} ${friend.last_name}</div>
        <button class="friendRemoveBtn"></button>
    </div>`;
}

function renderFriends(friends, appendTo, isFiltered) {
    if (isEmpty(friends)) {
        appendTo.innerHTML = `<div class="noFriends">Таких друзей не найдено :'(</div>`
    } else {
        for (const friend of friends) {
            if (isFiltered) {
                appendTo.innerHTML += createFriendNodeFiltered(friend);
            } else {
                appendTo.innerHTML += createFriendNode(friend);
            }
        }
    }
}

buttonOpen.addEventListener('click', () => {
    modalFilter.style.display = 'flex';
});

filterInput1.addEventListener('input', () => {

    const {value} = filterInput1;

    const filtered = friendsObj.filter(friend => {
        const fullName = `${friend.first_name} ${friend.last_name}`;
        return fullName.includes(value);
    });

    friendsList1.innerHTML = '';
    renderFriends(filtered, friendsList1);
});


friendsList1.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const nodeName = e.target.previousElementSibling.textContent;

        for (let i = 0; i < friendsObj.length; i++) {
            const fullName = `${friendsObj[i].first_name} ${friendsObj[i].last_name}`;
            if (fullName === nodeName) {
                if (!~filteredObj.indexOf(friendsObj[i])) {
                    filteredObj.push(friendsObj[i]);
                }
            }
        }
        friendsList2.innerHTML = '';
        renderFriends(filteredObj, friendsList2, true);
    }
});


filterInput2.addEventListener('input', () => {

    const {value} = filterInput2;

    const filtered = filteredObj.filter(friend => {
        const fullName = `${friend.first_name} ${friend.last_name}`;
        return fullName.includes(value);
    });

    friendsList2.innerHTML = '';
    renderFriends(filtered, friendsList2, true);
});

friendsList2.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const nodeName = e.target.previousElementSibling.textContent;
        let newArr = [];

        for (let i = 0; i < filteredObj.length; i++) {
            const fullName = `${filteredObj[i].first_name} ${filteredObj[i].last_name}`;
            if (fullName === nodeName) {
                newArr = filteredObj.filter(friend => friend !== filteredObj[i]);
            }
        }
        friendsList2.innerHTML = '';
        renderFriends(newArr, friendsList2, true);
    }
});

