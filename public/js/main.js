$(document).ready(function() {
    memofields();
});

// resize big memo fields on info pages
$(function(){
    $('.memotextdiv').css({ height: $(window).innerHeight() - 150 });
    $('.memotextarea').css({ height: $(window).innerHeight() - 230 });
});

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

function memofields() {
    // hide all memo tablerows right from the start
    // this is definitely *not* a good way of doing this, but the only way that seems to be working for now...
    $('.memo').hide();

    // toggle display of memo rows onClick of inforows
    $('.showmemo').click(function(){
        var next_tr = $(this).closest('tr').next('tr');

        var this_content = $(this).find('i');

        next_tr.slideToggle(0);

        if(this_content.hasClass('fa-caret-down')) {
            this_content.removeClass('fa-caret-down');
            this_content.addClass('fa-caret-up');
        } else if(this_content.hasClass('fa-caret-up')) {
            if (next_tr.find('.input').html() !== '' || next_tr.find('.input').val() !== '') {
                this_content.removeClass('fa-caret-up');
                this_content.addClass('fa-caret-down'); // Text has been added
            } else {
                this_content.removeClass('fa-caret-up');
                this_content.addClass('fa-plus'); // or not.
            }
        } else {
            this_content.removeClass('fa-plus');
            this_content.addClass('fa-caret-up');
            editMemo(next_tr.attr('id')); // empty memo field -> add new
        }
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
	http.onreadystatechange = showSearchResponse;
	http.send(params);
}

function showSearchResponse() {
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

function sortColumns(column, order) {
    // prepare the POST request
    var url = "/sortColumns";
    var params = "sortColumn=" + column + "&sortOrder=" + order;

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // if the request is ready, call function showRespone (no parentheses is right and needed here - it stores a reference to the method instead of calling it directly)
    http.onreadystatechange = showSortResult;
    http.send(params);
}

function showSortResult() {
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
