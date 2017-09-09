window.onload = function() {
    
    var currentIndex = 0, step = 960
    var silder = document.querySelector('.silder-container')
    var left = document.querySelector('.silder-pager-left')
    var right = document.querySelector('.silder-pager-right')
    var pagerIndex = document.querySelector('.silder-index')
    var leader = 0, target = 0
    left.onclick = function(e) {
        if (currentIndex === 0) return
        currentIndex-- 
        leader = parseInt(silder.style.left)
        target = -(step * currentIndex)
        addPageIndexItemStyle(currentIndex)
    }

    right.onclick = function(e) {
        if (currentIndex === 4) return
        currentIndex++ 
        leader = parseInt(silder.style.left)
        target = -(step * currentIndex)
        addPageIndexItemStyle(currentIndex)
    }

    pagerIndex.onclick = function(e) {
        if (e.target instanceof HTMLLIElement) {
            var i  = Array.from(e.target.parentNode.children).indexOf(e.target)
            leader = parseInt(silder.style.left)
            target = -(step * i)
            addPageIndexItemStyle(i)
        }
    }

    addPageIndexItemStyle(currentIndex)
    function addPageIndexItemStyle(index) {
        var items = document.querySelectorAll('.silder-index-item')
        if (items && items.length) {
            Array.prototype.forEach.call(items, (e, i) => {
                items[i].className = (index === i) ? "silder-index-item active" : "silder-index-item"
            })
        }
    }

    var timer = setInterval(() => {
        leader = leader + (target - leader) / 10;
        silder.style.left = leader + "px"
    }, 30)
    


    /**
     * 
     *  function $(id) {
        	 return document.getElementById(id);
        }
        // 找元素
        var timer = null;
        var leader = 0; // 开始的值
        var target = 500; // 最终的值
        $("btn").onclick = function() {
        	 setInterval(function() {
                // leader 以先快后慢变化 
                // leader 0+50
                // leader 50+(500-50)/10 = 50+45 
                // leader 50+45+(500-95) /10 = 50+45+40.5   
                leader = leader + (target - leader) / 10;
                $("box").style.left = leader + "px";

             }, 30);
        }
        // 闪动
        $("btn").onclick = function() {
            $("box").style.left = "500px";
        }
 
     */
}