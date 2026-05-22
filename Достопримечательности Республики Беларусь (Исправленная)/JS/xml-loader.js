// Загружает XML файл с сервера и преобразует его в DOM объект
async function loadXML(xmlPath) {
    try {
        const response = await fetch(xmlPath);         
        if (!response.ok) throw new Error(`HTTP ${response.status}`); 
        const xmlText = await response.text();          
        const parser = new DOMParser();                
        const xmlDoc = parser.parseFromString(xmlText, "text/xml"); 
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) throw new Error("XML parsing error");
        return xmlDoc;                            
    } catch (error) {
        console.error("XML load error:", xmlPath, error); 
        return null;                         
    }
}

// Генерирует HTML для регионов
function generateAttractionsHTML(xmlDoc) {
    const attractions = xmlDoc.querySelectorAll("attraction");
    let html = '';
    
    attractions.forEach(attraction => {
        const image = attraction.querySelector("image")?.getAttribute("src") || "";
        const alt = attraction.querySelector("image")?.getAttribute("alt") || "";
        const title = attraction.querySelector("title")?.textContent || "";
        
        const paragraphs = attraction.querySelectorAll("paragraphs p");
        let paragraphsHTML = '';
        paragraphs.forEach(p => {
            paragraphsHTML += `<p>${p.textContent}</p>`;
        });
        
        html += `
            <div class="info">
                <div class="img"><img src="${image}" alt="${alt}"></div>
                <div class="text">
                    <h2>${title}</h2>
                    ${paragraphsHTML}
                </div>
            </div>
        `;
    });
    
    return html;
}

// Генерирует HTML для главной страницы
function generateMainPageHTML(xmlDoc) {
    const regions = xmlDoc.querySelectorAll("region");
    let html = '';
    
    regions.forEach(region => {
        const id = region.getAttribute("id");
        const image = region.getAttribute("image");    
        const alt = region.getAttribute("alt");           
        const name = region.querySelector("name")?.textContent || "";
        
        html += `
            <div class="region" id="${id}">
                <figure class="img"><img src="${image}" alt="${alt}"></figure>
                <div class="name">${name}</div>
            </div>
        `;
    });
    
    return html;
}

