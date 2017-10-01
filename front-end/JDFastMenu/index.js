$(function(){
    // 二级菜单
    var sub = $('.subMenuContainer'),
    // 当前激活的主菜单
    activeRow, 
    // 当前激活的二级菜单
    activeMenu,
    // 延时器
    timer,
    // 鼠标是否在子菜单中
    mouseInSubMenu = false;

    sub.on('mouseenter', function(){
        mouseInSubMenu = true
    }).on('mouseleave', function() {
        mouseInSubMenu = false
    })

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

            if (timer) {
                clearTimeout(timer)
            }

        })
        // 通过事件代理的方式添加监听
        .on('mouseenter', '.mMenu-item' , function(e) {
            if (!activeRow) {
                activeRow = $(e.target).addClass('active')
                activeMenu = $('.subMenuContainer [data-id='+activeRow.data('id')+']').removeClass('none') 
                return
            }

            // 简单 debounce 去抖
            if (timer) {
                clearTimeout(timer)
            }

            timer = setTimeout(function() {
                // 如果鼠标在子菜单中， 则不去切换菜单
                if (mouseInSubMenu) {
                    return 
                }
                // 如果不加此判断，那么在鼠标脱离wrapper后会立即将activeRow置为null
                // 此时若定时器还在运行 就会发生错误
                // 
                // 第二中解决方案就是 在 鼠标离开 wrapper 后，清除定时器
                // if (activeRow) {
                    activeRow.removeClass('active')
                    activeMenu.addClass('none')
                // }
                
                activeRow = $(e.target).addClass('active')
                activeMenu = $('.subMenuContainer [data-id='+activeRow.data('id')+']').removeClass('none') 
            }, 300)
        })
})

