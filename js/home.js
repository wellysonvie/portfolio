
$('.menu_mobile_icon').on('click', function(){
    $('.menu_mobile_submenu').toggleClass('ds_none');
});

$('.menu_mobile_submenu').on('click', function(){
    $(this).addClass('ds_none');
});

$("body").mouseup(function (e) {
    const $menu_mobile_submenu = $(".menu_mobile_submenu");
    const $menu_mobile_icon = $(".menu_mobile_icon");

    if (!$menu_mobile_submenu.is(e.target) && $menu_mobile_submenu.has(e.target).length === 0
        && !$menu_mobile_icon.is(e.target) && $menu_mobile_icon.has(e.target).length === 0) {
        if ($menu_mobile_submenu.is(':visible'))
            $menu_mobile_submenu.addClass('ds_none');
    }
});