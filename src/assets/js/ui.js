
$(document).ready(function(){

    // cambia el layout de HTMLFormElement.html | mosaico o listado
    $(".type-view").on("click", function(){
        if($(this).hasClass('selected') == true){

        }
        else {
            if($(this).attr('id') == 'Mozaicos'){
                $('#Listado').removeClass('selected');
                $(".home__layout").removeClass('col-md-12');
                $(".home__layout").removeClass('home__layout__list');

                $(".home__layout").addClass('col-md-6');
                $(".home__layout").addClass('home__layout__mosaic');

                $(".home__table-title").css('display', 'none');

            } else {
                $('#Mozaicos').removeClass('selected');

                $(".home__layout").removeClass('col-md-6');
                $(".home__layout").removeClass('home__layout__mosaic');

                $(".home__layout").addClass('col-md-12');
                $(".home__layout").addClass('home__layout__list');

                $(".home__table-title").css('display', 'flex');
            }
            $(this).addClass("selected");
        }
    });

    // cambia el estado del boton menu hamburguesa
    $('.header__hamburguer').on('click', function(){
        $(this).toggleClass('header__hamburguer__open ');
        $('.header__secondary-bar').toggleClass('header__secondary-bar__open')
    })
});



