//定义需要的全局变量
var selectTypeLoad = "jc";
var isMLorZSD = 'ML'; //可不设置  因为下面加载代码中已设置
var jsonML;
var jsonZSD;
var jsonTX;
var jsonNL;
var jsonND;
var jsonNF;
var jsonST;
var jsonPage;
var jsonSTCount;
var selectML = '全部';
var selectZSD = '全部';
var selectTX = '全部';
var selectNL = '全部';
var selectND = '全部';
var selectNF = '全部';
var CurrentPage = 1;
var TXMenuHTML = "";
var NLMenuHTML = "";
var NDMenuHTML = "";
var NFMenuHTML = "";
var v_jsLayer; //弹出层页面必须定义

//$(function () {//页面加载前执行
$(document).ready(function () {//页面Dom元素加载完后  图片文件加载前执行
    //window.onload = function () {//等待页面内DOM、图片资源加载完毕后触发执行   每个页面只能有一个window.onload
    v_jsLayer = new JSLayer();
    v_jsLayer.showJSLayer("数据加载中...");

    selectTypeLoad = $("#myTikuSelect").html();
    if (selectTypeLoad == "chapter") {
        selectTypeLoad = "jc";
    }
    if (selectTypeLoad == "knowledge") {
        selectTypeLoad = "zsd";
    }

    if (selectTypeLoad != null && selectTypeLoad == 'jc') {
        isMLorZSD = "ML";
    }
    else if (selectTypeLoad != null && selectTypeLoad == 'zsd') {
        isMLorZSD = "ZSD";
    }
    setTimeout(function () {
        myLoadZNXTFun();
    }, 50);
});

//加载页面后 客户端返回Json 数据
function setTikuJsonValue(returnVal, MLorZSD, strJsonMLS, strJsonTX, strJsonNL, strJsonST, strJsonND, strJsonNF, strPageHTML, nodeNo, stCount) {
    //console.log(returnVal + " | " + MLorZSD + " | " + strJsonMLS + " | " + strJsonTX + " | " + strJsonNL + " | " + strJsonST + " | " + strJsonND + " | " + strJsonNF + " | " + strPageHTML + " | " + nodeNo + " | " + stCount);
    if (returnVal == "成功") {
        //            alert(typeof (MLorZSD));
        //            alert(MLorZSD);
        //            alert(typeof (strJsonTX));
        //            alert(strJsonTX);
        //            alert(typeof (MLorZSD));
        isMLorZSD = MLorZSD;
        if (MLorZSD == "ML") {
            jsonML = strJsonMLS;
            //给当前教材节点赋值
            selectML = nodeNo;
            //加载目录树
            //InitNodeTree(jsonML);//换成了以下ajax加载
            InitNodeTree(nodeNo);
        }
        else if (MLorZSD == "ZSD") {
            //alert(strJsonMLS);
            jsonZSD = strJsonMLS;
            //给当前教材节点赋值
            selectZSD = nodeNo;
            //加载目录树
            //InitNodeTree(jsonZSD);//换成了以下ajax加载
            InitNodeTree(nodeNo);
        }
        //        else if (MLorZSD == "TJ") {
        //            jsonTJ = strJsonMLS;
        //            selectTJ = nodeNo;
        //            InitNodeTree(jsonTJ);
        //        }
        else {
        }
        // if (strJsonTX != "暂无数据") jsonTX = JSON.parse(strJsonTX);
        if (strJsonTX != "暂无数据") jsonTX = strJsonTX;

        //else jsonTX = strJsonTX;
        // if (strJsonNL != "暂无数据") jsonNL = eval(strJsonNL);
        if (strJsonNL != "暂无数据") jsonNL = strJsonNL;

        //else jsonNL = strJsonNL;
        // if (strJsonND != "暂无数据") jsonND = eval(strJsonND);
        if (strJsonND != "暂无数据") jsonND = strJsonND;

        //else jsonND = strJsonND;
        // if (strJsonNF != "暂无数据") jsonNF = eval(strJsonNF);
        if (strJsonNF != "暂无数据") jsonNF = strJsonNF;

        //else jsonNF = strJsonNF;
        if (strJsonST != "暂无数据") jsonST = eval(strJsonST);
        // if (strJsonST != "暂无数据") jsonST = strJsonST;

        //else jsonST = strJsonST;
        //alert(jsonST[0].st.题型);

        //给分页HTML赋值
        jsonPage = strPageHTML;
        //给试题总量赋值
        jsonSTCount = stCount;

    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
        //alert('出现此提示是未联网或程序出错\n如确认已联网，请联系客服解决！');
    }
}

