//定义全局变量
var v_jsLayer; //弹出层页面必须定义
var qType = "";
var qAbility = "";
var qDifficulty = "";
var paperType = "";
var year = "";
var paperName = "";
var province = "";
var currentPage = 1;
var jsonTX;
var jsonNL;
var jsonND;
var jsonST;
var jsonNF;
var jsonPage;

$(document).ready(function () {//页面Dom元素加载完后  图片文件加载前执行
    v_jsLayer = new JSLayer();
    v_jsLayer.showJSLayer("数据加载中...");
    //bindEvent(); //绑定事件
    setTimeout(function () {
        LoadMyQuestion();
    }, 50);
});

function LoadMyQuestion() {

    // alert('进入加载方法');
    //加载目录树等属性 后 加载默认试题数据
    currentPage = 1; //查询第一页
    $.ajax({
        type: "get",
        url: "/zujuan/tj",
        data: {
            paperType: paperType,
            year: year,
            paperName: paperName,
            province: province,
            qType: qType,
            qAbility: qAbility,
            qDifficulty: qDifficulty,
            currentPage: currentPage,
            isPaging: 0
        },
        async: false,
        success: function (data) {

            if (data == "暂无数据") {
                v_jsLayer.showJSLayer(data);
            }
            else if (data == "获取数据失败") {
                v_jsLayer.showJSLayer(data);
            }
            else {
                var jData = eval(data);
                setViewSectionAndSubject(jData[8], jData[9]);
                returnSetPaperLoading(jData[0], jData[1], jData[2], jData[3], jData[4], jData[5], jData[6], jData[7]);
            }
        },
        error: function (data) {
            v_jsLayer.showJSLayer("未获取到数据，请稍候再访问！");
        }
    });
    v_jsLayer.dropJSLayer(); //关闭弹出层
}

function sendToMyQuestionPaging() {
    //alert(paperType + " | " + year + " | " + paperName + " | " + province + " | " + qType + " | " + qAbility + " | " + qDifficulty + " | " + currentPage);
    $.ajax({
        type: "get",
        url: "/zujuan/tj",
        data: {
            paperType: paperType,
            year: year,
            paperName: paperName,
            province: province,
            qType: qType,
            qAbility: qAbility,
            qDifficulty: qDifficulty,
            currentPage: currentPage,
            isPaging: 1
        },
        async: false,
        success: function (data) {
            if (data == "暂无数据") {
                v_jsLayer.showJSLayer(data);
            }
            else if (data == "获取数据失败") {
                v_jsLayer.showJSLayer(data);
            }
            else {
                var jData = eval(data);
                returnSetPaperPaging(jData[0], eval(jData[1]), jData[2], jData[3]);
            }
        },
        error: function (data) {
            v_jsLayer.showJSLayer("未获取到数据，请稍候再访问！");
        }
    });
    v_jsLayer.dropJSLayer(); //关闭弹出层
}

//获取 首页加载的返回值
function returnSetPaperLoading(returnVal, strJsonTX, strJsonNL, strJsonND, strJsonNF, strJsonST, strPageHTML, stCount) {

    if (returnVal == "成功") {
        //alert(typeof (strJsonTX) + " | " + typeof (strJsonNL) + " | " + typeof (strJsonND) + " | " + typeof (strJsonNF) + " | " + typeof (strJsonST) + " | " + typeof (strPageHTML) + " | " + typeof (stCount));
        //alert(strJsonNF);
        // if (strJsonTX != "暂无数据") jsonTX = eval(strJsonTX);
        if (strJsonTX != "暂无数据") jsonTX = strJsonTX;
        // if (strJsonNL != "暂无数据") jsonNL = eval(strJsonNL);
        if (strJsonNL != "暂无数据") jsonNL = strJsonNL;
        // if (strJsonND != "暂无数据") jsonND = eval(strJsonND);
        if (strJsonND != "暂无数据") jsonND = strJsonND;
        // if (strJsonST != "暂无数据") jsonST = eval(strJsonST);
        if (strJsonST != "暂无数据") jsonST = strJsonST;
        //给分页HTML赋值
        jsonPage = strPageHTML;

        //alert(jsonTX + " | " + jsonNL + " | " + jsonND + " | " + strJsonNF + " | " + jsonST + " | " + jsonPage + " | " + stCount);
        //加载目录树
        InitNodeTree(strJsonNF);
        //加载试题属性
        InitAttribute(jsonTX, jsonNL, jsonND);
        //加载试题
        printSTInfo(jsonST, jsonPage, stCount);
        loadMyQuestionBasket(); //加载试题篮方法
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
        //alert('出现此提示是未联网或程序出错\n如确认已联网，请联系客服解决！');
    }
}

