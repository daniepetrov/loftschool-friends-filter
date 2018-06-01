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
    modalFilter,
    saveListsBtn
} from './selectors';


(async () => {
    try {

        if (localStorage.friendsList1) {
            window.friends = JSON.parse(localStorage.getItem('friendsList1'));
            window.friendsInList = JSON.parse(localStorage.getItem('friendsList2'));
            renderFriends(friends, friendsList1);
            renderFriends(friendsInList, friendsList2, true);

        } else {
            await auth();
            const response = await callAPI('friends.get', {fields: 'photo_50'});
            window.friends = response.items;
            window.friendsInList = [];
            renderFriends(friends, friendsList1);
        }

        let friendsFiltered = [];
        let friendsInListFiltered = [];

        friendsList1.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const nodeName = e.target.previousElementSibling.textContent;

                for (let i = 0; i < friends.length; i++) {
                    const fullName = `${friends[i].first_name} ${friends[i].last_name}`;
                    if (fullName === nodeName) {
                        if (!~friendsInList.indexOf(friends[i])) {
                            friendsInList.push(friends[i]);
                        }
                    }
                }
                friendsList2.innerHTML = '';
                renderFriends(friendsInList, friendsList2, true);
            }
        });

        friendsList2.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const nodeName = e.target.previousElementSibling.textContent;

                friendsList2.innerHTML = '';

                if(filterInput2.value !== '') {
                    for (let i = 0; i < friendsInListFiltered.length; i++) {
                        const fullName = `${friendsInListFiltered[i].first_name} ${friendsInListFiltered[i].last_name}`;
                        if (fullName === nodeName) {
                            friendsInListFiltered.splice(i, 1);
                            friendsInList.splice(i, 1);

                        }
                    }
                    renderFriends(friendsInListFiltered, friendsList2, true);
                } else {
                    for (let i = 0; i < friendsInList.length; i++) {
                        const fullName = `${friendsInList[i].first_name} ${friendsInList[i].last_name}`;
                        if (fullName === nodeName) {
                            friendsInList.splice(i, 1);

                        }
                    }
                    renderFriends(friendsInList, friendsList2, true);
                }
            }
        });

        filterInput1.addEventListener('input', () => {

            let {value} = filterInput1;
            value = value.toLowerCase();

            friendsFiltered = friends.filter(friend => {
                const fullName = `${friend.first_name} ${friend.last_name}`.toLowerCase();
                return fullName.includes(value);
            });

            friendsList1.innerHTML = '';
            renderFriends(friendsFiltered, friendsList1);
        });

        filterInput2.addEventListener('input', () => {

            let {value} = filterInput2;
            value = value.toLowerCase();

            friendsInListFiltered = friendsInList.filter(friend => {
                const fullName = `${friend.first_name} ${friend.last_name}`.toLowerCase();
                return fullName.includes(value);
            });
            friendsList2.innerHTML = '';
            renderFriends(friendsInListFiltered, friendsList2, true);
        });


        saveListsBtn.addEventListener('click', function () {
            writeToLocalStorage('friendsList1', friends);
            writeToLocalStorage('friendsList2', friendsInList);
        });

    } catch (e) {
        console.log(e);
    }
})();



function writeToLocalStorage(key, obj) {
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

