$(document).ready(function() {

    // hide all memo tablerows right from the start
    // this is definitely *not* a good way of doing this, but the only way that seems to be working for now...
    $('.memo').hide();

    // toggle display of memo rows onClick of inforows
    $('.showmemo').click(function(){
        $(this).closest('tr').next('tr').slideToggle();
    });

});
