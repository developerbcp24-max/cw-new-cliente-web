function hiddenDate(){
    $(".date-hidden").css("display","none");
    $(".month-hidden").css("display","inline-block");
}

function hiddenMonth(){
    $(".date-hidden").css("display","inline-block");
    $(".month-hidden").css("display","none");
}

var checkFilter=0;

function hiddenFilter(){
    if(checkFilter==0){
        $(".table-filter--hidden").css("display","block");
        checkFilter=1;
    }
    else
    {
        $(".table-filter--hidden").css("display","none");
        checkFilter=0;
    }
}

function obtenerReporte(){

        $(".historical__table--hidden").css("display","block");
}
