window.onload = function () {
    var btn = document.getElementById("btn");
    //获取页面可视区域高度
    var clientHeight = document.documentElement.clientHeight;
    var timer = null ;
    var isTop = true ;
    window.onscroll = function () {
        var osTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (osTop >= clientHeight) {
            btn.style.display = "block" ;
        }else{
            btn.style.display = "none" ;
        }
        if (!isTop) {
            clearInterval(timer);
        }
        isTop = false;
    };
    btn.onclick = function () {
      timer = setInterval(function () {
          //获取滚动条距离顶部的高度
          var osTop = document.documentElement.scrollTop || document.body.scrollTop;
          var ispeed = Math.floor(-osTop / 5);
          document.documentElement.scrollTop = document.body.scrollTop -= (osTop + ispeed);
          isTop = true;
          if (osTop == 0 ) {
              clearInterval(timer);
          }
      },50);
    }
};
