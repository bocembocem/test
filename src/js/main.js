$(function() { 
    let firstWidth = $(window).outerWidth();
    let lastCoefficient = 1.6;
    let firstLoad = true;
    let menuDown = false;


    /* Тут эксперементировал с адаптивностью шрифта в зависимости от ширины экрана 
       При множественном ресайзе изначалный размер шрифта теряется, +-2 пикселя
       Но при первой загрузке на размерах экрана соответсвующим макету остаются дефолтные размеры
       При загрузке на малых экранах шрифт подстраивается    
    */

    function checkSize(windowWidth) {
        let nowCoefficient;
        if(windowWidth < 576) {
            nowCoefficient = 1.2;        
            resizeFont(lastCoefficient, nowCoefficient);
        } else if (windowWidth < 768) {
            nowCoefficient = 1.4;
            resizeFont(lastCoefficient, nowCoefficient);
        } else if (windowWidth < 992) {
            nowCoefficient = 1.5;
            resizeFont(lastCoefficient, nowCoefficient);
        } else {
            nowCoefficient = 1.6;
            if(!firstLoad) {
                resizeFont(lastCoefficient, nowCoefficient);
            }
        }     
        lastCoefficient = nowCoefficient;
        firstLoad = false;
    }

    function resizeFont(lastCoefficient, nowCoefficient) {   
        $('.check-font').each(function() {
            let size = parseInt($(this).css('font-size'));
            size = Math.ceil(size / lastCoefficient);
            size = size * nowCoefficient;
            $(this).css({
                fontSize: size
            });
        });
    }

    $(window).on('resize', function() {
        //checkSize($(this).outerWidth());
        $('.one-menu').next().addClass('d-none');
        menuDown = false;
    });

    //checkSize(firstWidth);

    /* Переключатель для "Важной информации", костыль конечно, но когда верстал не подумал) */

    $('.five-product-item-buttons-information').on('click', function() {
        $(this).parent().parent().next().slideToggle();
    });

    $('.five-product-item-toggle-close-img').on('click', function() {
        $(this).parent().parent().slideToggle();
    });

    /* Переключатель меню на маленьких размерах экрана */

    $('.one-menu').on('click', function() {
        if(!menuDown) {
            $(this).next().removeClass('d-none');
        } else {
            $(this).next().addClass('d-none');
        }
        menuDown = !menuDown;
    });
});