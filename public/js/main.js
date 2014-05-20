$(document).ready(function() {
    memofields();
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
