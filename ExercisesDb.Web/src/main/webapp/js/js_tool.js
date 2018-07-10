/**
 * 遮罩层封装类
 * @return
 */
function JSLayer() {
    var newMaskId = "JSLayer_ID";
    var newSubMaskId = "JSLayer_SUBID";
    var newMask = document.createElement("div");
    //var newSubMask = document.createElement("div");//发现和以下代码重复 所以注释  汤立德20150510
    newMask.id = newMaskId;
    newMask.style.position = "absolute";
    newMask.style.zIndex = "1000";
    _scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    _scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    newMask.style.width = _scrollWidth + "px";
    newMask.style.height = _scrollHeight + "px";
    newMask.style.top = "0px";
    newMask.style.left = "0px";
    newMask.style.background = "#33393C";
    newMask.style.filter = "alpha(opacity=12)";
    newMask.style.opacity = "0.12";

    var newSubMask = document.createElement("div");
    newSubMask.id = newSubMaskId;
    newSubMask.style.position = "fixed";
    newSubMask.style.zIndex = "1001";
    newSubMask.style.margin = "0 auto";
    newSubMask.style.border = "0px solid gray";
    //newSubMask.style.width = "200px";
    //newSubMask.style.height = "40px";
    newSubMask.style.background = "#7ACEFC";
    newSubMask.innerHTML = "数据加载中…";
    newSubMask.style.top = "30px";
    newSubMask.style.left = "100px";
    newSubMask.className = "cla_box_shadow";
    newSubMask.style.overflow = "auto";
    newSubMask.style.fontFamily = "Microsoft YaHei";
    newSubMask.style.fontSize = "16px";
    newSubMask.style.color = "#ffffff";
    newSubMask.style.lineHeight = "16px";
    newSubMask.style.padding = "5px";
    newSubMask.style.letterSpacing = "1px";
    newSubMask.style.borderRadius = "5px";
    //newSubMask.style.minHeight = "100px";
    //newSubMask.style.minWidth = "100px";

    //newSubMask.style.-webkit-box-shadow="#666 0px 0px 10px";
    //newSubMask.style.-moz-box-shadow="#666 0px 0px 10px";
    //ewSubMask.style.box-shadow = "#666 0px 0px 10px;background: #EEFF99;behavior: url(/PIE.htc)";
    //alert(newSubMask.offsetWidth);
    //newSubMask.style.filter = "alpha(opoffseacity=90)";
    //newSubMask.style.opacity = "0.9";
    //newSubMask.style.top = (document.body.clientHeight - newSubMask.style.height)/2;
    //newMask.style.left = "0px";

    //显示底部的灰色遮罩层
    this.showBottomLayer = function () {
        if (document.getElementById(newMaskId) != null)
            return;
        _scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
        _scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        newMask.style.width = _scrollWidth + "px";
        newMask.style.height = _scrollHeight + "px";
        newMask.style.zIndex = "1000";
        document.body.appendChild(newMask);
    }
    //清除底部灰色遮罩层
    this.dropBottomLayer = function () {
        if (document.getElementById(newMaskId) != null)
            document.body.removeChild(newMask);
    }
    //短时间提示
    this.tipForTime = function (v_innerHTML, v_miniSec) {
        this.showJSLayer(v_innerHTML);
        if (v_miniSec > 0) {
            setTimeout(this.dropJSLayer, v_miniSec);
        }
    }
    this.showJSLayer = function (v_innerHTML) {
        this.dropJSLayer();
        if (v_innerHTML == null || v_innerHTML == "") {
            v_innerHTML = "数据加载中…";
        }
        if (document.getElementById(newMaskId) != null) {
            newMask.style.zIndex = "1010";
            newSubMask.innerHTML = "<table border=0 style=\"min-width:100px;min-height:30px;color:white;\"><tr><td align=\"center\" valin=\"middle\">" + v_innerHTML + "</td></tr></table>";
            return;
        }
        _scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
        _scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        newMask.style.width = _scrollWidth + "px";
        newMask.style.height = _scrollHeight + "px";
        //newMask.style.zIndex = "1010";
        document.body.appendChild(newMask);

        document.body.appendChild(newSubMask);
        if (v_innerHTML != null)
            newSubMask.innerHTML = "<table border=0 style=\"min-width:100px;min-height:30px;color:white;\"><tr><td align=\"center\" valin=\"middle\">" + v_innerHTML + "</td></tr></table>";
        //newMask.style.zIndex = "1011";
        newSubMask.focus();
        //屏幕剧中
        //newSubMask.style.maxHeight = (document.body.clientHeight - 100) + "px";
        //newSubMask.style.top = (document.body.clientHeight - newSubMask.clientHeight)/2 + "px";
        //newSubMask.style.left = (document.body.clientWidth - newSubMask.clientWidth)/2 + "px";
        newSubMask.style.maxHeight = (document.documentElement.clientHeight - 30) + "px";
        newSubMask.style.top = (document.documentElement.clientHeight - newSubMask.clientHeight) / 2 + "px";
        newSubMask.style.left = (document.documentElement.clientWidth - newSubMask.clientWidth) / 2 + "px";

        //alert("showJSLayer");
        //newMask.onclick = function(){
        //document.body.removeChild(document.getElementById(newMaskId));
        //document.body.removeChild(document.getElementById(newSubMaskId));
        //};
    }
    this.dropJSLayer = function () {
        //alert("关闭" + " | " + newMaskId + " | " + newSubMaskId);
        if (document.getElementById(newMaskId) != null) {
            //alert('newMaskId');
            document.body.removeChild(newMask);
        }
        if (document.getElementById(newSubMaskId) != null) {
            //alert("newSubMaskId");
            document.body.removeChild(newSubMask);
        }
    }
    this.reLayout = function () {//此方法有BUG 汤立德20150510 ；当页面初始状态 弹出层后  在层消失前  点击全屏时 此功能正常；但是 当全屏状态 层消失前 点击缩小时  右和底会出现滚动条。
        if (document.getElementById(newMaskId) != null) {
            _scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
            _scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            newMask.style.width = _scrollWidth + "px";
            newMask.style.height = _scrollHeight + "px";
        }
        if (document.getElementById(newSubMaskId) != null) {
            //屏幕剧中
            newSubMask.style.maxHeight = (document.body.clientHeight - 30) + "px";
            newSubMask.style.top = (document.documentElement.clientHeight - newSubMask.clientHeight) / 2 + "px";
            newSubMask.style.left = (document.documentElement.clientWidth - newSubMask.clientWidth) / 2 + "px";
        }
    }

}

