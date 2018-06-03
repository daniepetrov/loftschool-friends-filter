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
    saveListsBtn
} from './selectors';


(async () => {
    try {
        if (localStorage.friendsList1) {
            writeToSessionStorage('friendsList1', JSON.parse(localStorage.getItem('friendsList1')));
            writeToSessionStorage('friendsList2', JSON.parse(localStorage.getItem('friendsList2')));

        } else {
            await auth();
            const response = await callAPI('friends.get', {fields: 'photo_50'});
            writeToSessionStorage('friendsList1', response.items);
            writeToSessionStorage('friendsList2', []);
        }

        let friends = JSON.parse(sessionStorage.getItem('friendsList1'));
        let friendsSelected = JSON.parse(sessionStorage.getItem('friendsList2'));

        let friendsFiltered = [];
        let friendsSelectedFiltered = [];

        renderFriends(friends, friendsList1);
        renderFriends(friendsSelected, friendsList2, true);

        makeDND([friendsList1, friendsList2]);


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


        friendsList1.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                let elem = e.target.parentNode;

                if(filterInput1.value === '') {
                    addFriend(elem, friends, friendsSelected);
                    removeFriend(elem, friends);
                    renderFriends(friends, friendsList1);
                    renderFriends(friendsSelected, friendsList2, true);
                } else {
                    addFriend(elem, friends, friendsSelected);
                    removeFriend(elem, friends);
                    removeFriend(elem, friendsFiltered);
                    renderFriends(friendsFiltered, friendsList1);
                    renderFriends(friendsSelected, friendsList2, true);
                }

            }
        });

        friendsList2.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                let elem = e.target.parentNode;
                if(filterInput2.value === '') {
                    addFriend(elem, friendsSelected, friends);
                    removeFriend(elem, friendsSelected);
                    renderFriends(friendsSelected, friendsList2, true);
                    renderFriends(friends, friendsList1);
                } else {
                    addFriend(elem, friendsSelected, friends);
                    removeFriend(elem, friendsSelected);
                    removeFriend(elem, friendsSelectedFiltered);
                    renderFriends(friendsSelectedFiltered, friendsList2, true);
                    renderFriends(friends, friendsList1);
                }
            }
        });

        filterInput2.addEventListener('input', () => {

            let {value} = filterInput2;
            value = value.toLowerCase();

            friendsSelectedFiltered = friendsSelected.filter(friend => {
                const fullName = `${friend.first_name} ${friend.last_name}`.toLowerCase();
                return fullName.includes(value);
            });
            friendsList2.innerHTML = '';
            renderFriends(friendsSelectedFiltered, friendsList2, true);
        });


        saveListsBtn.addEventListener('click', function () {
            writeToLocalStorage('friendsList1', friends);
            writeToLocalStorage('friendsList2', friendsSelected);
        });

        function addFriend(elem, arrayFrom, arrayTo) {
            const nodeName = elem.children[1].textContent;
            for (let i = 0; i < arrayFrom.length; i++) {
                const fullName = `${arrayFrom[i].first_name} ${arrayFrom[i].last_name}`;
                if (nodeName === fullName) {
                    arrayTo.push(arrayFrom[i]);
                }
            }
        }

        function removeFriend(elem, array) {
            const nodeName = elem.children[1].textContent;
            for (let i = 0; i < array.length; i++) {
                const fullName = `${array[i].first_name} ${array[i].last_name}`;
                if (nodeName === fullName) {
                    array.splice(i, 1);
                }
            }
        }

        function makeDND(zones) {
            let currentDrag;

            let zone1 = zones[0];
            let zone2 = zones[1];

            zones.forEach(zone => {
                zone.addEventListener('dragstart', (e) => {
                    currentDrag = {source: zone, node: e.target};
                });

                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                zone.addEventListener('drop', (e) => {
                    if (currentDrag) {
                        e.preventDefault();

                        if (currentDrag.source === zone1) {
                            addFriend(currentDrag.node, friends, friendsSelected);
                            removeFriend(currentDrag.node, friends);
                            renderFriends(friends, friendsList1);
                            renderFriends(friendsSelected, friendsList2, true);
                        } else {
                            addFriend(currentDrag.node, friendsSelected, friends);
                            removeFriend(currentDrag.node, friendsSelected);
                            renderFriends(friendsSelected, friendsList2, true);
                            renderFriends(friends, friendsList1);
                        }
                        currentDrag = null;
                    }
                });
            })
        }

    } catch (e) {
        console.log(e);
    }
})();


function writeToSessionStorage(key, obj) {
    sessionStorage.setItem(key, JSON.stringify(obj))
}

function writeToLocalStorage(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj))
}

function createFriendNode(friend) {
    return `<div class="friend" draggable="true">
        <div class="friendImg">
            <img src="${friend.photo_50}" alt="">
        </div>
        <div class="friendName">${friend.first_name} ${friend.last_name}</div>
        <button class="friendAddBtn"></button>
    </div>`;
}

function createFriendNodeFiltered(friend) {
    return `<div class="friend" draggable="true">
        <div class="friendImg">
            <img src="${friend.photo_50}" alt="">
        </div>
        <div class="friendName">${friend.first_name} ${friend.last_name}</div>
        <button class="friendRemoveBtn"></button>
    </div>`;
}

function renderFriends(friends, appendTo, isFiltered) {
    friends.sort(compare);

    if (isEmpty(friends)) {
        appendTo.innerHTML = `<div class="noFriends">Нет друзей :'(</div>`
    } else {
        appendTo.innerHTML = '';
        for (const friend of friends) {
            if (isFiltered) {
                appendTo.innerHTML += createFriendNodeFiltered(friend);
            } else {
                appendTo.innerHTML += createFriendNode(friend);
            }
        }
    }
}

function compare(a, b) {
    if (a.first_name > b.first_name) return 1;
    if (a.first_name < b.first_name) return -1;
}