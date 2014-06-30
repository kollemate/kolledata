$(document).ready(function() {
    memofields();
});

// resize big memo fields on info pages
$(function(){
    $('.memotextdiv').css({ height: $(window).innerHeight() - 150 });
    $('.memotextarea').css({ height: $(window).innerHeight() - 230 });
});

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
