function editMemo(memo_id) {
    var id = '#'+memo_id;
    $(id).find('.editbutton').toggleClass('hidden', true);
    $(id).find('.confirmbuttons').toggleClass('hidden', false);

    var temp;
    temp=$(id).find('.input').text();
    // alert(temp);
    $(id).find('.input').replaceWith($('<textarea name="textarea_'+memo_id+'" id="textarea_'+memo_id+'" class="input col-lg-11">' + temp + '</textarea>'));
    $('textarea.input').elasticArea();

    // hack to set the focus at the end of the textarea
    $(id).find('.input').val('');
    $(id).find('.input').focus();
    $(id).find('.input').val(temp);

}

function cancelEdit(memo_id) {
    var id = '#'+memo_id;
    $(id).find('.editbutton').toggleClass('hidden', false);
    $(id).find('.confirmbuttons').toggleClass('hidden', true);
    $(id).find('.input').replaceWith($('<p class="input col-lg-11">' + $(id).find('.input').html() + '</p>'));
}

function submitEdit(memo_id) {
    // prepare the POST request
    var url = "/editMemo";
    var params = "memo=" + document.getElementById("textarea_"+memo_id).value + "&id=" + memo_id.substring(5, memo_id.length);

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = setNewMemo;
    http.send(params);
}

function setNewMemo() {
    // state 4 = the request is complete
    if (http.readyState === 4) {
        var response = http.responseText;
        var obj = jQuery.parseJSON(response);

        var id = '#memo_'+obj.id;
        $(id).find('.editbutton').toggleClass('hidden');
        $(id).find('.confirmbuttons').toggleClass('hidden');
        $(id).find('.input').replaceWith($('<p class="input col-lg-11">' + obj.memo + '</p>'));
    }
}
