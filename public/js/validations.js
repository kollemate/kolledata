function validateURL() {
    var options = {
        protocols: ['http','https','ftp'],
        require_tld: true,
        require_protocol: true,
        allow_underscores: false
    };
    if (!validator.isURL(document.getElementById('url').value, options)) {
        document.getElementById('submitbtn').classList.add('disabled');
        alert('Please enter a valid URL including http://.');
    } else {
        document.getElementById('submitbtn').classList.remove("disabled");
    }
}

function validateEmail() {
    if (!validator.isEmail(document.getElementById('email').value)) {
        document.getElementById('submitbtn').classList.add('disabled');
        alert('Please enter a valid e-mail address.');
    } else {
        document.getElementById('submitbtn').classList.remove("disabled");
    }
}
