document.getElementById("main").addEventListener('click', function () {
    window.location.href = './MAIN.html';
});

document.getElementById("contacts").addEventListener('click', function () {
    window.location.href = './Contacts.html';
});

document.getElementById("aboutUs").addEventListener('click', function () {
    window.location.href = './aboutUs.html';
});

var returnBtn = document.querySelector(".returnToMain");
if (returnBtn) {
    returnBtn.addEventListener('click', function () {
        window.location.href = './MAIN.html';
    });
}

let header = document.querySelector('.menu');

if (header) {
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle-btn';
    toggleBtn.id = 'menuToggle';
    toggleBtn.textContent = '☰ Меню'; 
    toggleBtn.setAttribute('aria-label', 'Открыть меню');
    toggleBtn.setAttribute('aria-expanded', 'false');

    var dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
    dropdown.id = 'dropdownMenu';

    var menuItems = [
        ['Главная',        'main-drop',     './MAIN.html'],
        ['Наши контакты',  'contacts-drop', './Contacts.html'],
        ['О нас',          'aboutUs-drop',  './aboutUs.html']
    ];

    menuItems.forEach(function (item) {
        var link = document.createElement('div');
        link.textContent = item[0];
        link.id = item[1];

        if (item[0] === 'Главная')        link.className = 'toMain';
        if (item[0] === 'Наши контакты') link.className = 'contact';
        if (item[0] === 'О нас')          link.className = 'aboutUs';

        link.addEventListener('click', function () {
            window.location.href = item[2];
        });

        dropdown.appendChild(link);
    });

    header.appendChild(toggleBtn);
    header.appendChild(dropdown);

    toggleBtn.addEventListener('click', function (event) {
        event.stopPropagation();

        var isOpen = dropdown.classList.contains('open');

        if (isOpen) {
            dropdown.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.textContent = '☰ Меню';
        } else {
            dropdown.classList.add('open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            toggleBtn.textContent = '✕ Закрыть';
        }
    });

    document.addEventListener('click', function () {
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.textContent = '☰ Меню';
    });

    header.addEventListener('click', function (event) {
        event.stopPropagation();
    });
}