// Генерирует HTML для страницы "О нас"
function generateAboutUsHTML(xmlDoc) {
    const teamImage = xmlDoc.querySelector("team image")?.getAttribute("src") || "";
    const teamName = xmlDoc.querySelector("team name")?.textContent || "";
    const teamRole = xmlDoc.querySelector("team role")?.textContent || "";
    const teamDesc = xmlDoc.querySelector("team description")?.textContent || "";
    
    const stats = xmlDoc.querySelectorAll("team stats stat");
    let statsHTML = '';
    stats.forEach(stat => {
        const icon = stat.getAttribute("icon") || "";
        const value = stat.querySelector("value")?.textContent || "";
        const detail = stat.querySelector("detail")?.textContent || "";
        statsHTML += `
            <div class="member-item">
                <strong>${icon} ${value}</strong><br>
                <span style="font-size:13px;">${detail}</span>
            </div>
        `;
    });
    
    // Список главных достопримечательностей Беларуси
    const landmarks = xmlDoc.querySelectorAll("section[title='🏰 Достопримечательности Беларуси'] landmarks landmark");
    let landmarksHTML = '';
    landmarks.forEach(landmark => {
        const name = landmark.querySelector("name")?.textContent || "";
        const description = landmark.querySelector("description")?.textContent || "";
        landmarksHTML += `<li><strong>${name}</strong> – ${description}</li>`;
    });
    
    const aboutText = xmlDoc.querySelector("section[title='📌 О нас'] text")?.textContent || "";
    const missionText = xmlDoc.querySelector("section[title='🇧🇾 Наша миссия'] text")?.textContent || "";
    
    const offers = xmlDoc.querySelectorAll("section[title='🏆 Что мы предлагаем'] offers offer");
    let offersHTML = '';
    offers.forEach(offer => {
        offersHTML += `<li>✅ ${offer.textContent}</li>`;
    });
    
    const phone = xmlDoc.querySelector("contacts phone")?.textContent || "";
    const email = xmlDoc.querySelector("contacts email")?.textContent || "";
    const address = xmlDoc.querySelector("contacts address")?.textContent || "";
    
    return `
        <div class="about-card">
            <div class="two-columns">
                <!-- Левая колонка: информация о команде -->
                <div class="left-team">
                    <img class="team-img" src="${teamImage}" alt="Фото команды BelTravel">
                    <div class="team-name">${teamName}</div>
                    <div class="team-role">${teamRole}</div>
                    <div class="team-desc">${teamDesc}</div>
                    ${statsHTML}
                </div>
                <!-- Правая колонка: текст и списки -->
                <div class="right-content">
                    <div class="section-title">🏰 Достопримечательности Беларуси</div>
                    <ul class="landmark-list">${landmarksHTML}</ul>
                    <div class="section-title">📌 О нас</div>
                    <p class="text-muted">${aboutText}</p>
                    <div class="section-title">🇧🇾 Наша миссия</div>
                    <p class="text-muted">${missionText}</p>
                    <hr>
                    <div class="section-title">🏆 Что мы предлагаем</div>
                    <ul class="landmark-list">${offersHTML}</ul>
                    <div class="contacts-block">
                        📞 Контакты: ${phone} | ${email} | ${address}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Генерирует HTML для страницы контактов
function generateContactsHTML(xmlDoc) {
    const pageTitle = xmlDoc.querySelector("pageTitle")?.textContent || "";
    const subtitle = xmlDoc.querySelector("subtitle")?.textContent || "";
    
    const officeAddress = xmlDoc.querySelector("contactInfo office address")?.textContent || "";
    const officePostal = xmlDoc.querySelector("contactInfo office postal")?.textContent || "";
    
    const phones = xmlDoc.querySelectorAll("contactInfo phones phone");
    let phonesHTML = '';
    phones.forEach(phone => {
        phonesHTML += `${phone.textContent}<br>`;
    });
    
    const emails = xmlDoc.querySelectorAll("contactInfo emails email");
    let emailsHTML = '';
    emails.forEach(email => {
        emailsHTML += `<a href="mailto:${email.textContent}">${email.textContent}</a><br>`;
    });
    
    const hours = xmlDoc.querySelectorAll("contactInfo workingHours hours");
    let hoursHTML = '';
    hours.forEach(h => {
        const day = h.getAttribute("day") || "";
        hoursHTML += `${day}: ${h.textContent}<br>`;
    });
    
    return `
        <div class="title">
            <h1 class="page-title">${pageTitle}</h1>
            <p class="subtitle">${subtitle}</p>
        </div>
        <div class="contacts-container">
            <!-- Блок с контактной информацией -->
            <div class="contact-info-card">
                <h2>Наши контакты</h2>
                <div class="info-item"><div><strong>Центральный офис</strong><br>${officeAddress}<br>${officePostal}</div></div>
                <div class="info-item"><div><strong>Телефоны</strong><br>${phonesHTML}</div></div>
                <div class="info-item"><div><strong>Электронная почта</strong><br>${emailsHTML}</div></div>
                <div class="info-item"><div><strong>Режим работы</strong><br>${hoursHTML}</div></div>
            </div>
            <!-- Блок с формой отправки сообщения -->
            <div class="contact-form-card">
                <h2>Напишите нам</h2>
                <p>Заполните форму, и наш специалист свяжется с вами.</p>
                <form id="contactForm" novalidate>
                    <div class="form-group"><label for="fieldName">Ваше имя</label><input type="text" id="fieldName" placeholder="Иван Петров"><span class="error-message" id="errorName"></span></div>
                    <div class="form-group"><label for="fieldEmail">E-mail</label><input type="email" id="fieldEmail" placeholder="ivan@example.com"><span class="error-message" id="errorEmail"></span></div>
                    <div class="form-group"><label for="fieldPhone">Телефон</label><input type="tel" id="fieldPhone" placeholder="+375 (29) 123-45-67"><span class="error-message" id="errorPhone"></span></div>
                    <div class="form-group"><label for="fieldTopic">Тема сообщения</label><select id="fieldTopic"><option value="">– Выберите тему –</option><option>Экскурсии и туры</option><option>Бронирование отелей</option><option>Консультация</option><option>Сотрудничество</option></select><span class="error-message" id="errorTopic"></span></div>
                    <div class="form-group"><label for="fieldMessage">Сообщение</label><textarea rows="5" id="fieldMessage" placeholder="Расскажите, чем мы можем вам помочь..."></textarea><span class="error-message" id="errorMessage"></span></div>
                    <div class="form-group checkbox-group"><label class="checkbox-label"><input type="checkbox" id="fieldConsent"><span>Я согласен на обработку персональных данных</span></label><span class="error-message" id="errorConsent"></span></div>
                    <button type="submit" class="submit-btn">Отправить сообщение</button>
                    <div class="form-status" id="formStatus"></div>
                </form>
            </div>
        </div>
    `;
}


// Валидация формы
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        
        // Очищаем старые сообщения об ошибках
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        // Проверка имени (не пустое)
        const name = document.getElementById('fieldName');
        if (!name.value.trim()) {
            document.getElementById('errorName').textContent = 'Введите ваше имя';
            isValid = false;
        }
        
        // Проверка email (не пустой и правильный формат)
        const email = document.getElementById('fieldEmail');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            document.getElementById('errorEmail').textContent = 'Введите ваш email';
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            document.getElementById('errorEmail').textContent = 'Введите корректный email';
            isValid = false;
        }
        
        // Проверка телефона (не пустой)
        const phone = document.getElementById('fieldPhone');
        if (!phone.value.trim()) {
            document.getElementById('errorPhone').textContent = 'Введите номер телефона';
            isValid = false;
        }
        
        // Проверка темы (выбрана не пустая опция)
        const topic = document.getElementById('fieldTopic');
        if (!topic.value) {
            document.getElementById('errorTopic').textContent = 'Выберите тему сообщения';
            isValid = false;
        }
        
        // Проверка сообщения (не пустое)
        const message = document.getElementById('fieldMessage');
        if (!message.value.trim()) {
            document.getElementById('errorMessage').textContent = 'Введите сообщение';
            isValid = false;
        }
        
        // Проверка согласия (чекбокс отмечен)
        const consent = document.getElementById('fieldConsent');
        if (!consent.checked) {
            document.getElementById('errorConsent').textContent = 'Подтвердите согласие на обработку данных';
            isValid = false;
        }
        
        // Показываем результат валидации
        const statusDiv = document.getElementById('formStatus');
        if (isValid) {
            statusDiv.innerHTML = '<div class="success-message">✅ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.</div>';
            form.reset(); 
            setTimeout(() => { statusDiv.innerHTML = ''; }, 5000);
        } else {
            statusDiv.innerHTML = '<div class="error-message-global">❌ Пожалуйста, исправьте ошибки в форме.</div>';
            setTimeout(() => { statusDiv.innerHTML = ''; }, 3000);
        }
    });
    
    // Очистка ошибок при вводе текста (валидация в реальном времени)
    const inputs = ['fieldName', 'fieldEmail', 'fieldPhone', 'fieldTopic', 'fieldMessage'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() {
                const errorId = 'error' + id.charAt(0).toUpperCase() + id.slice(1);
                const errorEl = document.getElementById(errorId);
                if (errorEl) errorEl.textContent = '';
                const statusDiv = document.getElementById('formStatus');
                if (statusDiv) statusDiv.innerHTML = '';
            });
        }
    });
    
    // Очистка ошибки при изменении чекбокса
    const consentCheckbox = document.getElementById('fieldConsent');
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', function() {
            const errorEl = document.getElementById('errorConsent');
            if (errorEl && this.checked) errorEl.textContent = '';
        });
    }
}

// запуск пи загрузке
document.addEventListener("DOMContentLoaded", async () => {
    const currentPage = window.location.pathname.split("/").pop();
    
    let xmlFile = "";
    let generateFunction = null;
    
    switch(currentPage) {
        case "MAIN.html": 
            xmlFile = "../XML/MAIN.xml"; 
            generateFunction = generateMainPageHTML; 
            break;
        case "aboutUs.html": 
            xmlFile = "../XML/aboutUs.xml"; 
            generateFunction = generateAboutUsHTML; 
            break;
        case "Contacts.html": 
            xmlFile = "../XML/Contacts.xml"; 
            generateFunction = generateContactsHTML; 
            break;
        case "Brest.html": 
            xmlFile = "../XML/Brest.xml"; 
            generateFunction = generateAttractionsHTML; 
            break;
        case "Gomel.html": 
            xmlFile = "../XML/Gomel.xml"; 
            generateFunction = generateAttractionsHTML; 
            break;
        case "Grodno.html": 
            xmlFile = "../XML/Grodno.xml"; 
            generateFunction = generateAttractionsHTML; 
            break;
        case "Minsk.html": 
            xmlFile = "../XML/Minsk.xml"; 
            generateFunction = generateAttractionsHTML; 
            break;
        case "Mogilev.html": 
            xmlFile = "../XML/Mogilev.xml"; 
            generateFunction = generateAttractionsHTML; 
            break;
        case "Vitebsk.html": 
            xmlFile = "../XML/Vitebsk.xml"; 
            generateFunction = generateAttractionsHTML; 
            break;
        default: return; 
    }
    
    // Загружаем XML файл
    const xmlDoc = await loadXML(xmlFile);
    const mainElement = document.querySelector("main");
    
    if (xmlDoc && generateFunction && mainElement) {
        const generatedHTML = generateFunction(xmlDoc);
        
        if (currentPage !== "MAIN.html" && currentPage !== "aboutUs.html" && currentPage !== "Contacts.html") {
            mainElement.innerHTML = generatedHTML + `<div class="returnToMain"><p>Вернуться на главную</p></div>`;
        } else {
            mainElement.innerHTML = generatedHTML;
        }
        
        const returnBtn = document.querySelector(".returnToMain");
        if (returnBtn) {
            returnBtn.addEventListener("click", () => {
                window.location.href = "MAIN.html";
            });
        }
        
        if (currentPage === "Contacts.html") {
            initFormValidation();
        }
        
        if (currentPage === "MAIN.html") {
            const regions = document.querySelectorAll('.region');
            regions.forEach(region => {
                region.addEventListener('click', () => {
                    const regionId = region.getAttribute('id');
                    switch(regionId) {
                        case 'brest': window.location.href = 'Brest.html'; break;
                        case 'gomel': window.location.href = 'Gomel.html'; break;
                        case 'grodno': window.location.href = 'Grodno.html'; break;
                        case 'minsk': window.location.href = 'Minsk.html'; break;
                        case 'mogilev': window.location.href = 'Mogilev.html'; break;
                        case 'vitebsk': window.location.href = 'Vitebsk.html'; break;
                    }
                });
            });
        }
    } else if (mainElement) {
        // Если не удалось загрузить данные - показываем ошибку
        mainElement.innerHTML = '<div style="text-align:center;padding:50px;">Не удалось загрузить данные. Проверьте подключение к интернету.</div>';
    }
});