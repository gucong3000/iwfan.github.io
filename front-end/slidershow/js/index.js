window.onload = function() {
    
    var currentIndex = 0, step = 960
    var silder = document.querySelector('.silder-container')
    var left = document.querySelector('.silder-pager-left')
    var right = document.querySelector('.silder-pager-right')
 
    left.onclick = function(e) {
        if (currentIndex === 0) return
        currentIndex-- 
        // silder.style.left = (-960 * currentIndex) + "px"
        addPageIndexItemStyle(currentIndex)
    }

    right.onclick = function(e) {
        if (currentIndex === 4) return
        currentIndex++ 
        // silder.style.left = (-960 * currentIndex) + "px"
        addPageIndexItemStyle(currentIndex)
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
        var leader = parseInt(silder.style.left)
        var target = -(step * currentIndex)
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