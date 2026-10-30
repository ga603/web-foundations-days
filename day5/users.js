const loadBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusText = document.getElementById('status');
const usersList = document.getElementById('users-list');

let usersArray = [];

async function loadUsers() {
    loadBtn.disabled = true;
    statusText.textContent = 'Loading...';
    usersList.innerHTML = '';
    
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        usersArray = await response.json();
        statusText.textContent = 'Success!';
        renderUsers(usersArray);
    } catch (error) {
        statusText.textContent = 'Error loading users.';
        console.error(error);
    } finally {
        loadBtn.disabled = false;
    }
}

function renderUsers(list) {
    usersList.innerHTML = '';
    
    if (list.length === 0) {
        const noMatch = document.createElement('li');
        noMatch.textContent = 'No users match your filter.';
        usersList.appendChild(noMatch);
        return;
    }

    list.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} | ${user.email} | ${user.address.city} | ${user.company.name}`;
        usersList.appendChild(li);
    });
}

filterInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = usersArray.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    renderUsers(filteredUsers);
});

loadBtn.addEventListener('click', loadUsers);