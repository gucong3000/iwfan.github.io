$(function(){
    var sub = $('.subMenuContainer')

    $('.mainMenu')
        .mouseenter(function(e) {
            sub.removeClass('none')
        })
        .mouseleave(function(e) {
            sub.addClass('none')
        })
        


})