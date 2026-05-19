/**
 * Загружает и парсит XML файл
 * @param {string} xmlPath - путь к XML файлу
 * @returns {Promise<Document>} - Promise с XML документом
 */
async function loadXML(xmlPath) {
    try {
        const response = await fetch(xmlPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Проверка на ошибки парсинга
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
            throw new Error("XML parsing error: " + parserError.textContent);
        }
        
        return xmlDoc;
    } catch (error) {
        console.error("Error loading XML:", error);
        return null;
    }
}

/**
 * Генерирует HTML для списка достопримечательностей из XML
 * @param {Document} xmlDoc - XML документ
 * @returns {string} - HTML строка
 */
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

/**
 * Генерирует HTML для главной страницы из XML
 * @param {Document} xmlDoc - XML документ
 * @returns {string} - HTML строка
 */
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

/**
 * Генерирует HTML для страницы "О нас" из XML
 * @param {Document} xmlDoc - XML документ
 * @returns {string} - HTML строка
 */
function generateAboutUsHTML(xmlDoc) {
    // Извлекаем данные команды
    const teamName = xmlDoc.querySelector("team name")?.textContent || "";
    const teamRole = xmlDoc.querySelector("team role")?.textContent || "";
    const teamDesc = xmlDoc.querySelector("team description")?.textContent || "";
    const teamImage = xmlDoc.querySelector("team image")?.getAttribute("src") || "";
    
    // Статистика команды
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
    
    // Достопримечательности
    const landmarks = xmlDoc.querySelectorAll("section[title='🏰 Достопримечательности Беларуси'] landmarks landmark");
    let landmarksHTML = '';
    landmarks.forEach(landmark => {
        const name = landmark.querySelector("name")?.textContent || "";
        const description = landmark.querySelector("description")?.textContent || "";
        landmarksHTML += `<li><strong>${name}</strong> – ${description}</li>`;
    });
    
    // Секции с текстом
    const aboutText = xmlDoc.querySelector("section[title='📌 О нас'] text")?.textContent || "";
    const missionText = xmlDoc.querySelector("section[title='🇧🇾 Наша миссия'] text")?.textContent || "";
    
    // Предложения
    const offers = xmlDoc.querySelectorAll("section[title='🏆 Что мы предлагаем'] offers offer");
    let offersHTML = '';
    offers.forEach(offer => {
        offersHTML += `<li>✅ ${offer.textContent}</li>`;
    });
    
    // Контакты
    const phone = xmlDoc.querySelector("contacts phone")?.textContent || "";
    const email = xmlDoc.querySelector("contacts email")?.textContent || "";
    const address = xmlDoc.querySelector("contacts address")?.textContent || "";
    
    return `
        <div class="about-card">
            <div class="two-columns">
                <div class="left-team">
                    <img class="team-img" src="${teamImage}" alt="Фото команды BelTravel">
                    <div class="team-name">${teamName}</div>
                    <div class="team-role">${teamRole}</div>
                    <div class="team-desc">${teamDesc}</div>
                    ${statsHTML}
                </div>
                <div class="right-content">
                    <div class="section-title">🏰 Достопримечательности Беларуси</div>
                    <ul class="landmark-list">
                        ${landmarksHTML}
                    </ul>
                    <div class="section-title">📌 О нас</div>
                    <p class="text-muted">${aboutText}</p>
                    <div class="section-title">🇧🇾 Наша миссия</div>
                    <p class="text-muted">${missionText}</p>
                    <hr>
                    <div class="section-title">🏆 Что мы предлагаем</div>
                    <ul class="landmark-list" style="margin-bottom:0;">
                        ${offersHTML}
                    </ul>
                    <div style="margin-top: 25px; background: #f0f4fc; padding: 12px 18px; border-radius: 12px; font-size: 14px; color: #2c3e5c;">
                        📞 Контакты: ${phone} | ${email} | ${address}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Генерирует HTML для страницы контактов из XML
 * @param {Document} xmlDoc - XML документ
 * @returns {string} - HTML строка
 */
function generateContactsHTML(xmlDoc) {
    const pageTitle = xmlDoc.querySelector("pageTitle")?.textContent || "";
    const subtitle = xmlDoc.querySelector("subtitle")?.textContent || "";
    
    // Контактная информация
    const officeAddress = xmlDoc.querySelector("contactInfo office address")?.textContent || "";
    const officePostal = xmlDoc.querySelector("contactInfo office postal")?.textContent || "";
    const phones = xmlDoc.querySelectorAll("contactInfo phones phone");
    const emails = xmlDoc.querySelectorAll("contactInfo emails email");
    const workingHours = xmlDoc.querySelectorAll("contactInfo workingHours hours");
    
    let phonesHTML = '';
    phones.forEach(phone => {
        const note = phone.getAttribute("note");
        phonesHTML += `${phone.textContent} ${note ? `(${note})` : ''}<br>`;
    });
    
    let emailsHTML = '';
    emails.forEach(email => {
        emailsHTML += `<a href="mailto:${email.textContent}">${email.textContent}</a><br>`;
    });
    
    let hoursHTML = '';
    workingHours.forEach(hours => {
        const day = hours.getAttribute("day");
        hoursHTML += `${day}: ${hours.textContent}<br>`;
    });
    
    // Поля формы
    const fields = xmlDoc.querySelectorAll("contactForm fields field");
    let formFieldsHTML = '';
    
    fields.forEach(field => {
        const id = field.getAttribute("id");
        const type = field.getAttribute("type");
        const label = field.getAttribute("label");
        const placeholder = field.getAttribute("placeholder") || "";
        const required = field.getAttribute("required") === "true";
        
        if (type === "text" || type === "email" || type === "tel") {
            formFieldsHTML += `
                <div class="form-group">
                    <label for="${id}">${label}</label>
                    <input type="${type}" id="${id}" placeholder="${placeholder}">
                    <span class="error-message" id="error${id.charAt(0).toUpperCase() + id.slice(1)}"></span>
                </div>
            `;
        } else if (type === "select") {
            const options = field.querySelectorAll("option");
            let optionsHTML = '';
            options.forEach(option => {
                const value = option.getAttribute("value") || option.textContent;
                optionsHTML += `<option value="${value}">${option.textContent}</option>`;
            });
            formFieldsHTML += `
                <div class="form-group">
                    <label for="${id}">${label}</label>
                    <select id="${id}">
                        ${optionsHTML}
                    </select>
                    <span class="error-message" id="error${id.charAt(0).toUpperCase() + id.slice(1)}"></span>
                </div>
            `;
        } else if (type === "textarea") {
            const rows = field.getAttribute("rows") || "5";
            formFieldsHTML += `
                <div class="form-group">
                    <label for="${id}">${label}</label>
                    <textarea rows="${rows}" id="${id}" placeholder="${placeholder}"></textarea>
                    <span class="error-message" id="error${id.charAt(0).toUpperCase() + id.slice(1)}"></span>
                </div>
            `;
        } else if (type === "checkbox") {
            formFieldsHTML += `
                <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="${id}">
                        <span>${label}</span>
                    </label>
                    <span class="error-message" id="error${id.charAt(0).toUpperCase() + id.slice(1)}"></span>
                </div>
            `;
        }
    });
    
    const submitText = xmlDoc.querySelector("contactForm submitButton")?.textContent || "Отправить сообщение";
    
    return `
        <div class="title">
            <h1 class="page-title">${pageTitle}</h1>
            <p class="subtitle">${subtitle}</p>
        </div>
        <div class="contacts-container">
            <div class="contact-info-card">
                <h2>Наши контакты</h2>
                <div class="info-item">
                    <div>
                        <strong>Центральный офис</strong><br>
                        ${officeAddress}<br>
                        ${officePostal}
                    </div>
                </div>
                <div class="info-item">
                    <div>
                        <strong>Телефоны</strong><br>
                        ${phonesHTML}
                    </div>
                </div>
                <div class="info-item">
                    <div>
                        <strong>Электронная почта</strong><br>
                        ${emailsHTML}
                    </div>
                </div>
                <div class="info-item">
                    <div>
                        <strong>Режим работы</strong><br>
                        ${hoursHTML}
                    </div>
                </div>
            </div>
            <div class="contact-form-card">
                <h2>Напишите нам</h2>
                <p>Заполните форму, и наш специалист свяжется с вами в ближайшее время.</p>
                <form id="contactForm" novalidate>
                    <div class="form-row">
                        ${formFieldsHTML}
                    </div>
                    <button type="submit" class="submit-btn">${submitText}</button>
                    <div class="form-status" id="formStatus"></div>
                </form>
            </div>
        </div>
    `;
}

// Определяем, какая страница загружена, и загружаем соответствующий XML
document.addEventListener("DOMContentLoaded", async () => {
    // Получаем имя текущего HTML файла
    const currentPage = window.location.pathname.split("/").pop();
    let xmlFile = "";
    let generateFunction = null;
    
    // Определяем, какой XML загружать и какую функцию использовать
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
        default:
            console.log("No XML mapping for:", currentPage);
            return;
    }
    
    // Загружаем XML и генерируем контент
    const xmlDoc = await loadXML(xmlFile);
    if (xmlDoc && generateFunction) {
        const mainElement = document.querySelector("main");
        if (mainElement) {
            // Сохраняем ссылку на returnToMain если он есть
            const returnToMain = mainElement.querySelector(".returnToMain");
            const generatedHTML = generateFunction(xmlDoc);
            
            if (currentPage.includes("Brest") || currentPage.includes("Gomel") || 
                currentPage.includes("Grodno") || currentPage.includes("Minsk") || 
                currentPage.includes("Mogilev") || currentPage.includes("Vitebsk")) {
                // Для страниц с достопримечательностями добавляем returnToMain
                mainElement.innerHTML = generatedHTML + `<div class="returnToMain"><p>Вернуться на главную</p></div>`;
            } else {
                mainElement.innerHTML = generatedHTML;
            }
            
            // Восстанавливаем функциональность returnToMain
            const returnBtn = document.querySelector(".returnToMain");
            if (returnBtn) {
                returnBtn.addEventListener("click", () => {
                    window.location.href = "MAIN.html";
                });
            }
        }
    }
});