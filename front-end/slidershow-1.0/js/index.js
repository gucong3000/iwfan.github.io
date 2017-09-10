window.onload = function() {

    var container = document.querySelector('.silder')               // 外层容器
    var silderStep = container.clientWidth;                         // 步增量
    var silderIndex = 1;                                            // 图片索引

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
    function moveSilderShow(index, callback, speed = 8) {
        console.log(silderIndex)
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
                if (callback) {callback()}
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

    left.addEventListener('click', moveSliderToLeft)
    function moveSliderToLeft() {
        silderIndex === -1 ? silderIndex = 6 : silderIndex--
        if (silderIndex === 0) {
            left.removeEventListener('click', moveSliderToLeft)
        }
        moveSilderShow(silderIndex,() => {
            if (silderIndex === 0) {
                silderIndex = 5
                silder.style.left = -(silderIndex * silderStep) + "px"
                left.addEventListener('click', moveSliderToLeft)
            }
        })
        pagerItemIndex = pagerItemIndex === 0 ? 4 : pagerItemIndex - 1
        addPageIndexItemStyle(pagerItemIndex)
    }

    right.addEventListener('click', moveSliderToRight)
    function moveSliderToRight() {
        silderIndex === 7 ? silderIndex = 1 : silderIndex++
        if (silderIndex === 6) {
            right.removeEventListener('click', moveSliderToRight)
        }
        moveSilderShow(silderIndex,() => {
            if (silderIndex === 6) {
                silderIndex = 1
                silder.style.left = -(silderIndex * silderStep) + "px"
                right.addEventListener('click', moveSliderToRight)
            }
        })
        pagerItemIndex = pagerItemIndex === 4 ? 0 : pagerItemIndex + 1
        addPageIndexItemStyle(pagerItemIndex)
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
        }, 1e3)
    }

    var wrapper = document.querySelector('.wrapper')
    wrapper.onmouseenter = (e) => {
        // clearInterval(globalAnimateTimer)
    }

    // wrapper.onmouseleave = initGlobalTimer
}