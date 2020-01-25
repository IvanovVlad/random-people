const loadedUsers = [];

class User {
    constructor(name, location, picture, email, phone) {
        this.titleName = name.title;
        this.firstName = name.first;
        this.lastName = name.last;
        this.contacts = {};
        this.contacts.adress = {};
        this.contacts.adress.street = location.street;
        this.contacts.adress.city = location.city;
        this.contacts.adress.state = location.state;
        this.contacts.email = email;
        this.contacts.phone = phone;
        this.avatar = {};
        this.avatar.large = picture.large;
        this.avatar.medium = picture.medium;
    }

    getName() {
        return `${this.titleName} ${this.firstName} ${this.lastName}`;
    }

    createNoteElement() {
        const note = document.createElement('div');
        note.className = 'user';
        note.innerHTML = `
        <div class="user-avatar"><img src="${this.avatar.medium}" alt=""></div>
        <div class="user-name">
            <div class="name">${this.getName()}</div>
        </div>
        `;
        note.onclick = () => {
            this.popWindow();
        };
        document.querySelector('.list-users').appendChild(note);
    }

    popWindow() {
        const wrapper = document.createElement('div');
        wrapper.style = `position: fixed; display: flex; align-items: center; justify-content: center; 
                        top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5)`;

        wrapper.onclick = function (e) { if (e.target === this) this.remove() };

        const window = document.createElement('div');
        window.style = 'padding: 30px; text-align: center; font-size: 28px; background-color: white;  border-radius: 5%;';
        window.innerHTML = `
            <div><img src="${this.avatar.large}" style="width: 200px; border-radius: 5%"></div>
            <div>${this.contacts.adress.street}</div>
            <div>${this.contacts.adress.city}</div>
            <div>${this.contacts.adress.state}</div>
            <div>${this.contacts.email}</div>
            <div>${this.contacts.phone}</div>
        `;
        wrapper.appendChild(window);
        document.body.appendChild(wrapper);
    }

    compare(user) {
        if (this.firstName < user.firstName) {
            return -1;
        }
        if (this.firstName > user.firstName) {
            return 1;
        }
        return 0;
    }
}

function createControls() {
    const wrapper = document.createElement('div');
    wrapper.style = 'margin: 10px;';

    const selector = document.createElement('select');
    selector.style = 'cursor: pointer; font-size: 20px;';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.text = 'Select sorting method';
    placeholder.hidden = true;
    const option1 = document.createElement('option');
    option1.value = 'abc Sort';
    option1.text = 'abc Sort';
    const option2 = document.createElement('option');
    option2.value = 'Reverse Sort';
    option2.text = 'Reverse Sort';
    selector.appendChild(placeholder);
    selector.appendChild(option1);
    selector.appendChild(option2);

    selector.onchange = (e) => {
        loadedUsers.sort((firstUser, nextUser) => {
            return (e.target.value === 'Reverse Sort') ?
                firstUser.compare(nextUser) * -1 : firstUser.compare(nextUser);
        });
        document.querySelector('.list-users').innerHTML = '';
        loadedUsers.forEach(element => {
            element.createNoteElement();
        });
    };

    wrapper.appendChild(selector);

    document.querySelector('.list-controls').appendChild(wrapper);
}

function getAndDisplayUsers(url) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            JSON.parse(this.responseText).results.forEach(element => {
                const user = new User(element.name, element.location,
                    element.picture, element.email, element.phone);
                loadedUsers.push(user);
                user.createNoteElement();
            });
        }
        if (xhr.status == 404) {
            console.log('Error 404');
        }
    }
    xhr.open('get', url, true)
    xhr.send();
}

(function startApp() {
    const url = 'https://api.randomuser.me/1.0/?results=50&nat=gb,us&inc=gender,name,location,email,phone,picture';
    createControls();
    getAndDisplayUsers(url);
})();