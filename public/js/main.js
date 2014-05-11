$(document).ready(function() {

    $("#newentrybtn").click(function(){
        // TODO: seriously?
        var newRow = '<tr><td><input type="text" class="form-control" id="inputDefault"></td><td></td><td></td><td></td><td></td><td></td></tr>';
        $('#datatable tr:last').after(newRow);
    });

});
