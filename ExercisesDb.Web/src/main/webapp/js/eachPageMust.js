
//控制 页面元素不被选中   不被复制  除了INPUT
if (typeof (document.onselectstart) != "undefined") {
    // IE下禁止元素被选取       
    document.onselectstart = function (event) {
        if (event.target.tagName != "INPUT") {
            return false;
        }
    }
} else {
    // firefox下禁止元素被选取的变通办法       
    document.onmousedown = function (event) {
        if (event.target.tagName != "INPUT") {
            return false;
        }
    }
    document.onmouseup = function (event) {
        if (event.target.tagName != "INPUT") {
            return false;
        }
    }
}

//oncontextmenu = "return false;" //禁止鼠标右键
//ondragstart = "return false;" //禁止鼠标拖动
//onselectstart = "return false;"//禁止选中文字
//onselect = "document.selection.empty();"//禁止复制文本
//document.body.oncontextmenu = mylock;
//document.body.ondragstart = mylock;
//document.body.onselectstart = mylock;
//document.body.onselect = mylock;

//function mylock() {
//    event.returnValue = false;
//}

//$(".indexw_top").onDrag(function myfunction() {
$.onDrag(function myfunction() {
    eoWebBrowser.extInvoke("MoveForm");
});


var scrollFunc = function (e) {
    e = e || window.event;
    if (e.wheelDelta && event.ctrlKey) {//IE/Opera/Chrome 
        event.returnValue = false;
    } else if (e.detail) {//Firefox 
        event.returnValue = false;
    }
}  
 /*注册事件*/ 
 if(document.addEventListener){ 
 document.addEventListener('DOMMouseScroll',scrollFunc,false); 
 }//W3C
 window.onmousewheel = document.onmousewheel = scrollFunc; //IE/Opera/Chrome/Safari 



 //屏蔽鼠标右键、Ctrl+N、Shift+F10、F11、F5刷新、退格键 
 function document.oncontextmenu() {
     event.returnValue = false;
 } //屏蔽鼠标右键 
 function window.onhelp() {
     return false
 } //屏蔽F1帮助
 function document.onkeydown() {
     if ((window.event.altKey) && ((window.event.keyCode == 37) || //屏蔽 Alt+ 方向键 ← 
(window.event.keyCode == 39))) //屏蔽 Alt+ 方向键 → 
     {
         alert("不准你使用ALT+方向键前进或后退网页！");
         event.returnValue = false;
     }
     /* 注：这还不是真正地屏蔽 Alt+ 方向键， 
     因为 Alt+ 方向键弹出警告框时，按住 Alt 键不放， 
     用鼠标点掉警告框，这种屏蔽方法就失效了。以后若 
     有哪位高手有真正屏蔽 Alt 键的方法，请告知。*/

     if ((event.keyCode == 8) || //屏蔽退格删除键 
(event.keyCode == 116) || //屏蔽 F5 刷新键 
(event.ctrlKey && event.keyCode == 82)) { //Ctrl + R 
         event.keyCode = 0;
         event.returnValue = false;
     }
     if (event.keyCode == 122) {
         event.keyCode = 0;
         event.returnValue = false;
     }
     //屏蔽F11 
     if (event.ctrlKey && event.keyCode == 78) event.returnValue = false;
     //屏蔽 Ctrl+n 
     if (event.shiftKey && event.keyCode == 121) event.returnValue = false;
     //屏蔽 shift+F10 
     if (window.event.srcElement.tagName == "A" && window.event.shiftKey)
         window.event.returnValue = false; //屏蔽 shift 加鼠标左键新开一网页 
     if ((window.event.altKey) && (window.event.keyCode == 115)) //屏蔽Alt+F4 
     {
         window.showModelessDialog("about:blank", "", "dialogWidth:1px;dialogheight:1px");
         return false;
     } 
 }

