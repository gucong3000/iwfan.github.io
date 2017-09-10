(function(){
    
    var container = null            // 外层容器
    var globalData = null           // 全局数据
    var globalSlider = null
    var globalSliderShow = null
    var pagerPrev = null
    var pagerNext = null
    var pagerItem = null
    var sliderIndex = 1
    var sliderMoveStep = 0
    var slowAnimateFlag = true
    var autoPlayTimer = null

    function init(c, d) {
        container = document.querySelector(c)
        globalData = d
        globalSlider = renderHtml()
        renderPagerControl()
        setListener()
    }

    function renderHtml() {
        if (!container || !globalData) return
        var mySlider = document.createElement('div')
        mySlider.setAttribute('class', 'mySlider')
        var size = getElementPureSize(container)
        sliderMoveStep = size.width
        mySlider.style.width = size.width + "px"
        mySlider.style.height = size.height + "px"
        mySlider.appendChild(renderSlider(size))
        container.appendChild(mySlider)
        return mySlider
    }

    function renderSlider(size) {
        var sliderShow = document.createElement('ul')
        sliderShow.setAttribute('class', 'mySlider-sliderShow')
        sliderShow.style.left = -size.width + "px"
        var count = getSliderCount()
        sliderShow.style.width = (count + 2) * size.width + "px"
        sliderShow.style.height = size.height + "px"
        for (var i = 0; i < count+2; i++) {
            var sliderShowItem = document.createElement('li')
            sliderShowItem.setAttribute('class', 'mySlider-sliderShow-item')
            sliderShowItem.style.width = size.width + "px"
            sliderShowItem.style.height = size.height + "px"
            var archo = document.createElement('a')
            var img = document.createElement('img')
            if (i === 0) {
                archo.setAttribute('href', globalData[count-1]['href'])
                img.setAttribute('src', globalData[count-1]['image'])
            } else if (i === count + 2 - 1) {
                archo.setAttribute('href', globalData[0]['href'])
                img.setAttribute('src', globalData[0]['image'])
            } else {
                archo.setAttribute('href', globalData[i-1]['href'])
                img.setAttribute('src', globalData[i-1]['image'])
            }
            archo.appendChild(img)
            sliderShowItem.appendChild(archo)
            sliderShow.appendChild(sliderShowItem)
        }
        globalSliderShow = sliderShow
        return sliderShow
    }

    function renderPagerControl() {
        if (!globalSlider || !globalData) return
        var leftControl = document.createElement('div')
        leftControl.setAttribute('class', "mySlider-control-prev")
        globalSlider.appendChild(leftControl)
        pagerPrev = leftControl
        var rightControl = document.createElement('div')
        rightControl.setAttribute('class', "mySlider-control-next")
        globalSlider.appendChild(rightControl)
        pagerNext = rightControl
        renderPagerItem()
    }

    function renderPagerItem() {
        if (!globalSlider || !globalData) return
        var pager = document.createElement('ul')
        pager.setAttribute('class', 'mySlider-pager')
        var count = getSliderCount()
        for (var i = 0; i < count; i++) {
            var pagerItems = document.createElement('li')
            pagerItems.setAttribute('class', (i === 0) ? 'mySlider-pager-item active' : 'mySlider-pager-item')
            pagerItems.setAttribute('pagerIndex', i+1)
            pager.appendChild(pagerItems)
        }
        globalSlider.appendChild(pager)
        pagerItem = pager
    }

    function setPagerItemStyle(index) {
        var pagerItems = pagerItem.childNodes
        var active = pagerItem.querySelector('.active')
        active.setAttribute('class', 'mySlider-pager-item')
        var now = pagerItem.querySelector('li:nth-of-type('+index+')')
        now.setAttribute('class', 'mySlider-pager-item active')
    }

    /**
     * 获取元素的实际尺寸，不包括padding、border、scroll
     * @param {*} DOM ELement
     */
    function getElementPureSize(ele) {
        if (!(ele instanceof HTMLElement)) {
            throw new TypeError('arguments type error')
        }
        var result = {}
        try {
            var currentStyle = window.getComputedStyle(ele)
            var paddingTop = parseInt(currentStyle.getPropertyValue("padding-top")) || 0
            var paddingRight = parseInt(currentStyle.getPropertyValue("padding-right")) || 0
            var paddingBottom = parseInt(currentStyle.getPropertyValue("padding-bottom")) || 0
            var paddingLeft = parseInt(currentStyle.getPropertyValue("padding-left")) || 0
            // clientWidth = element.width + element.padding
            // offsetWitth = element.width + element.padding + element.border + element.scrollWidth
            result.width = ele.clientWidth - paddingLeft - paddingRight
            result.height = ele.clientHeight - paddingTop - paddingBottom
        } catch (error) {
            //  supports IE8 -
            result.width = ele.currentStyle.width
            result.height = ele.currentStyle.height
        }
        return result
    }

    function getSliderCount() {
        if (!globalData) { return 0 }
        return Array.isArray(globalData) ? globalData.length : 0
    }

    function setListener() {
        if (!pagerPrev || !pagerNext || !pagerItem) return
        pagerPrev.addEventListener('click', e => {sliderIndex--; moveSlider(sliderMoveStep)})
        pagerNext.addEventListener('click', e => {sliderIndex++; moveSlider(-sliderMoveStep)})
        Array.prototype.forEach.call(pagerItem.querySelectorAll('.mySlider-pager-item'), function(e, i) {
            e.addEventListener('mouseenter', e => {
                var index = e.target.getAttribute('pagerIndex')
                moverTo(index)
            })
       })
       globalSlider.addEventListener('mouseenter', e => {
           stopPlay() 
       })
       globalSlider.addEventListener('mouseleave', e => {
           autoPlay()
       })
       autoPlay()
    }

    function moveSlider(offset) {
        if (!slowAnimateFlag) return
        var totalTime = 500
        var interval = 10
        var speed = offset / (totalTime / interval)
        
        var count = getSliderCount()
        var end = globalSliderShow.offsetLeft + offset
        function animate() {
            slowAnimateFlag = false
            if ((speed > 0 && globalSliderShow.offsetLeft < end)
                || (speed < 0 && globalSliderShow.offsetLeft > end)) {
                globalSliderShow.style.left = globalSliderShow.offsetLeft + speed + "px"
                setTimeout(animate, interval);
            } else {
                slowAnimateFlag = true
                globalSliderShow.style.left = end + "px"
                if (globalSliderShow.offsetLeft > -sliderMoveStep) {
                    globalSliderShow.style.left = -(count * sliderMoveStep) + "px"
                } else if (globalSliderShow.offsetLeft < -(count * sliderMoveStep)) {
                    globalSliderShow.style.left = -(1 * sliderMoveStep) + "px"
                }
                setPagerItemStyle(globalSliderShow.offsetLeft * -1 / sliderMoveStep)
            }
        }
        animate()
    }

    function moverTo(index) {
        var offset = (index - (globalSliderShow.offsetLeft * -1 / sliderMoveStep)) * -sliderMoveStep
        moveSlider(offset)
    }

    function autoPlay() {
        autoPlayTimer = setInterval(() => {
            pagerNext.click()
        }, 2e3)
    }

    function stopPlay() {
        clearInterval(autoPlayTimer)
    }
    window.mySlider = {init:init}
})()