//获取 点击属性或分页等检索返回值
function returnSetPaperPaging(returnVal, strJsonST, strPageHTML, stCount) {
    //alert(returnVal + " | " + strPageHTML + " | " + stCount);
    if (returnVal == "成功") {
        //        //alert(typeof (strJsonST));
        //        if (typeof (strJsonST) == "object") {
        //            //if (strJsonST.length > 0) {//其实就是  stCount
        //            //if (len(strJsonST) > 0 && strJsonST != "暂无数据")
        jsonST = eval(strJsonST);
        //alert(jsonST);
        //给分页HTML赋值
        jsonPage = strPageHTML;
        //给试题总量赋值
        jsonSTCount = stCount;
        printSTInfo(jsonST, jsonPage, stCount);
        //}
        //else {
        //}
        //        }
        //        //else {
        //        //    alert(len(strJsonST));
        //        //}
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
        //alert('出现此提示是未联网或程序出错\n如确认已联网，请联系客服解决！');
    }
}

function InitNodeTree(json) {

    //alert(json.length);
    if (json != "暂无数据") {
        $("#treeContent").unbind().html("").jstree({
            "themes": {
                "dots": true,
                "icons": true
            },
            "html_data": {
                "data": json

            },

            "ui": {"select_limit": 1}, //"initially_select": 1
            "plugins": ["themes", "ui", "html_data"]
        })
        // $("#treeContent").jstree("open_all");
        $('#treeContent').jstree('open_node', '#date高考真题');//默认展开
        $('#treeContent').jstree('open_node', '#date中考真题');//默认展开
        SetClickTree(); //设置目录树点击事件
    }
    else {
        $("#treeContent").unbind().html("暂无数据");
    }
}

function SetClickTree() {
    $("#treeContent a").click(function () {
        var nodeId = this.parentNode.id.replace("date", "");
        var dateStr = nodeId.split("-");
        //alert(dateStr.length + " | " + dateStr[0]);
        if (dateStr.length == 1) {
            paperType = dateStr[0];
            year = "";
            paperName = "";
        }
        else if (dateStr.length == 2) {
            paperType = dateStr[0];
            year = dateStr[1];
            paperName = "";
        }
        else if (dateStr.length == 3) {
            paperType = dateStr[0];
            year = dateStr[1];
            paperName = dateStr[2];
        }
        currentPage = 1; //查询第一页
        v_jsLayer.showJSLayer("数据加载中..."); //显示弹出层
        setTimeout(function () {
            sendToMyQuestionPaging();
        }, 50);
    });
}

function InitAttribute(jsonTX, jsonNL, jsonND) {

    var txHTML = getTXHTML(jsonTX);
    //alert(txHTML);
    var kcnlHTML = getKCNLHTML(jsonNL);
    //alert(kcnlHTML);
    var ndHTML = getNDHTML(jsonND);
    //alert(ndHTML);
    var Html = txHTML + kcnlHTML + ndHTML;
    //alert(Html);
    if (Html != null && Html.length > 0) {
        $("#stxx").html(Html);
    }
}

function getTXHTML(jsonTX) {
    //<h2><b>题型筛选：</b><a href="#">全部</a> <a href="#">作文</a> <a href="#">沙宣</a> <a href="#">阅读题</a> <a href="#">选择题</a> <a href="#">其他</a></h2>
    if (jsonTX != null) {
        var html = "";
        html += "<h2 id='h2tx'><b>题型：</b> <a href=\"javascript:changeSX('h2tx','全部')\" class=\"on\">全部</a> ";
        $.each(jsonTX, function () {
            html += "<a href=\"javascript:changeSX('h2tx','" + this.caption + "');\" id='" + this.txid + "'>" + this.caption + "</a> ";
        });
        html += "</h2>";
        return html;
    }
}

function getKCNLHTML(jsonNL) {
    //<h2><b>考查力筛选：</b><a href="#">全部</a> <a href="#">容易</a> <a href="#">较容易</a> <a href="#">中</a><a href="#">比较难</a><a href="#">难</a> </h2>
    if (jsonNL != null) {
        var html = "";
        html += "<h2 id='h2nl'><b>考查能力：</b> <a href=\"javascript:changeSX('h2nl','全部')\" class=\"on\">全部</a> ";
        $.each(jsonNL, function () {
            html += "<a href=\"javascript:changeSX('h2nl','" + this.caption + "');\" id='" + this.kcid + "'>" + this.caption + "</a> ";
        });
        html += "</h2>";
        return html;
    }
}

