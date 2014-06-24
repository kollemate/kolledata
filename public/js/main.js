$(document).ready(function() {
    memofields();
});

// resize big memo fields on info pages
$(function(){
    $('.memotextdiv').css({ height: $(window).innerHeight() - 100 });
    $('.memotextarea').css({ height: $(window).innerHeight() - 185 });
});

function memofields() {
    // hide all memo tablerows right from the start
    // this is definitely *not* a good way of doing this, but the only way that seems to be working for now...
    $('.memo').hide();

    // toggle display of memo rows onClick of inforows
    $('.showmemo').click(function(){
        if($(this).html() == "▼") {
            $(this).html("▲");
        }else{
            $(this).html("▼");
        }
        $(this).closest('tr').next('tr').slideToggle(0);
    });

    editMemofields();
}

function editMemofields() {
    $('.editbutton').click(function(){
        var memo_id = $(this).closest('tr').attr('id');
        editMemo(memo_id);
    });

    $('.cancelbutton').click(function(){
        var memo_id = $(this).closest('tr').attr('id');
        cancelEdit(memo_id);
    });

    $('.submitbutton').click(function(){
        var memo_id = $(this).closest('tr').attr('id');
        submitEdit(memo_id);
    });
}

// ajax stuff for the dynamic search
var http = null;
if (window.XMLHttpRequest) {
    http = new XMLHttpRequest();
}else if (window.ActiveXObject) { // IE problems...
    http = new ActiveXObject("Microsoft.XMLHTTP");
}

// this function has to be called from search-input (onkeyup)
function searchThis() {
    // prepare the POST request
	var url = "/searchPerson";
	var params = "searchInput=" + document.getElementById("searchInput").value;

	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // if the request is ready, call function showRespone (no parentheses is right and needed here - it stores a reference to the method instead of calling it directly)
	http.onreadystatechange = showResponse;
	http.send(params);
}

function showResponse() {
    // state 4 = the request is complete
    if (http.readyState === 4) {
        // parse the response to find the table
        var response = http.responseText;
        var start = response.indexOf("<table id=\"datatable\"");
        response = response.substr(start, response.length);
        start = response.indexOf("\">");
        var end = response.indexOf("</table>");
        response = response.substring(start+2, end);

        // switch the whole table in the DOM
        $("#datatable").html(response);

        // hide the memo-TRs and make them showable again
        memofields();
    }
}

function editMemo(memo_id) {
    var id = '#'+memo_id;
    $(id).find('.editbutton').toggleClass('hidden');
    $(id).find('.confirmbuttons').toggleClass('hidden');
    $(id).find('.input').replaceWith($('<textarea name="textarea_'+memo_id+'" id="textarea_'+memo_id+'" class="input col-lg-11">' + $(id).find('.input').html() + '</textarea>'));
    $('textarea.input').elasticArea();

    // hack to set the focus at the end of the textarea
    var temp;
    temp=$(id).find('.input').val();
    $(id).find('.input').val('');
    $(id).find('.input').focus();
    $(id).find('.input').val(temp);

}

function cancelEdit(memo_id) {
    var id = '#'+memo_id;
    $(id).find('.editbutton').toggleClass('hidden');
    $(id).find('.confirmbuttons').toggleClass('hidden');
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

jQuery.fn.elasticArea = function() {
  return this.each(function(){
    function resizeTextarea() {
      this.style.height = this.scrollHeight/2 + 'px';
      this.style.height = this.scrollHeight + 'px';
    }
    $(this).keypress(resizeTextarea)
    .keydown(resizeTextarea)
    .keyup(resizeTextarea)
    .css('overflow','hidden');
    resizeTextarea.call(this);
  });
};
