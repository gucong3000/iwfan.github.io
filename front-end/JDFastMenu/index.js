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
    mouseInSubMenu = false,
    // 存储鼠标在文档中的位置
    mouseTrack = [],
    // 记录鼠标点的位置
    moveHandler = function(e) {
        mouseTrack.push({
            x: e.pageX,
            y: e.pageY
        })
        // 只保存最新的三个点
        if (mouseTrack.length > 3) {
            mouseTrack.shift()
        }
    };

    sub.on('mouseenter', function(){
        mouseInSubMenu = true
    }).on('mouseleave', function() {
        mouseInSubMenu = false
    })


    $('.wrapper')
        .mouseenter(function(e) {
            sub.removeClass('none')
            $(document).bind('mousemove', moveHandler)
        })
        .mouseleave(function(e) {
            sub.addClass('none')
            $(document).unbind('mousemove', moveHandler)
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

            var currMousePos = mouseTrack[mouseTrack.length - 1]
            var prevMousePos = mouseTrack[mouseTrack.length - 2]
            // 基于用户行为预测的切换
            if (needDelay(sub, currMousePos, prevMousePos)) {
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
                    timer = null
                }, 300)
            } else {
                if (mouseInSubMenu) {
                    return 
                }
                activeRow.removeClass('active')
                activeMenu.addClass('none')
                activeRow = $(e.target).addClass('active')
                activeMenu = $('.subMenuContainer [data-id='+activeRow.data('id')+']').removeClass('none') 
            }
        })
})

//  基于用户行为预测的切换技术
//  1. 需要跟踪鼠标的移动
//  2. 需要判断鼠标当前的坐标点， 是否在上一次鼠标点与子菜单构成的三角形中

// 如何判断点在三角形中
// 1. 向量 Vab = Pb - Pa
// 2. 二维向量的叉乘公式 
//      a(x1, y1) * b(x2, y2) = x1*y2 - x2*y1


//  表示向量的函数， 向量就是终点的坐标 - 起点的坐标
function vector(a, b) {
    // b 点的坐标 减去 a点的坐标 就是向量
    return {
        x: b.x - a.x,
        y: b.y - a.y,
    }
}

// 向量的叉乘公式
function vectorProduct(a, b) {
    //   a(x1, y1) * b(x2, y2) = x1*y2 - x2*y1
    return a.x * b.y - b.x * a.y
}

// 判断点在三角形中
//       A
//      / \
//     / p \
//    /_____\
//   B       C

// 若 PA向量 * PB 向量
//    PB * PC 、 PC * PA   
// 若他们三个运算结果的符号相同  说明 P 在这个三角形中， 否则不在 
function isPointInTrangle(p, a, b, c) {
    var pa = vector(p, a)
    var pb = vector(p, b)
    var pc = vector(p, c)

    var t1 = vectorProduct(pa, pb)
    var t2 = vectorProduct(pb, pc)
    var t3 = vectorProduct(pc, pa)

    // t1 与 t3 的比较可以省略
    return isSameSign(t1, t2) && isSameSign(t2, t3)
}


// 利用 异或 位运算符 判断数字符号是否相同
function isSameSign(t1, t2) {
    return (t1 ^ t2) >= 0
}


// 判断是否需要延时
function needDelay(subMenu, currMousePos, prevMousePos) {
    var offset = subMenu.offset()

    var top = {
        x: offset.left,
        y: offset.top
    }

    var bottom = {
        x: offset.left,
        y: offset.top + subMenu.height()
    }

    return isPointInTrangle(currMousePos, prevMousePos, top, bottom)
}



