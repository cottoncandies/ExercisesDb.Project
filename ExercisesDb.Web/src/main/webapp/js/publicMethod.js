//js  获取url参数的值
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return null;
    // if (r != null) return unescape(r[2]); return null;
}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//组卷 数字 转换成 汉字
function NumConvert(number) {
    var numCn = "";
    var array = "一,二,三,四,五,六,七,八,九,十,十一,十二,十三,十四,十五,十六,十七,十八,十九,二十,廿一,廿二,廿三,廿四,廿五,廿六,廿七,廿八,廿九,三十,卅一,卅二,卅三,卅四,卅五,卅六,卅七,卅八,卅九,X".split(",");
    if (number < 1) { number = 1; }
    if (number > 40) { number = 40; }
    return array[number - 1];
}

//计算题型的分数
function setQuestionTypeScore() {
    //alert('进入计算题型');
    var quesTypeList = $(".questypebody");
    //alert(quesTypeList.length);
    for (var i = 0; i < quesTypeList.length; i++) {
        var countQuestionTypeScore = 0;
        var quesTypeIndexId = $(quesTypeList[i]).attr("id");
        //alert($(".quesindex").length);
        var questionList = $(quesTypeList[i]).find(".quesindex");
        //alert(questionList.length);
        for (var j = 0; j < questionList.length; j++) {
            countQuestionTypeScore += parseFloat($(questionList[j]).find("span").text().replace("（", "").replace("分）", ""));
        }
        var quesTypeIndex = quesTypeIndexId.replace("questypebody_", "");
        //alert(quesTypeIndex);
        $("#questypenote2_" + quesTypeIndex).text(countQuestionTypeScore);
    }
    // v_jsLayer.showJSLayer("");
}

//计算试卷的分数
function setQuestionPaperScore() {
    var countPaperScore = 0;
    var quesTypeList = $(".questypebody");
    for (var i = 0; i < quesTypeList.length; i++) {
        var quesTypeIndexId = $(quesTypeList[i]).attr("id");
        var questionList = $(quesTypeList[i]).find(".quesindex");
        for (var j = 0; j < questionList.length; j++) {
            countPaperScore += parseFloat($(questionList[j]).find("span").text().replace("（", "").replace("分）", ""));
        }
    }
    $("#pui_testinfo_score").text(countPaperScore);
    $("#examScore").val(countPaperScore)
}

function checkInputScoreOnkeyup() {
    $('#setQuestionScoreValueTS').hide();
    var value = $("#editorScoreValue").val();
    if (value.toString().indexOf('.') > 0) {
        if (value.substring(value.toString().indexOf('.')).length >= 2) {
            $("#editorScoreValue").val(value.substring(0, value.toString().indexOf('.') + 2));
        }
    }
}

function checkInputScoreOnblur() {
    var value = $("#editorScoreValue").val();
    if (value.toString().indexOf('.') > 0) {
        if (value.substring(value.toString().indexOf('.')).length == 1) {
            $("#editorScoreValue").val(value.substring(0, value.toString().indexOf('.')));
        }
        else if (value.substring(value.toString().indexOf('.')).length >= 2) {
            $("#editorScoreValue").val(value.substring(0, value.toString().indexOf('.') + 2));
        }
    }
}

function Editor_ScoreOnkeyup() {
    var value = $("#Editor_Score").val();
    if (value.toString().indexOf('.') > 0) {
        if (value.substring(value.toString().indexOf('.')).length >= 2) {
            $("#Editor_Score").val(value.substring(0, value.toString().indexOf('.') + 2));
        }
    }
}

function Editor_ScoreOnblur() {
    var value = $("#Editor_Score").val();
    if (value.toString().indexOf('.') > 0) {
        if (value.substring(value.toString().indexOf('.')).length == 1) {
            $("#Editor_Score").val(value.substring(0, value.toString().indexOf('.')));
        }
        else if (value.substring(value.toString().indexOf('.')).length >= 2) {
            $("#Editor_Score").val(value.substring(0, value.toString().indexOf('.') + 2));
        }
    }
}

Date.prototype.formatDateTime = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": showTheHours(this.getHours()), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

function showTheHours(theHour) {
    //alert(theHour);
    if ((theHour > 0 && theHour < 13)) {
        //如果时间在12小时内
        return (theHour);
    }
    if (theHour == 0) {
        //如果时间等于0
        return (12);
    }
    return (theHour - 12);
    //如果时间大于12，需要减去12-针对12小时制
}

Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//////JS操作Cookie大全
////function setCookie(c_name, value, expiredays) {
////    var exdate = new Date();
////    exdate.setDate(exdate.getDate() + expiredays)
////    document.cookie = c_name + "=" + escape(value) + ";path=/;domain=zhext.e12.com.cn;secure" +
////    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())

////}


//function setCookie(name, value, expiredays) {
//    var str = name + "=" + escape(value); //不要忘了在对应getCookie函数里面加上decodeURI方法
//    var exdate = new Date();
//    exdate.setDate(exdate.getDate() + expiredays);
//    if (expiredays) {
//        str += "; expires=" + exdate.toGMTString();
//        str += "; path=/";
//        str += "; domain=e12.com.cn";
//        str += "; secure";
//    }
//    //    if (path) {
//    //        str += "; path=/";
//    //    }
//    //    if (domain) {
//    //        str += "; domain=zhext.e12.com.cn";
//    //    }
//    //    if (secure) {
//    //        str += "; secure";
//    //    }
//    document.cookie = str;
//}

////function getCookie(c_name) {
////    if (document.cookie.length > 0) {
////        c_start = document.cookie.indexOf(c_name + "=")
////        if (c_start != -1) {
////            c_start = c_start + c_name.length + 1
////            c_end = document.cookie.indexOf(";", c_start)
////            if (c_end == -1) c_end = document.cookie.length
////            return unescape(document.cookie.substring(c_start, c_end))
////        }
////    }
////    return ""
////}

////function getCookie(c_name) {
////    if (document.cookie.length > 0) {
////        c_start = document.cookie.indexOf(c_name + "=")
////        if (c_start != -1) {
////            c_start = c_start + c_name.length + 1
////            c_end = document.cookie.indexOf(";", c_start)
////            if (c_end == -1) c_end = document.cookie.length
////            return decodeURI(document.cookie.substring(c_start, c_end))
////        }
////    }
////    return ""
////}


//function getCookie(cookieName) {
//    var cookies = document.cookie.split("; "); //一个分号加一个空格
//    if (!cookies.length) { return ""; }
//    var pair = ["", ""];
//    for (var i = 0; i < cookies.length; i++) {
//        pair = cookies[i].split("="); //以赋值号分隔,第一位是Cookie名,第二位是Cookie值
//        if (pair[0] == cookieName) {
//            break;
//        }
//    }
//    return unescape(pair[1]);
//}


//function DelCookie(sName) {
//    document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
//}

//function killErrors() {
//    return true;
//}
//window.onerror = killErrors;



