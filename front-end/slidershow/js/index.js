window.onload = function() {

    var container = document.querySelector('.silder')               // 外层容器
    var silderStep = container.clientWidth;                         // 步增量
    var silderIndex = 0;                                            // 图片索引

    var silder = document.querySelector('.silder-container')        // 轮播
    var left = document.querySelector('.silder-pager-left')         // 上一张
    var right = document.querySelector('.silder-pager-right')       // 下一张

    var pagerIndex = document.querySelector('.silder-index')        // 分页容器
    var pagerItemIndex = silderIndex - 1                            // 分页项索引

    var globalAnimateTimer = null
    var slowAnimateTimer = null
    
    /**
     * 轮播移动每一下的动画效果
     * @param {*} index        移至第几张
     * @param {*} speed         移动动画步增
     */
    function moveSilderShow(index, speed = 8) {
        if (slowAnimateTimer) {
            clearInterval(slowAnimateTimer)
        }
        var end = -(index * silderStep)
        slowAnimateTimer = setInterval(() => {
            var step = (end - silder.offsetLeft) / speed
            step = step > 0 ? Math.ceil(step) : Math.floor(step)
            silder.style.left = (silder.offsetLeft + step) + "px"
            if (silder.offsetLeft === end) {
                clearInterval(slowAnimateTimer)
                slowAnimateTimer = null
            }
        }, 1e3/30)     // 30帧的动画
    }

    /**
     * 分页项的样式
     * @param {*} index    
     */
    function addPageIndexItemStyle(index) {
        var items = document.querySelectorAll('.silder-index-item')
        if (items && items.length) {
            Array.prototype.forEach.call(items, (e, i) => {
                items[i].className = (index === i) ? "silder-index-item active" : "silder-index-item"
            })
        }
    }

    moveSilderShow(silderIndex + 1, 1)

    left.onclick = function(e) {
        silderIndex === 0 ? silderIndex = 4 : silderIndex--
        pagerItemIndex = pagerItemIndex === 0 ? 4 : pagerItemIndex - 1
        moveSilderShow(silderIndex)
        addPageIndexItemStyle(silderIndex)
    }

    right.onclick = function(e) {
        silderIndex === 4 ? silderIndex = 0 : silderIndex++
        pagerItemIndex = pagerItemIndex === 4 ? 0 : pagerItemIndex + 1
        moveSilderShow(silderIndex)
        addPageIndexItemStyle(silderIndex)
        
    }

    pagerIndex.onmouseover = function(e) {
        if (e.target instanceof HTMLLIElement) {
            var i  = Array.from(e.target.parentNode.children).indexOf(e.target)
            silderIndex = i
            moveSilderShow(silderIndex)
            addPageIndexItemStyle(silderIndex)
        }
    }
    var flag = true
    // initGlobalTimer()
    function initGlobalTimer() {
        globalAnimateTimer = setInterval(() => {
            if (silderIndex === 0) {
                flag = true
            }
            if (silderIndex === 4) {
                flag = false
            }
            if (flag) {
                silderIndex++
            } else {
                silderIndex--
            }
            moveSilderShow(silderIndex)
            addPageIndexItemStyle(silderIndex)
        }, 5e3)
    }

    var wrapper = document.querySelector('.wrapper')
    wrapper.onmouseenter = (e) => {
        // clearInterval(globalAnimateTimer)
    }

    // wrapper.onmouseleave = initGlobalTimer
}