/**
 * Ajax封装类
 * @return
 */
function Ajax(){
	var xmlHttp;
	this.remoatCall = function(url,param,handler){
		if (window.ActiveXObject) {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}else if (window.XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest();   
		}
		var myDate = new Date();
		xmlHttp.open("POST", encodeURI(url + "?myDate=" + myDate.toLocaleDateString() + myDate.getMilliseconds() + "&" + param));
		xmlHttp.send(null);
		xmlHttp.onreadystatechange = function(){
			var responseContext;
			if(xmlHttp.readyState == 4) { //
				if(xmlHttp.status == 200) {//
					//
					responseContext = xmlHttp.responseText;
					handler(responseContext);
				}
			}
		}; 
	}

	this.remoatCallGet = function (url, param, handler) {
	    if (window.ActiveXObject) {
	        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	    } else if (window.XMLHttpRequest) {
	        xmlHttp = new XMLHttpRequest();
	    }
	    var myDate = new Date();
	    xmlHttp.open("GET", encodeURI(url + "?myDate=" + myDate.toLocaleDateString() + myDate.getMilliseconds() + "&" + param));
	    xmlHttp.send(null);
	    xmlHttp.onreadystatechange = function () {
	        var responseContext;
	        if (xmlHttp.readyState == 4) { //
	            if (xmlHttp.status == 200) {//
	                //
	                responseContext = xmlHttp.responseText;
	                handler(responseContext);
	            }
	        }
	    };
	}
}

//HashMap类
function HashMap(){
	var contentArray = new Array();//hash集合的内容数组，数组元素是key-value键值对得json对象
	//var keyValuePair = {"key":"","value":""};
	
	this.set = function(v_key,v_value){//添加元素，重复则覆盖
		var findFlag = false;
		for(var i = 0; i < contentArray.length; i++){
			if(contentArray[i].key+"" == v_key+""){
				var keyValuePair = {"key":"","value":""};
				keyValuePair.key = v_key;
				keyValuePair.value = v_value;
				contentArray[i] = keyValuePair;
				findFlag = true;
				break;
			}
		}
		if(findFlag == false){//没有找到key相同的数据，则新增一个
			var keyValuePair = {"key":"","value":""};
			keyValuePair.key = v_key;
			keyValuePair.value = v_value;
			contentArray[contentArray.length] = keyValuePair;
		}
	}
	this.getByKey = function(v_key){//获取元素
		for(var i = 0; i < contentArray.length; i++){
			if(contentArray[i].key+"" == v_key+""){
				return contentArray[i].value;
			}
		}
	}
	this.getByIndex = function(v_index){//获取元素
		if(v_index < contentArray.length){
			return contentArray[v_index].value;
		}else{
			return null;
		}
	}
	this.remove = function(v_key){//移除元素
		var newContentArray = new Array();
		var indexFlag = 0;
		for(var i = 0; i < contentArray.length; i++){
			if(contentArray[i].key+"" == v_key+""){
				contentArray[i] = null;
				continue;
			}
			newContentArray[indexFlag++] = contentArray[i]
		}
		contentArray = newContentArray;
	}
	this.clear = function(){//清除所有
		contentArray = new Array();
	}
	this.size = function(){
		return contentArray.length;
	}
}

//DateTime封装类
function DateTime(){
	
}