function getNDHTML(jsonND) {
    //<h2><b>难易筛选：</b><a href="#">全部</a> <a href="#">容易</a> <a href="#">较容易</a> <a href="#">中</a><a href="#">比较难</a><a href="#">难</a> </h2>
    if (jsonND != null) {
        var html = "";
        html += "<h2 id='h2nd'><b>难度：</b> <a href=\"javascript:changeSX('h2nd','全部')\" class=\"on\">全部</a> ";
        $.each(jsonND, function (i, val) {
            html += "<a href=\"javascript:changeSX('h2nd','" + val + "');\">" + val + "</a> ";
        });
        html += "</h2>";
        return html;
    }
}

function changeSX(sxId, sxText) {
    $("#" + sxId + " a").each(function () {
        //注释一下方法的原因是 match 是like 
        //if ($(this).text().match(sxText) != null) {
        if ($(this).text().trim() == sxText.trim()) {
            //alert($(this).text());
            $(this).removeClass().addClass("on");
        }
        else {
            $(this).removeClass();
        }
    });

    if (sxId.trim() == "h2tx") {
        qType = sxText;
    }
    else if (sxId.trim() == "h2nl") {
        qAbility = sxText;
    }
    else if (sxId.trim() == "h2nd") {
        qDifficulty = sxText;
    } else {
    }
    currentPage = 1; //查询第一页
    v_jsLayer.showJSLayer("数据加载中..."); //显示弹出层
    setTimeout(function () {
        sendToMyQuestionPaging();
    }, 50);
}

