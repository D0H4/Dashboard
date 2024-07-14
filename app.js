document.addEventListener('DOMContentLoaded', function() {
    function updateTime() {
        const now = new Date();
        const dateElement = document.getElementById('date');
        const timeElement = document.getElementById('time');

        if (dateElement && timeElement) {
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            timeElement.textContent = `${hours}:${minutes}:${seconds}`;

            const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    let currentDate = new Date();

    function updateCalendar() {
        const calendarElement = document.getElementById('calendar');
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthString = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        let calendarHTML = `
            <div class="calendar-header">
                <span class="calendar-nav" id="prevMonth">&#9664;</span>
                <h2>${year} ${monthString[month]}</h2>
                <span class="calendar-nav" id="nextMonth">&#9654;</span>
            </div>
        `;
        calendarHTML += '<table><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Tur</th><th>Fri</th><th>Sat</th></tr>';

        let date = 1;
        for (let i = 0; i < 6; i++) {
            calendarHTML += '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay.getDay()) {
                    calendarHTML += '<td></td>';
                } else if (date > lastDay.getDate()) {
                    calendarHTML += '<td></td>';
                } else {
                    const isCurrentDay = date === new Date().getDate() && 
                                            month === new Date().getMonth() && 
                                            year === new Date().getFullYear();
                    calendarHTML += `<td class="${isCurrentDay ? 'current-day' : ''}">${date}</td>`;
                    date++;
                }
            }
            calendarHTML += '</tr>';
            if (date > lastDay.getDate()) break;
        }
        calendarHTML += '</table>';

        calendarElement.innerHTML = calendarHTML;

        document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    }

    function changeMonth(delta) {
        currentDate.setMonth(currentDate.getMonth() + delta);
        updateCalendar();
    }

    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoItems = document.getElementById('todoItems');

    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
        addTodo();
        }
    });

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <div class="todo-checkbox"></div>
            <span class="todo-text">${todoText}</span>
        `;
        todoItems.appendChild(li);
        todoInput.value = '';

        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('click', function() {
            li.classList.toggle('completed');
        });
        }
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const addTabButton = document.querySelector('.add-tab-button');
    const addFavoriteButton = document.querySelector('.add-favorite-button');

    // Create context menu element
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.display = 'none';
    contextMenu.style.position = 'absolute';
    contextMenu.style.zIndex = '1000';
    document.body.appendChild(contextMenu);

    // Load saved tabs and favorites
    loadTabs();
    loadFavorites();

    // Set default tab
    setDefaultTab();

    // Change tab and right click event
    function setupTabButtonListeners() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
        activateTab(button);
        });

        button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, button, 'tab');
        });
    });
    }

    setupTabButtonListeners();

    // Add new tab
    addTabButton.addEventListener('click', () => {
    const newTabName = prompt('Your new tab name:');
    if (newTabName) {
        addNewTab(newTabName);
        saveTabs();
    }
    });

    // add Favorite site
    addFavoriteButton.addEventListener('click', () => {
    const name = prompt('Your favorite site\'s name:');
    let url = prompt('Your favorite site\'s url:');
    if (name && url) {
        if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
        }
        addFavorite(name, url);
    }
    });

    function addNewTab(tabName) {
    const newButton = document.createElement('button');
    newButton.className = 'tab-button';
    newButton.textContent = tabName;
    newButton.setAttribute('data-tab', tabName.toLowerCase());

    const newContent = document.createElement('div');
    newContent.className = 'tab-content';
    newContent.id = tabName.toLowerCase();

    addTabButton.parentNode.insertBefore(newButton, addTabButton);
    document.querySelector('.favorites-content').appendChild(newContent);

    setupTabButtonListeners();
    activateTab(newButton);
    }

    function addFavorite(name, url) {
    const activeTab = document.querySelector('.tab-content.active');
    const tabName = activeTab.id;
    const favoriteItem = createFavoriteElement(name, url);
    activeTab.appendChild(favoriteItem);

    saveFavorites();
    }

    function createFavoriteElement(name, url) {
    const favoriteItem = document.createElement('div');
    favoriteItem.className = 'favorite-item';
    favoriteItem.innerHTML = `
        <img src="https://www.google.com/s2/favicons?domain=${url}" alt="${name}" class="favorite-icon">
        <span class="favorite-name">${name}</span>
    `;
    favoriteItem.addEventListener('click', () => window.open(url, '_blank'));
    favoriteItem.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, favoriteItem, 'favorite');
    });
    return favoriteItem;
    }

    function saveFavorites() {
    const favorites = {};
    document.querySelectorAll('.tab-content').forEach(tab => {
        const tabName = tab.id;
        favorites[tabName] = Array.from(tab.querySelectorAll('.favorite-item')).map(item => ({
        name: item.querySelector('.favorite-name').textContent,
        url: item.querySelector('img').src.split('=')[1]
        }));
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    Object.entries(favorites).forEach(([tabName, tabFavorites]) => {
        const tabContent = document.getElementById(tabName);
        if (tabContent) {
        tabFavorites.forEach(fav => {
            const favoriteItem = createFavoriteElement(fav.name, fav.url);
            tabContent.appendChild(favoriteItem);
        });
        }
    });
    }

    function saveTabs() {
    const tabs = Array.from(document.querySelectorAll('.tab-button')).map(button => ({
        name: button.textContent,
        id: button.getAttribute('data-tab')
    }));
    localStorage.setItem('tabs', JSON.stringify(tabs));
    }

    function loadTabs() {
    const tabs = JSON.parse(localStorage.getItem('tabs')) || [];
    tabs.forEach(tab => {
        if (!document.querySelector(`[data-tab="${tab.id}"]`)) {
        addNewTab(tab.name);
        }
    });
    setupTabButtonListeners();
    }

    function activateTab(button) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.getAttribute('data-tab')).classList.add('active');
    }

    function showContextMenu(event, element, type) {
    contextMenu.innerHTML = '';
    if (type === 'tab') {
        contextMenu.innerHTML = `
        <div class="context-menu-item set-default">Set to default tab</div>
        <div class="context-menu-item delete-tab">Delete this tab</div>
        `;
    } else if (type === 'favorite') {
        contextMenu.innerHTML = `
        <div class="context-menu-item delete-favorite">remove Favorite</div>
        `;
    }

    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.clientX}px`;
    contextMenu.style.top = `${event.clientY}px`;

    contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', () => {
        if (item.classList.contains('set-default')) {
            setDefaultTab(element.getAttribute('data-tab'));
        } else if (item.classList.contains('delete-tab')) {
            deleteTab(element);
        } else if (item.classList.contains('delete-favorite')) {
            deleteFavorite(element);
        }
        contextMenu.style.display = 'none';
        });
    });
    }

    document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
    });

    function setDefaultTab(tabId) {
    if (tabId) {
        localStorage.setItem('defaultTab', tabId);
    } else {
        const defaultTabId = localStorage.getItem('defaultTab');
        if (defaultTabId) {
        const defaultTabButton = document.querySelector(`[data-tab="${defaultTabId}"]`);
        if (defaultTabButton) {
            activateTab(defaultTabButton);
        }
        }
    }
    }

    function deleteTab(tabButton) {
    const tabId = tabButton.getAttribute('data-tab');
    const tabContent = document.getElementById(tabId);

    if (document.querySelectorAll('.tab-button').length > 1) {
        tabButton.remove();
        tabContent.remove();
        saveTabs();
        
        // if delete tab is active tab, activate first tab
        if (tabButton.classList.contains('active')) {
        const firstTab = document.querySelector('.tab-button');
        if (firstTab) {
            activateTab(firstTab);
        }
        }
    } else {
        alert('Last tab cannot be deleted.');
    }
    }

    function deleteFavorite(favoriteItem) {
    favoriteItem.remove();
    saveFavorites();
    }

    updateTime();
    setInterval(updateTime, 1000);
    updateCalendar();
    });