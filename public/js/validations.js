function validateURL() {
    var options = {
        protocols: ['http','https','ftp'],
        require_tld: true,
        require_protocol: true,
        allow_underscores: false
    };
    if (!validator.isURL(document.getElementById('url').value, options)) {
        document.getElementById('submitbtn').classList.add('disabled');
        document.getElementById('urlgroup').classList.add('has-error');
    } else {
        document.getElementById('submitbtn').classList.remove("disabled");
        document.getElementById('urlgroup').classList.remove('has-error');
        document.getElementById('urlgroup').classList.add('has-success');
    }
}

function validateEmail() {
    if (!validator.isEmail(document.getElementById('email').value)) {
        document.getElementById('submitbtn').classList.add('disabled');
        document.getElementById('emailgroup').classList.add('has-error');
    } else {
        document.getElementById('submitbtn').classList.remove("disabled");
        document.getElementById('emailgroup').classList.remove('has-error');
        document.getElementById('emailgroup').classList.add('has-success');
    }
}