function printSTInfo(jsonST, jsonPage, jsonSTCount) {
    //alert("进入试题信息" + jsonST + " | " + jsonPage + " | " + jsonSTCount);
    $("#spanSTCount").text("共有试题" + jsonSTCount + "道");
    var ContentHtml = "";
    if (jsonSTCount > 0) {
        $.each(jsonST, function (i, value) {
            //alert(value.st.MYQUESTION_ID);
            //alert(value.st.题型);
            //alert(jsonST.st.题型);
            //alert(jsonST[i].st.题型);
            var stContentHtml = "";
            stContentHtml += "<div class=\"shitk\" id='T" + value.st.tid1 + "'>";
            stContentHtml += "<h1>";

            if (value.st.tx != null && value.st.tx) {
                stContentHtml += "<span class=\"t2\">" + value.st.tx + "</span>";
            }
            if (value.st.kcnl != null && value.st.kcnl) {
                stContentHtml += "<span class=\"t5\">" + value.st.kcnl + "</span>";
            }
            if (value.st.nd != null && value.st.nd) {
                stContentHtml += "<span class=\"t3\">" + value.st.nd + "</span>";
            }

            //alert(value.zsdlist.length);
            var zsdStr = "";
            if (value.zsdlist != null && typeof (value.zsdlist) != "undefined" && value.zsdList.length > 0) {
                $.each(value.zsdlist, function (i) {
                    zsdStr += this.zsdMc + "，";
                });
            }

            if (zsdStr && zsdStr != null && typeof (zsdStr) != "undefined" && zsdStr.length > 0) {
                var zsdStrNew = zsdStr;
                //alert(zsdStrNew.substring(0, zsdStrNew.length - 1));
                stContentHtml += "<span class=\"t4\">" + zsdStrNew.substring(0, zsdStrNew.length - 1) + "</span>";
            }
            stContentHtml += "<span class=\"t6\">" + value.st.score + "</span>";

            stContentHtml += "<span class=\"right\"><span>题号：</span><span>" + value.st.tid1 + "</span></span>";
            stContentHtml += "<br/>";
            stContentHtml += "<span class=\"left\">来源：<span>" + value.st.zlSource + "</span></span>";
            stContentHtml += "</h1>";
            stContentHtml += "<div class=\"cls\"></div>";
            stContentHtml += "<div class=\"quesdiv\" id=\"QuestionContent" + value.st.tid1 + "\">";
            stContentHtml += "<div class=\"nr\"><span style=\"color:red;\">【命题】</span><div class=\"stContent\">" + value.st.tigan + "</div></div>";
            stContentHtml += "<div class=\"answer\" style=\"display:none;\">"; //style=\"display:none;\"   style=\"visibility:visible;\"
            stContentHtml += "<h1>【答案】</h1>";
            if (value.st.objective == "True") {
                var answerNew = value.st.answer;
                if (answerNew.indexOf("组") >= 0 || answerNew.indexOf("不") >= 0) {
                    stContentHtml += "<div class=\"dadan\">" + answerNew.substring(0, answerNew.length - 1) + "</div>";
                }
                else {
                    stContentHtml += "<div class=\"dadan\">" + value.st.answer + "</div>";
                }
            }
            else {
                stContentHtml += "<div class=\"dadan\">" + value.st.answer + "</div>";
            }
            stContentHtml += "<h1>【解析】</h1>";
            stContentHtml += "<div class=\"dadan\">" + value.st.jiexi + "</div>";
            stContentHtml += "</div>";
            if (value.isInPaper == "是") {
                stContentHtml += "<div class=\"selectedmask\"></div>";
            }
            stContentHtml += "</div>";
            stContentHtml += "<div class=\"quesmeanbox\">";
            stContentHtml += "<div class=\"quesmean1\"> ";
            stContentHtml += "<a href=\"javascript:showSTDAJX('" + value.st.tid1 + "','answer');\" name='lookST' >查看答案解析</a>";
            stContentHtml += "</div>";
            stContentHtml += "<div class=\"quesmenu1\">";

            if (value.isFav == "是") {
                stContentHtml += "<a title=\"从我的题库移出试题\" class=\"buh yctk\" id=\"collect" + value.st.tid1 + "\" href=\"javascript:;\">移出我的题库</a>";
            }
            else {
                stContentHtml += "<a title=\"加入试题到我的题库\" class=\"buo jiatk\" id=\"collect" + value.st.tid1 + "\" href=\"javascript:;\">加入我的题库</a>";
            }
            if (value.isInPaper == "是") {
                stContentHtml += "<a title=\"从试题篮移出试题\" class=\"buh ycsj\" id=\"QuestionOperate" + value.st.tid1 + "\" node=\"" + value.st.jiaocaiCata + "\" period=\"" + value.st.section + "\" subject=\"" + value.st.subject + "\" questionType=\"" + value.st.tx + "\" difficulty=\"" + value.st.nd + "\" score=\"" + value.st.score + "\" href=\"javascript:;\">移出试卷</a>";
            }
            else {
                stContentHtml += "<a title=\"加入试题到试题篮\" class=\"buo jshijuan\" id=\"QuestionOperate" + value.st.tid1 + "\" node=\"" + value.st.jiaocaiCata + "\" period=\"" + value.st.section + "\" subject=\"" + value.st.subject + "\" questionType=\"" + value.st.tx + "\" difficulty=\"" + value.st.nd + "\" score=\"" + value.st.score + "\" href=\"javascript:;\">加入试卷</a>";
            }
            stContentHtml += "</div>";

            stContentHtml += "</div>";
            stContentHtml += "</div>";
            ContentHtml += stContentHtml;
        });
    }
    //alert(ContentHtml);
    $("#stContent").html(ContentHtml);
    $("#pageingNum").html(jsonPage);
    v_jsLayer.dropJSLayer(); //关闭弹出层
}

//显示  隐藏  答案解析
function showSTDAJX(tid, classDAJX, thisA) {
    //alert(tid + " " + classDAJX);
    var divSTIndex = $("#T" + tid + " ." + classDAJX);
    var divSTIndexText = $("#T" + tid + " a[name='lookST']");
    //alert(divSTIndexText);
    if (divSTIndexText.text() == "查看答案解析") {
        divSTIndexText.text("隐藏答案解析");
        divSTIndex.show();
    }
    else {
        divSTIndexText.text("查看答案解析");
        divSTIndex.hide();
    }
    //调整灰层大小
    setShadowSize(tid); //此方法需要引用  tikuTestBasket.js
}

//分页方法
function stPaging(pageNum) {
    v_jsLayer.showJSLayer("数据加载中..."); //显示弹出层
    currentPage = pageNum;
    setTimeout(function () {
        sendToMyQuestionPaging();
    }, 50);
}

function setViewSectionAndSubject(strSection, strSubject) {
    if (strSection == "小学") {
        $("#AsmSelect").hide();
    } else if (strSection == "初中") {
        $("#AsmSelect").show();
        $("#AsmSelect").text("中考");
    } else {
        $("#AsmSelect").show();
        $("#AsmSelect").text("高考");
    }
    $("#CurrentPeriodSubject").text("当前学科：" +strSection + strSubject);
}

