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
        let friendsInList = JSON.parse(sessionStorage.getItem('friendsList2'));

        renderFriends(friends, friendsList1);
        renderFriends(friendsInList, friendsList2, true);


        let friendsFiltered = [];
        let friendsInListFiltered = [];

        makeDND([friendsList1, friendsList2]);

        friendsList1.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                let elem = e.target.parentNode;
                addToList(elem);
            }
        });

        friendsList2.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                let elem = e.target.parentNode;
                removeFromList(elem)
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

        function addToList(elem) {
            const nodeName = elem.children[1].textContent;

            if(filterInput2.value !== '') {

                for (let i = 0; i < friends.length; i++) {
                    const fullName = `${friends[i].first_name} ${friends[i].last_name}`;
                    if (fullName === nodeName) {
                        if (!~friendsInListFiltered.indexOf(friends[i])) {
                            if(~nodeName.toLocaleLowerCase().indexOf(filterInput2.value.toLowerCase())) {
                                friendsInListFiltered.push(friends[i]);
                            } else {
                                friendsInList.push(friends[i]);
                            }
                            friendsList2.innerHTML = '';
                            renderFriends(friendsInListFiltered, friendsList2, true);
                        }
                    }
                }
            } else {
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
        }
        function removeFromList(elem) {
            const nodeName = elem.children[1].textContent;

            friendsList2.innerHTML = '';

            if(filterInput2.value !== '') {
                for (let i = 0; i < friendsInListFiltered.length; i++) {
                    const fullName = `${friendsInListFiltered[i].first_name} ${friendsInListFiltered[i].last_name}`;
                    if (fullName === nodeName) {
                        let index = friendsInList.indexOf(friendsInListFiltered[i]);
                        friendsInList.splice(index, 1);
                        friendsInListFiltered.splice(i, 1);

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
                    if(currentDrag)  {
                        e.preventDefault();

                        if (currentDrag.source !== zone) {
                            if (zone === zone2) {
                                addToList(currentDrag.node);
                            } else {
                                removeFromList(currentDrag.node);
                            }
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
    if (isEmpty(friends)) {
        appendTo.innerHTML = `<div class="noFriends">Нет друзей :'(</div>`
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

