document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    validateAndSubmit();
});

function clearErrors() {
    var ids = ['errorName', 'errorEmail', 'errorPhone', 'errorTopic', 'errorMessage', 'errorConsent'];
    ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.textContent = '';
    });
    var fields = ['fieldName', 'fieldEmail', 'fieldPhone', 'fieldTopic', 'fieldMessage'];
    fields.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.style.borderColor = '';
    });
}

function showError(fieldId, errorId, message) {
    var field = document.getElementById(fieldId);
    var error = document.getElementById(errorId);
    if (field) field.style.borderColor = '#d32f2f';
    if (error) error.textContent = message;
}

function validateAndSubmit() {
    clearErrors();

    var name    = document.getElementById('fieldName').value.trim();
    var email   = document.getElementById('fieldEmail').value.trim();
    var phone   = document.getElementById('fieldPhone').value.trim();
    var topic   = document.getElementById('fieldTopic').value;
    var message = document.getElementById('fieldMessage').value.trim();
    var consent = document.getElementById('fieldConsent').checked;

    var valid = true;

    if (!name) {
        showError('fieldName', 'errorName', 'Пожалуйста, введите ваше имя');
        valid = false;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('fieldEmail', 'errorEmail', 'Пожалуйста, введите e-mail');
        valid = false;
    } else if (!emailPattern.test(email)) {
        showError('fieldEmail', 'errorEmail', 'Введите корректный e-mail адрес');
        valid = false;
    }

    if (!phone) {
        showError('fieldPhone', 'errorPhone', 'Пожалуйста, введите номер телефона');
        valid = false;
    }

    if (!topic) {
        showError('fieldTopic', 'errorTopic', 'Пожалуйста, выберите тему сообщения');
        valid = false;
    }

    if (!message) {
        showError('fieldMessage', 'errorMessage', 'Пожалуйста, введите текст сообщения');
        valid = false;
    }

    if (!consent) {
        var consentError = document.getElementById('errorConsent');
        if (consentError) consentError.textContent = 'Необходимо дать согласие на обработку данных';
        valid = false;
    }

    var status = document.getElementById('formStatus');

    if (!valid) {
        status.className = 'form-status error';
        status.textContent = 'Пожалуйста, исправьте ошибки в форме';
        return;
    }

    var btn = document.querySelector('.submit-btn');
    btn.disabled = true;
    btn.textContent = 'Отправка...';

    setTimeout(function () {
        status.className = 'form-status success';
        status.textContent = 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.';
        document.getElementById('contactForm').reset();
        clearErrors();
        btn.disabled = false;
        btn.textContent = 'Отправить сообщение';
    }, 800);
}
