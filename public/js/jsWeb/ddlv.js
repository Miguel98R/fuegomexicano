

$(async function () {

    $('.move_image').on('mouseenter', function() {
        $(this).css('transform', 'translateY(-10px)');
    });

    $('.move_image').on('mouseleave', function() {
        $(this).css('transform', 'translateY(0)');
    });
})