function myLoadZNXTFun() {
    //alert('111');
    selectTypeLoad = $("#myTikuSelect").html();
    if (selectTypeLoad == "chapter") {
        selectTypeLoad = "jc";
    }
    if (selectTypeLoad == "knowledge") {
        selectTypeLoad = "zsd";
    }
    if (selectTypeLoad != null && selectTypeLoad == 'jc') {
        isMLorZSD = "ML";
    } else if (selectTypeLoad != null && selectTypeLoad == 'zsd') {
        isMLorZSD = "ZSD";
    }
    //    else if (selectTypeLoad != null && selectTypeLoad == 'tj') {
    //        isMLorZSD = "TJ";
    //    }
    else {
        isMLorZSD = "ML"; //不能改成SM 报错 还没有查原因  TJ套卷?
    }
    jsStart();
    //alert('222');
    //加载页面上的事件
    //InitPageEvents();
    //alert('333');
    //设置点击目录树事件 和 页面其他事件
    SetClickTree(); ////换成了以下ajax加载  不需要绑定点击事件了
    //alert('444');
    //加载目录树后加载默认试题数据
    InitTestFirst();
    //alert('555');

    loadMyQuestionBasket(); //加载试题篮方法
}

function jsStart() {
    //通知客户端获取Json数据

    if (isMLorZSD == "ML") {
        $.ajax({
            type: "get",
            url: "/zujuan/ml",
            data: {mlbh: "", Questions: "", Difficulty: "", Ability: "", Year: "", CurrentPage: 1, isPaging: 0},
            async: false,
            success: function (data) {
                if (data == "暂无数据") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else if (data == "获取数据失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    setViewSectionAndSubject(jData[11], jData[12]);
                    setTikuJsonValue(jData[0], jData[1], eval(jData[2]), jData[3], jData[4], jData[5], eval(jData[6]), eval(jData[7]), jData[8], jData[9], jData[10]);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    }
    else if (isMLorZSD == "ZSD") {
        $.ajax({
            type: "get",
            url: "/zujuan/zsd",
            data: {mlbh: "", Questions: "", Difficulty: "", Ability: "", Year: "", CurrentPage: 1, isPaging: 0},
            async: false,
            success: function (data) {
                if (data == "暂无数据") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else if (data == "获取数据失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    setViewSectionAndSubject(jData[11], jData[12]);
                    setTikuJsonValue(jData[0], jData[1], eval(jData[2]), eval(jData[3]), eval(jData[4]), eval(jData[5]), eval(jData[6]), eval(jData[7]), jData[8], jData[9], jData[10]);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    }
}

function InitNodeTree(json) {
    //alert(json + "|" + json.length);
    //    var selectNumTree="";
    //    if (isMLorZSD == "ML") {
    //        selectNumTree = selectML; //selectML其实就是现在的json
    //    }
    //    else if (isMLorZSD == "ZSD") {
    //        selectNumTree=selectZSD;
    //    }
    $("#treeContent").unbind().html("").jstree({
        "lang": {"loading": '目录加载中...'},
        "themes": {
            "theme": "default",
            "url": "/Content/css/list.css",
            "dots": true,
            "icons": true
        },
        "html_data": {
            //"data": json
            "ajax": {
                "url": "/zujuan/getMLOrZSDTreeInfo?isMLorZSD=" + isMLorZSD + "&collect=" + 0, //&num=" + json + " //不需要拼接 num 参数，data 代码会自动将 id 属性传入url 为参数
                "data": function (n) {
                    //                    alert(typeof (n) + "|" + n + "|" + n.attr);
                    //                    if (n.attr) {
                    //                        alert(n.attr("id"));
                    //                    }
                    return {
                        id: n.attr ? n.attr("id") : json
                    };
                }
            }
        },
        //        "callback" : {        
        //            onselect : function(node,tree_obj){//节点单击事件   
        //                alert(node); 
        //            }
        //        }, //end callback  
        "ui": {"select_limit": 1},
        "plugins": ["themes", "ui", "html_data"]
    })

    //    //自己实现的双击事件
    //    .bind("dblclick_node.jstree", function(e, data) { 
    //        alert(data.rslt.obj.attr("id") + ":" + data.rslt.obj.attr("title")); 
    //    }) 

    //    //双击事件
    //    .bind('dblclick.jstree', function (event) {
    //        var eventNodeName = event.target.nodeName;
    //        //alert(eventNodeName + "dblclick");
    //        if (eventNodeName == 'INS' || eventNodeName == "LI") {
    //            return;
    //        } else if (eventNodeName == 'A') {
    //            var $subject = $(event.target).parent();
    //            if ($subject.find('ul').length > 0) {
    //            } else {
    //                //选择的id值
    //                var selectId = $(event.target).parents('li').attr('id');
    //                alert(selectId + "dblclick");
    //            }
    //        }
    //    })

    //    //单击事件
    //         .bind('click.jstree', function (event) {
    //             var eventNodeName = event.target.nodeName;
    //             //alert(eventNodeName + "click");
    //             if (eventNodeName == 'INS' || eventNodeName == "LI") {
    //                 return;
    //             } else if (eventNodeName == 'A') {
    //                 var category = $("#treeContent").find("a.jstree-clicked").parents("li");
    //                 var categoryId = (category.length > 0) ? category.attr("id") : json;
    //                 //console.log(categoryId);
    //                 //alert(categoryId);
    //                 //             var $subject = $(event.target).parent();
    //                 //             if ($subject.find('ul').length > 0) {
    //                 //             } else {
    //                 //                 //选择的id值
    //                 //                 var categoryid = $(event.target).parents('li').attr('id');
    //                 //                 alert(categoryId);
    //                 //                 //查询试题
    //                 //clickTreeNode(categoryId);
    //                 setTimeout(function () { alert(categoryId); clickTreeNode(categoryId); }, 50);
    //                 //             }
    //             }
    //         })

    //    .bind("loaded.jstree", function (e, data) {
    //        if ($('.categoryIdDiv').html() != "") {
    //            SetSelectTree(101101);
    //        }
    //    });

}

function InitTestFirst() {
    //加载试题查询条件（属性）
    InitProperty();
    //加载第一页试题数据
    InitTestList(false);
}

function SetClickTree() {
    //alert('SetClickTree');
    $("#treeContent").on("click", "a", function () {
        //$("#treeContent a").on("click", function () {
        //$("#treeContent a").click(function () {//live
        var nodeId = this.parentNode.id;
        //alert("click" + nodeId);
        v_jsLayer.showJSLayer("数据加载中..."); //显示弹出层
        setTimeout(function () {
            clickTreeNode(nodeId);
        }, 50);
    });
    //    $("#treeContent").on("dblclick", "a", function () {
    //        var nodeId = this.parentNode.id;
    //        //alert("dblclick" + nodeId);
    //        var categoryid = $(this).parent().attr("id");
    //        alert(nodeId + "|" + categoryid);
    //        v_jsLayer.showJSLayer("数据加载中..."); //显示弹出层
    //        setTimeout(function () { clickTreeNode(nodeId); }, 50);
    //    });
}

function clickTreeNode(nodeId) {
    //alert("点击了" + nodeId);
    if (isMLorZSD == "ML") {
        selectML = nodeId;
    }
    else if (isMLorZSD == "ZSD") {
        selectZSD = nodeId;
    }
    //    else if (isMLorZSD == "TJ") {
    //        selectTJ = nodeId;
    //    }
    //$("#selectCatalog").val(nodeId);
    //点击目录树后加载试题数据
    InitTestList(true);
}

function InitProperty() {
    var txHTML = getTXHTML();
    //alert(txHTML);
    var ndHTML = getNDHTML();
    //alert(ndHTML);
    var kcnlHTML = getKCNLHTML();
    //alert(kcnlHTML);
    //var yearHTML = getYearHTML();//暂时不需要年份
    var yearHTML = "";
    //alert(yearHTML);   在线题库

    var Html = txHTML + kcnlHTML + ndHTML + yearHTML;
    //alert(Html);
    if (Html != null && Html.length > 0) {
        $("#stxx").html(Html);
    }
}

function getTXHTML() {
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

function getKCNLHTML() {
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

function getNDHTML() {
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

function getYearHTML() {
    //<h2><b>年份筛选：</b><a href="#">全部</a> <a href="#">2015</a> <a href="#">2014</a> <a href="#">2013</a><a href="#">2012</a><a href="#">2011</a><a href="#">2010</a> </h2>
    if (jsonNF != null) {
        var html = "";
        html += "<h2 id='h2nf'><b>年份：</b> <a href=\"javascript:changeSX('h2nf','全部')\" class=\"on\">全部</a> ";
        $.each(jsonNF, function (i, val) {
            html += "<a href=\"javascript:changeSX('h2nf','" + val + "');\">" + val + "</a> ";
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
    //    <a href="#">题型：作文</a>
    //    <a href="#">难易：容易</a>
    //    <a href="#">考查力：作文</a>

    if (sxId.trim() == "h2tx") {
        selectTX = sxText;
        if (sxText != "全部") {
            TXMenuHTML = "<a href='javascript:;'>题型：" + sxText + "</a>";
        }
        else {
            TXMenuHTML = "";
        }
    }
    else if (sxId.trim() == "h2nl") {
        selectNL = sxText;
        if (sxText != "全部") {
            NLMenuHTML = "<a href='javascript:;'>考查能力：" + sxText + "</a>";
        }
        else {
            NLMenuHTML = "";
        }
    }
    else if (sxId.trim() == "h2nd") {
        selectND = sxText;
        if (sxText != "全部") {
            NDMenuHTML = "<a href='javascript:;'>难度：" + sxText + "</a>";
        }
        else {
            NDMenuHTML = "";
        }
    }
    else if (sxId.trim() == "h2nf") {
        selectNF = sxText;
        if (sxText != "全部") {
            NFMenuHTML = "<a href='javascript:;'>年份：" + sxText + "</a>";
        }
        else {
            NFMenuHTML = "";
        }
    } else {
    }
    //if (TXMenuHTML != "" && NLMenuHTML != "" && NDMenuHTML != "" && NFMenuHTML != "") {
    var selectEDMenuHTML = TXMenuHTML + NLMenuHTML + NDMenuHTML + NFMenuHTML;
    //alert(selectEDMenuHTML);
    $("#selectedSX").html(selectEDMenuHTML);
    //}

    v_jsLayer.showJSLayer("数据加载中..."); //显示弹出层
    setTimeout(function () {
        InitTestList(true);
    }, 50);
}

function InitTestList(isFirst) {
    //alert(isFirst);
    if (isFirst == true) {
        //获取新的试题数据
        CurrentPage = 1; //每次操作都显示第1页（除点击分页）
        jsonST = getNewSTInfo();
    }
    $("#spanSTCount").text("共有试题" + jsonSTCount + "道");
    //    alert(jsonST);
    //    alert(jsonST[0].Tid1);

    printSTInfo();
}

function printSTInfo() {
    var ContentHtml = "";
    if (jsonSTCount > 0) {
        $.each(jsonST, function (i, value) {
            //console.log(value.st);
            //alert(strJsonST[0].st.Tid1);
            //alert(value.st.题型);
            //alert(jsonST.st.题型);
            //alert(jsonST[i].st.题型);
            var stContentHtml = "";
            stContentHtml += "<div class=\'shitk\' id=\'T" + value.st.tid1 + "\'>";
            stContentHtml += "<h1>";
            if (value.st.tx != null && value.st.tx) {
                stContentHtml += "<span class=\"t2\">" + value.st.tx + "</span>";
            }
            if (value.st.kcnl != null && value.st.kcnl) {
                stContentHtml += "<span class=\"t5\">" + value.st.kcnl + "</span>";
            }
            if (value.st.nd != null && value.st.nd) {
                var difficulty = ""
                if (value.st.nd == '1') {
                    difficulty = "易"
                }
                if (value.st.nd == '2') {
                    difficulty = "较易"
                }
                if (value.st.nd == '3') {
                    difficulty = "中"
                }
                if (value.st.nd == '4') {
                    difficulty = "较难"
                }
                if (value.st.nd == '5') {
                    difficulty = "难"
                }
                stContentHtml += "<span class=\"t3\">" + difficulty + "</span>";
            }

            stContentHtml += "<span class=\"t6\">" + value.st.score + "</span>";

            //stContentHtml += "<span class=\"ml_30\">试题评价：<span><a class=\"start4 start_1\"></a><a class=\"start4 start_1\"></a><a class=\"start4 start_2\"></a><a class=\"start4 start_3\"></a><a class=\"start4 start_3\"></a></span></span>";
            //stContentHtml += "<span class=\"right\">组卷次数：<span class=\"cf43\">" + value.st.Tid1 + "</span></span>";
            var lrsj0 = new Date(value.st.entranceTime);
            if (lrsj0.getFullYear() < 2016) {
                if (lrsj0.getMonth() < 7) {
                    lrsj0 = DateAdd("m", 15, lrsj0);
                } else {
                    lrsj0 = DateAdd("m", 10, lrsj0);
                }
            }

            stContentHtml += "<span class=\"right\">来源：<span>" + value.st.zlSource + "</span> 更新时间：<span>" + (new Date(lrsj0).toLocaleDateString().replace(/年|月/g, '-')).replace(/日/g, '') + "</span> 题号：<span>" + value.st.tid1 + "</span></span>";

            var zsdStr = "";
            //alert(isMLorZSD);
            if (isMLorZSD == "ML") {
                //console.log(value.zsdlist);
                //alert(value.zsdlist.length);
                if (value.zsdList != null && typeof (value.zsdList) != "undefined") {// && value.zsdlist.length > 0
                    $.each(value.zsdList, function (i) {
                        zsdStr += this.zsdMc + "，";
                    });
                    if (zsdStr && zsdStr != null && typeof (zsdStr) != "undefined") {// && zsdStr.length > 0
                        var zsdStrNew = zsdStr;
                        //alert(zsdStrNew.substring(0, zsdStrNew.length - 1));
                        stContentHtml += "<span class=\"t4\">" + zsdStrNew.substring(0, zsdStrNew.length - 1) + "</span>";
                    }
                }
            }
            else if (isMLorZSD == "ZSD") {
                //alert(value.jclist);
                //            alert(.教材目录节点);
                //alert(value.jclist[0].教材目录节点);
                if (value.jclist != null && typeof (value.jclist) != "undefined") {// && value.jclist.length > 0
                    $.each(value.jclist, function (i) {
                        if (this.版本) {
                            zsdStr += this.版本;
                        }
                        if (this.教材) {
                            zsdStr += ">" + this.教材;
                        }
                        if (this.章) {
                            zsdStr += ">" + this.章;
                        }
                        if (this.节) {
                            zsdStr += ">" + this.节;
                        }
                    });
                    if (zsdStr && zsdStr != null && typeof (zsdStr) != "undefined" && zsdStr.length > 0) {
                        stContentHtml += "<span class=\"t1\">" + zsdStr + "</span>";
                    }
                }
            }
            //        else {
            //            alert('else');
            //        }

            stContentHtml += "</h1>";
            //stContentHtml += "<h1><span>来源：" + value.st.资料来源 + "</span><span class=\"right\">更新时间：" + (new Date(value.st.录入时间).toLocaleDateString().replace(/年|月/g, '-')).replace(/日/g, '') + "</span></h1>";
            stContentHtml += "<div class=\"cls\"></div>";

            //        var mtnr = this.命题内容.toString().replace(new RegExp("##", "gm"), "（");
            //        mtnr = this.命题内容.replace(new RegExp("$$", "gm"), "）");//jquery 不能替换美元符号

            stContentHtml += "<div class=\"quesdiv\" id=\"QuestionContent" + value.st.tid1 + "\">";
            stContentHtml += "<div class=\"nr\"><span style=\"color:red;\">【命题】</span><div class=\"stContent\">" + value.st.tigan + "</div></div>";
            stContentHtml += "<div class=\"answer\" style=\"display:none;\">"; //style=\"display:none;\"   style=\"visibility:visible;\"
            stContentHtml += "<h1>【答案】</h1>";
            stContentHtml += "<div class=\"dadan\">" + value.st.answer + "</div>";
            stContentHtml += "<h1>【解析】</h1>";
            stContentHtml += "<div class=\"dadan\">" + value.st.jiexi + "</div>";
            stContentHtml += "</div>";
            if (value.isInPaper == "是") {
                stContentHtml += "<div class=\"selectedmask\"></div>";
            }
            stContentHtml += "</div>";
            stContentHtml += "<div class=\"quesmeanbox\">";
            //stContentHtml += "<span class=\"left pink size12\">打分：</span>";
            //stContentHtml += "<div title=\"给试题评分\" class=\"quesscore1\"> <span class=\"quesbox\"><a class=\"start start3\"></a><a class=\"start start3\"></a><a class=\"start start3\"></a><a class=\"start start3\"></a><a class=\"start start3\"></a></span> </div>";
            //stContentHtml += "<span style=\"width: 45px; color: #ff889d; font-size: 12px; float: left;\"><span id=\"\" val=\"0\">0</span>分</span>";
            stContentHtml += "<div class=\"quesmean1\">";
            //stContentHtml += "<a title=\"我要分享\" class=\"shareques\" href=\"javascript:void();\" quesbody=\"命题内容\" quesid=\"\">分享</a>";
            //stContentHtml += "<a title=\"我要评价\" class=\"commentques\"  href=\"javascript:void();\" >评论</a>";
            //stContentHtml += "<a title=\"我要挑错\" class=\"errorques\" id=\"errorq2804734\" href=\"javascript:void();\" >挑错</a>";
            stContentHtml += "<a href=\"javascript:showSTDAJX('" + value.st.tid1 + "','answer');\" name='lookST' >查看答案解析</a>";
            stContentHtml += "</div>";
            //stContentHtml += "<div class=\"newshare\" id=\"newsharediv2804734\"></div>";
            //stContentHtml += "<div class=\"quesmenu1\"> <a class=\"addques\" id=\"QuestionOperate" + value.st.Tid1 + "\" href=\"javascript:addTestST('" + value.st.Tid1 + "','" + value.st.教材目录节点 + "','" + value.st.原学段 + "','" + value.st.原学科 + "','" + value.st.题型 + "','" + value.st.难度 + "','" + value.st.分值 + "');\"></a>";

            stContentHtml += "<div class=\"quesmenu1\">";

            stContentHtml += "<a class=\"addques2\" title=\"选入试题篮\" ></a>"; //暂时不需要此功能
            if (value.isFav == "是") {
                stContentHtml += "<a title=\"从我的题库移出试题\" class=\"buh yctk\" id=\"collect" + value.st.tid1 + "\" href=\"javascript:;\">移出我的题库</a>";
            } else {
                stContentHtml += "<a title=\"加入试题到我的题库\" class=\"buo jiatk\" id=\"collect" + value.st.tid1 + "\" href=\"javascript:;\">加入我的题库</a>";
            }
            if (value.isInPaper == "是") {
                stContentHtml += "<a title=\"从试题篮移出试题\" class=\"buh ycsj\" id=\"QuestionOperate" + value.st.tid1 + "\" node=\"" + value.st.jiaocaiCata + "\" period=\"" + value.st.section + "\" subject=\"" + value.st.subject + "\" questionType=\"" + value.st.tx + "\" difficulty=\"" + value.st.nd + "\" score=\"" + value.st.score + "\" href=\"javascript:;\">移出试卷</a>";
            } else {
                stContentHtml += "<a title=\"加入试题到试题篮\" class=\"buo jshijuan\" id=\"QuestionOperate" + value.st.tid1 + "\" node=\"" + value.st.jiaocaiCata + "\" period=\"" + value.st.section + "\" subject=\"" + value.st.subject + "\" questionType=\"" + value.st.tx + "\" difficulty=\"" + value.st.nd + "\" score=\"" + value.st.score + "\" href=\"javascript:;\">加入试卷</a>";
            }
            //rav       yctk
            //fav       jiatk
            //delques   ycsj
            //addques   jshijuan

            stContentHtml += "</div>";

            stContentHtml += "</div>";
            stContentHtml += "</div>";
            ContentHtml += stContentHtml;
        });
    }
    $("#stContent").html(ContentHtml);
    $("#pageingNum").html(jsonPage);
    //console.log(jsonPage);
    v_jsLayer.dropJSLayer(); //关闭弹出层
}

function DateAdd(interval, number, date) {
    switch (interval.toLowerCase()) {
        case "y":
            return new Date(date.setFullYear(date.getFullYear() + number));
        case "m":
            return new Date(date.setMonth(date.getMonth() + number));
        case "d":
            return new Date(date.setDate(date.getDate() + number));
        case "w":
            return new Date(date.setDate(date.getDate() + 7 * number));
        case "h":
            return new Date(date.setHours(date.getHours() + number));
        case "n":
            return new Date(date.setMinutes(date.getMinutes() + number));
        case "s":
            return new Date(date.setSeconds(date.getSeconds() + number));
        case "l":
            return new Date(date.setMilliseconds(date.getMilliseconds() + number));
    }
}

function getNewSTInfo() {
    var nodeId, Questions, Difficulty, Ability, Year;
    Questions = selectTX;
    Difficulty = selectND;
    Ability = selectNL;
    Year = selectNF;
    if (isMLorZSD == "ML") {
        nodeId = selectML;
        //alert(nodeId + " " + Questions + " " + Difficulty + " " + Ability + " " + Year + " " + CurrentPage);
        //请求分页数据
        $.ajax({
            type: "get",
            url: "/zujuan/ml",
            data: {
                mlbh: nodeId,
                Questions: Questions,
                Difficulty: Difficulty,
                Ability: Ability,
                Year: Year,
                CurrentPage: CurrentPage,
                isPaging: 1
            },
            async: false,
            success: function (data) {
                if (data == "暂无数据") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else if (data == "获取数据失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    returnSTPaging(jData[0], eval(jData[1]), jData[2], jData[3]);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    }
    else if (isMLorZSD == "ZSD") {
        nodeId = selectZSD;
        //alert(nodeId + " " + Questions + " " + Difficulty + " " + Ability + " " + Year + " " + CurrentPage);
        //请求分页数据
        $.ajax({
            type: "get",
            url: "/zujuan/zsd",
            data: {
                mlbh: nodeId,
                Questions: Questions,
                Difficulty: Difficulty,
                Ability: Ability,
                Year: Year,
                CurrentPage: CurrentPage,
                isPaging: 1
            },
            async: false,
            success: function (data) {
                if (data == "暂无数据") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else if (data == "获取数据失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    returnSTPaging(jData[0], jData[1], jData[2], jData[3]);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    }
    //    else if (isMLorZSD == "TJ") {
    //        alert('套卷');
    //    }
}

function returnSTPaging(returnVal, data, pagingHtml, stCount) {
    if (returnVal == "成功") {
        //alert(data);
        //alert(typeof (data));
        //alert(data[0].Tid1);
        //alert(pagingHtml);
        //alert(data);
        //if (data != "暂无数据")
        jsonST = eval(data);
        //给分页HTML赋值
        jsonPage = pagingHtml;
        //给试题总量赋值
        jsonSTCount = stCount;
        InitTestList(false);
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

function stPaging(pageNum) {
    //alert(pageNum);
    //只有点击分页时才给页码赋值

    v_jsLayer.showJSLayer("数据加载中..."); //显示弹出层
    setTimeout(function () {
        CurrentPage = pageNum;
        getNewSTInfo();
    }, 50);
}

function showSTDAJX(tid, classDAJX) {
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

function returnKnowledgeInfo(returnVal, zsdJsonStr, stJsonStr, pageJsonStr, zsdNo, stCount) {
    if (returnVal == "成功") {
        //function returnKnowledgeInfo(stJsonStr) {
        //给知识点json赋值
        jsonZSD = zsdJsonStr;
        //alert(typeof (stJsonStr));
        //alert(stJsonStr[0].jclist);
        //if (stJsonStr != "暂无数据") 
        jsonST = eval(stJsonStr);
        //alert(json);
        //给当前教材节点赋值
        selectZSD = zsdNo;
        //给分页HTML赋值
        jsonPage = pageJsonStr;
        //给试题总量赋值
        jsonSTCount = stCount;
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

function returnCatalogInfo(returnVal, mlJsonStr, stJsonStr, pageJsonStr, mlNo, stCount) {
    if (returnVal == "成功") {
        //给知识点json赋值
        jsonML = mlJsonStr;
        //if (stJsonStr != "暂无数据") 
        jsonST = eval(stJsonStr);
        //给当前教材节点赋值
        selectML = mlNo;
        //给分页HTML赋值
        jsonPage = pageJsonStr;
        //给试题总量赋值
        jsonSTCount = stCount;
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
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
    $("#CurrentPeriodSubject").text("当前学科：" + strSection + strSubject);
}




