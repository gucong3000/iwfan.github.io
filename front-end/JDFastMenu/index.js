$(function(){
    var sub = $('.subMenuContainer')

    var activeRow, activeMenu
    $('.wrapper')
        .mouseenter(function(e) {
            sub.removeClass('none')
        })
        .mouseleave(function(e) {
            sub.addClass('none')
            if (activeRow) {
                activeRow.removeClass('active')
                activeRow = null
            }

            if (activeMenu) {
                activeMenu.addClass('none')
                activeMenu = null
            }

        })
        .on('mouseenter', '.mMenu-item' , function(e) {
            if (activeRow === $(e.target)) return

            if (activeRow) {
                activeRow.removeClass('active')
                activeMenu.addClass('none')
            }

            activeRow = $(e.target).addClass('active')
            activeMenu = $('.subMenuContainer [data-id='+activeRow.data('id')+']')
            activeMenu.removeClass('none') 
        })
        


})