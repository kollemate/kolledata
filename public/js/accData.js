function checkFieldEquality(field1, field2) {
    var v1 = document.getElementById(field1).value;
    var v2 = document.getElementById(field2).value;
    if (v1 === v2)
        return true;
    return false;
}

function getPwdHash(password) {
    var shaObj = new jsSHA(password, "TEXT");
    var hash = shaObj.getHash("SHA-256", "HEX");
    return hash;
}

function setPwdHash(field1, field2) {
    var password = document.getElementById(field1).value;
    var pwdHash = getPwdHash(password);
    document.getElementById(field2).value = pwdHash;
}

function sendPost(url, params) {
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //http.onreadystatechange = ???;
    http.send(params);
}

