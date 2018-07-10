var questionData = null;
var paperData = null;
var flagSave = false;
var dataNullInfo = "______";
var myPaperId = 0;
var basketType = 1;
var paperType = 2;

var v_jsLayer;//弹出层页面必须定义
////window.onload = function () {//等待页面内DOM、图片资源加载完毕后触发执行   每个页面只能有一个window.onload　
$(window).ready(function () {

    // v_jsLayer = new JSLayer();
    // v_jsLayer.showJSLayer("数据加载中...");
    PaperEvents();
    setTimeout(function () {
        myLoadZJZXFun();
    }, 10);
    //}
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function myLoadZJZXFun() {
    //初始化试卷中心
    if (GetQueryString("type") == 1) {
        loadTestCenter();
    } else if (GetQueryString("type") == 2) {
        loadTestCenterPaper()
    }
    PaperEventAgain();
    loadMyQuestionBasket(); //加载试题篮方法
}


function loadTestCenterPaper() {
    $.ajax({
        type: "get",
        url: "/MyPaperStructs/loadTestCenter",
        data: {paperId: GetQueryString("paperId")},
        async: false,
        success: function (data) {
            if (data.result == "获取试题数据异常") {
                v_jsLayer.tipForTime(data, 1000);
            } else if (data.result == "试题篮为空") {
                //当在组卷中心清空试题篮时，需要将内容清空
                $("#pui_body").empty();
                $("#pui_score").empty();
                v_jsLayer.tipForTime("你的试题篮是空的，去智能选题加入试卷吧！", 1000);
            }
            else if (data.result == "没有查询到你要的试题") {
                v_jsLayer.tipForTime('试题篮为空', 1000);
            }
            else {
                var jData = eval(data);
                getTestCenterGjw(jData);
                myPaperId = jData.data.id;
                // getTestCenter(jData[0], eval(jData[1]), JSON.parse(jData[2]));
            }
        },
        error: function (data) {
            v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
        }
    });
    //setQuestionPaperScore(); //当时组卷中心页面 点击 “删除题型”和“清空试题篮”后 会调用 汤立德  20151105 改成当前页面刷新 所以不需要了
}

function loadTestCenter() {
    $.ajax({
        type: "get",
        url: "/MyPaperStructs/loadTestCenter",
        //data: { tIdS: questionListStr, isZhnetST: addZhnetQuestionValue, isPicST: 0 },
        async: false,
        success: function (data) {
            if (data.result == "获取试题数据异常") {
                v_jsLayer.tipForTime(data, 1000);
            } else if (data.result == "试题篮为空") {
                //当在组卷中心清空试题篮时，需要将内容清空
                $("#pui_body").empty();
                $("#pui_score").empty();
                v_jsLayer.tipForTime("你的试题篮是空的，去智能选题加入试卷吧！", 1000);
            }
            else if (data.result == "没有查询到你要的试题") {
                v_jsLayer.tipForTime('试题篮为空', 1000);
            }
            else {
                var jData = eval(data);
                getTestCenterGjw(jData);
                myPaperId = jData.data.id;
                // getTestCenter(jData[0], eval(jData[1]), JSON.parse(jData[2]));
            }
        },
        error: function (data) {
            v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
        }
    });
    //setQuestionPaperScore(); //当时组卷中心页面 点击 “删除题型”和“清空试题篮”后 会调用 汤立德  20151105 改成当前页面刷新 所以不需要了
}

//完成组卷
function change_paper_type() {
    deleteQuestionsAndQuestionType()
    if (GetQueryString("type") == 1) {
        $.ajax({
            url: "/MyPaperStructs/saveMyPaper",
            type: "get",
            async: false,
            data: {paperId: paperData.id},
            success: function (data) {
                if (data.result == -1) {
                    v_jsLayer.showJSLayer(data.reason);
                    loadTestCenter();
                } else if (data.result == 0) {
                    genPaper(paperData.id);
                    window.location.href = "myPaperList.html";
                }
            }
        });
    } else if (GetQueryString("type") == 2) {
      window.history.go(-1);
    }

    // $.ajax({
    //     url: "/MyPaperStructs/saveMyPaper",
    //     type: "get",
    //     async: false,
    //     data: {paperId: paperData.id},
    //     success: function (data) {
    //         if (data.result == -1) {
    //             v_jsLayer.showJSLayer(data.reason);
    //             loadTestCenter();
    //         } else if (data.result == 0) {
    //             genPaper(paperData.id);
    //             window.location.href = "myPaperList.html";
    //         }
    //     }
    // });
}

//组卷中心 添加新题型--右侧的
function add_question_type() {
    _setPapperChanged(true);
    var content;
    if (paperData) {
        var ques_index = layer.open({

            type: 2,
            title: ['添加新题型', 'font-size:normal', 'font-style:normal'],
            shadeClose: false,
            shade: 0.2,
            area: ['600px', '400px'],
            //maxmin: true,
            shift: 5,
            moveType: 1,
            fix: true,
            closeBtn: 1,
            content: ['/zujuan/AddQuestionType', 'no'],
            end: function () {


                myLoadZJZXFun();

            }
        });
        localStorage.new_question_type = ques_index;
    } else {
        v_jsLayer.tipForTime("你的试题篮是空的，去智能选题加入试卷吧！", 1000);
    }
}

//加载试卷中心
function getTestCenterGjw(data) {

    // alert('返回加载试卷中心 ' + returnVal + " " + questionInfo + " " + paperInfo);
    if (data.result == 0) {
        if(data.data&&data.data.data){
            questionData = data.data.data;
            paperData = data.data;
        }
        // UpdateTestCenterInfoGjw(data.data.data); //
        if (GetQueryString("type") == 1) {
            //试题栏可修改试卷时，执行方法
            UpdateTestCenterInfoGjw(questionData); //
        } else if (GetQueryString("type") == 2) {
            // window.location.href = "myPaperList.html";

            // UpdateTestCenterInfoGjw(questionData); //
            //不可修改纸卷执行方法
            UpdateTestCenterInfoGjwExam(questionData); //

            // UpdateTestCenterInfoGjw(questionData); //
        }

        $("#pui_score").html(GetScoreTable()); //加载试卷誉分栏
        //UpdateQuestionBasketInfo(questionTypeData, questionDifficult);
        if (paperData != null) {
            if (paperData.caption != null) {
                $("#pui_maintitle").html("试卷标题：" + paperData.caption);
            } else {
                $("#pui_maintitle").html("试卷标题：" + dataNullInfo);
            }
            if (paperData.scope == null) {
                paperData.scope = dataNullInfo
            }
            if (paperData.timeLen == null) {
                paperData.timeLen = dataNullInfo
            }
            if (paperData.person == null) {
                paperData.person = dataNullInfo
            }

            $("#pui_testinfo").html("考试范围：" + paperData.scope + "；考试时间：" + paperData.timeLen +"分钟" + "；命题人：" + paperData.person + "；满分：<span id=\"pui_testinfo_score\">0</span>分");
            setQuestionPaperScore(); //得到试卷总分 赋值给 pui_testinfo_score
            setPaperShow( paperData.titleBar, paperData.infoBar, paperData.inputBar, paperData.tongfenBar, paperData.pingfenBar );
        }
        v_jsLayer.dropJSLayer(); //关闭
    } else {
        $("#pui_body").empty();
        $("#pui_score").empty();
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

function setPaperShow(titleBar, paperInfo, inputbar, tongfenBar, pingfenBar) {
    if (titleBar == 0) {
        $("#pui_title").addClass("pui_maintitle_unbind");
    } else if (titleBar == 1) {
        $("#pui_title").removeClass("pui_maintitle_unbind");
    }
    if (paperInfo == 0) {
        $("#pui_testinfo").addClass("pui_maintitle_unbind");
    } else if (paperInfo == 1) {
        $("#pui_testinfo").removeClass("pui_maintitle_unbind");
    }
    if (inputbar == 0) {
        $("#pui_inputInfo").addClass("pui_maintitle_unbind");
    } else if (inputbar == 1) {
        $("#pui_inputInfo").removeClass("pui_maintitle_unbind");
    }
    if (tongfenBar == 0) {
        $("#pui_score").addClass("pui_maintitle_unbind");
    } else if (tongfenBar == 1) {
        $("#pui_score").removeClass("pui_maintitle_unbind");
    }
    if (pingfenBar == 0) {
        $("div.questypescore").addClass("pui_maintitle_unbind");
    } else if (pingfenBar == 1) {
        $("div.questypescore").removeClass("pui_maintitle_unbind");
    }
}

function getTestCenter(returnVal, questionInfo, paperInfo) {

    // alert('返回加载试卷中心 ' + returnVal + " " + questionInfo + " " + paperInfo);
    if (returnVal == "成功") {
        questionData = questionInfo;
        paperData = paperInfo;
        //alert(paperData.TEST_PAPER_ID + "#" + paperData.TEST_PAPER_TITLE);
        if (GetQueryString("type") == 1) {
            UpdateTestCenterInfoGjw(questionInfo); //
        } else if (GetQueryString("type") == 2) {
            UpdateTestCenterInfoGjwExam(questionInfo); //
        }


        $("#pui_score").html(GetScoreTable()); //加载试卷誉分栏
        //UpdateQuestionBasketInfo(questionTypeData, questionDifficult);
        if (paperData != null && paperData.TEST_PAPER_ID != 0) {
            if (paperData.caption != null) {
                $("#pui_maintitle").html("试卷标题：" + paperData.caption);
            } else {
                $("#pui_maintitle").html("试卷标题：" + dataNullInfo);
            }
            if (paperData.scope == null) {
                paperData.scope = dataNullInfo
            }
            if (paperData.timeLen == null) {
                paperData.timeLen = dataNullInfo
            }
            if (paperData.person == null) {
                paperData.person = dataNullInfo
            }
            $("#pui_testinfo").html("考试范围：" + paperData.scope + "；考试时间：" + paperData.timeLen + "；命题人：" + paperData.person + "；满分：<span id=\"pui_testinfo_score\">0</span>分");
            // $("#pui_maintitle").html("试卷标题：" + paperData.caption);
            // $("#pui_testinfo").html("考试范围：" + paperData.scope + "；考试时间：" + paperData.timeLen + "；命题人：" + paperData.person + "；满分：<span id=\"pui_testinfo_score\">0</span>分");
            setQuestionPaperScore(); //得到试卷总分 赋值给 pui_testinfo_score
        }
        v_jsLayer.dropJSLayer(); //关闭
    }
    else {
        $("#pui_body").empty();
        $("#pui_score").empty();
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

//编辑试题
function editeResult(tid, type) {
    var content;
    _setPapperChanged(true);
    var zujuan_edite = layer.open({
        type: 2,
        title: ['编辑试题内容', 'font-size:normal', 'font-style:normal'],
        shadeClose: false,
        shade: 0.2,
        area: ['1004px', '650px'],
        //maxmin: true,
        shift: 5,
        moveType: 1,
        fix: true,
        closeBtn: 1,
        content: ['/MyPaperStructs/intoUe?examId=' + tid + '&type=' + type + "&paperId=" + myPaperId, 'no'],
        // content: ['/saomiao/zuJuanQuestionEdite?tid=' + tid, 'no'],
        // end: function () {
        //
        //     $.ajax({
        //         // url: "/Saomiao/GetQuestionData",
        //         // type: "post",
        //         url: "/MyPaperStructs/getExamUe?examId=" + tid,
        //         type: "get",
        //         async: false,
        //         data: {examId: tid},
        //         success: function (data) {
        //             console.log(data);
        //             document.getElementById('content' + tid).innerHTML = data.data.tigan;
        //         }
        //     });
        // }
    });
    localStorage.zujuan_edite = zujuan_edite;
}

//添加试题
function addQuestion(tixing, tihao) {
    _setPapperChanged(true);
    var content;

    localStorage.tixing = tixing;
    localStorage.tihao = tihao;
    var layerwidow = layer.open({

        type: 2,
        title: ['添加试题', 'font-size:normal', 'font-style:normal'],
        shadeClose: false,
        shade: 0.2,
        area: ['1004px', '550px'],
        //maxmin: true,
        shift: 5,
        moveType: 1,
        fix: true,
        closeBtn: 1,
        content: ['/MyPaperStructs/intoUe?examRegion=' + tihao + "&paperId=" + myPaperId, 'no'],
        end: function () {
            location.reload();
            // var zujuan_question_add = layer.open({
            //     type: 2,
            //     title: ['添加试题', 'font-size:normal', 'font-style:normal'],
            //     shadeClose: false,
            //     shade: 0.2,
            //     area: ['1004px', '550px'],
            //     //maxmin: true,
            //     shift: 5,
            //     moveType: 1,
            //     fix: true,
            //     closeBtn: 1,
            //     content: ['/saomiao/ZuJuanQuestionAdd', 'no'],
            //     end: function () {
            //         myLoadZJZXFun();
            //
            //
            //     }
            //
            // })

            // localStorage.zujuan_question_add = zujuan_question_add;
        }
    });
    localStorage.layerwidow = layerwidow;
}

//添加完新题型后给该题型添加试题 --题型栏
function addQuestionForNewType(tixing) {
    _setPapperChanged(true);
    var quesByNewType = layer.open({
        type: 2,
        title: ['当前题型：' + tixing, 'font-size:normal', 'font-style:normal'],
        shadeClose: false,
        shade: 0.2,
        area: ['1004px', '550px'],
        //maxmin: true,
        shift: 5,
        moveType: 1,
        fix: true,
        closeBtn: 1,
        content: ['/zujuan/ZuJuanQuestionAddForNewType?tixing=' + tixing, 'no'],
        end: function () {
            myLoadZJZXFun();
        }
    })
    localStorage.quesByNewType = quesByNewType;
}

//重置
function set(kindName, i, op) {
    _setPapperChanged(true);
    var tixingAttr = layer.open({
        type: 2,
        title: ['重置题型', 'font-size:normal', 'font-style:normal'],
        shadeClose: false,
        shade: 0.2,
        area: ['800px', '500px'],
        //maxmin: true,
        shift: 5,
        moveType: 1,
        fix: true,
        closeBtn: 1,
        // content: ['/zujuan/setTiXingAttr?tixing=' + tixing, 'no'],
        content: ['/MyPaperStructs/intoUeKindName?position=' + i + "&kindName=" + kindName + "&paperId=" + myPaperId + "&op=" + op, 'no'],
        end: function () {

            myLoadZJZXFun();

        }
    });
    localStorage.tixingAttr = tixingAttr;
}

function setGjw(tixing) {

}

//加载试卷中心页面数据
function UpdateTestCenterInfoGjw(testData) {
    var questionNumber = 0;
    var paperScoreCount = 0;
    var html = [];
    html.push("<div class=\"paperpart\" id=\"paperpart1\">");

    html.push("<div class=\"partbody\" style=\"min-height:450px;\">");
    $.each(testData, function (i, value) {

        var quesTypeScoreCount = 0;

        html.push("<div class=\"questype\" id=\"questype1_" + (i + 1) + "\">");
        html.push("<div id=\"questypehead2_" + (i + 1) + "\" class=\"questypehead\">");
        html.push("<div class=\"questypemenu\">");
        //html.push("<a class=\"empty\">清空</a>");

        html.push("<a onclick='set(null,\"" + i + "\",-1)'>添加题型</a>");
        html.push("<a onclick='set(\"" + value.kindName + "\",\"" + i + "\",1)'>重置题型</a>");
        // html.push("<a  onclick='addQuestionForNewType(\"" + i + "\")'>添加试题</a>");
        html.push("<a  onclick='addQuestion(\"" + value.kindName + "\",\"" + i + "\")'>添加试题</a>");
        html.push("<a class=\"del\" >删除</a>");
        html.push("<a class=\"moveup\">上移</a><a class=\"movedn\">下移</a>");
        //html.push("<a class=\"edit\">设置</a>");
        html.push("</div>");
        html.push("<div id=\"questypeheadbox2_" + (i + 1) + "\" class=\"questypeheadbox\">");
        html.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">");
        html.push("<tr>");
        html.push("<td width=\"1\">");
        html.push("<div style=\"width: 120px;\" class=\"questypescore\">");
        html.push("<table title=\"评分栏\" border=\"1\" cellpadding=\"0\" cellspacing=\"0\" bordercolor=\"#666666\" style=\"border:1px solid #666;\">");
        html.push("<tr>");
        html.push("<td width=\"55\" height=\"20\" align=\"center\">&nbsp;评卷人&nbsp;</td>");
        html.push("<td width=\"55\" align=\"center\">&nbsp;得&nbsp;&nbsp;分&nbsp;</td>");
        html.push("</tr>");
        html.push("<tr>");
        html.push("<td height=\"30\" align=\"center\">&nbsp;</td>");
        html.push("<td>&nbsp;</td>");
        html.push("</tr>");
        html.push("</table>");
        html.push("</div>");
        html.push("</td>");
        html.push("<td><div class=\"questypetitle\"><span class=\"questypeindex\"><b>" + NumConvert(i + 1) + "、</b></span>");
        html.push("<span id=\"questypename2_" + (i + 1) + "\" class=\"questypename\">" + value.kindName + "</span>"); //（" + value.试题数量 + "题）
        html.push("(");
        html.push("<span> " + value.remark == null || value.remark == undefined || value.remark == '' ? '' : value.remark + " </span>,");
        html.push("共<span id=\"questypenote2_" + (i + 1) + "\" class=\"questypenote\">0</span>分）");

        html.push("</div></td>");
        html.push("</tr>");
        html.push("</table>");
        html.push("</div>");
        html.push("</div>");

        html.push("<div class=\"questypebody\" id=\"questypebody_" + (i + 1) + " \">");
        $.each(value.examList, function (j, data) {
            questionNumber += 1;
            // isZhnetST=\"" + data.是否志鸿题 + "\" isPicQues=\"" + data.是否图片试题 + "\"
            html.push("<div id=\"quesbox" + data.id + "\"  class=\"quesbox\">"); // isPicQues=\"" + data.是否图片试题 + "\"
            html.push("<div style=\"display: none;\" class=\"quesopmenu\">");
            //html.push("<a class=\"detail\">详细</a><a class=\"replace\">替换</a>");
            html.push("<a  onclick='addQuestion(\"" + value.kindName + "\",\"" + i + "\")'>添加试题</a>");
            html.push("<a  onclick='editeResult(\"" + data.id + "\",\"" + basketType + "\")'>编辑</a>");
            html.push("<a class=\"del\">删除</a>");
            html.push("<a style=\"opacity: 0.5;\" class=\"moveup\" title=\"向上移动试题。&#13;&#10;\">上移</a>");
            html.push("<a style=\"opacity: 1;\" class=\"movedn\" title=\"向下移动试题。&#13;&#10;\">下移</a>");
            //html.push("<a class=\"detail\" >编辑</a>");
            html.push("<a class=\"detail\">设置</a>");
            html.push("<a class=\"replace\">详细</a>");
            html.push("</div>");
            html.push("<div id=\"quesdiv" + data.id + "\" class=\"quesdiv\">");
            html.push("<div><span class=\"quesindex\"><b>" + questionNumber + "．</b><span>（" + data.score + "分）</span></span>");
            //html.push(data.Tid1 + " | " + data.命题内容);
            html.push("<div id=\"content" + data.id + "\">" + data.tigan + "</div>");
            html.push("</div>");
            html.push("</div>");
            html.push("</div>");
            quesTypeScoreCount += data.score;
        });

        html.push("</div>");
        html.push("</div>");

        paperScoreCount += quesTypeScoreCount;
    });
    html.push("</div>");
    html.push("</div>");

    $("#pui_body").empty().html(html.join(""));

    //计算试卷的分数
    //var paperScoreCount = setQuestionPaperScore();
    $("#pui_testinfo_score").text(paperScoreCount);
    //绑定题型的分数
    setQuestionTypeScore();
}

function UpdateTestCenterInfoGjwExam(testData) {
    var questionNumber = 0;
    var paperScoreCount = 0;
    var html = [];
    html.push("<div class=\"paperpart\" id=\"paperpart1\">");

    html.push("<div class=\"partbody\" style=\"min-height:450px;\">");
    $.each(testData, function (i, value) {

        var quesTypeScoreCount = 0;

        html.push("<div class=\"questype\" id=\"questype1_" + (i + 1) + "\">");
        html.push("<div id=\"questypehead2_" + (i + 1) + "\" class=\"questypehead\">");

        //题型编辑框  编辑功能html
        html.push("<div class=\"questypemenu\">");
        html.push("<a onclick='set(null,\"" + i + "\",-1)'>添加题型</a>");
        html.push("<a onclick='set(\"" + value.kindName + "\",\"" + i + "\",1)'>重置题型</a>");
        html.push("<a onclick='addQuestion(\"" + value.kindName + "\",\"" + i + "\")'>添加试题</a>");
        html.push("<a class=\"del\" >删除</a>");
        html.push("<a class=\"moveup\">上移</a><a class=\"movedn\">下移</a>");
        html.push("</div>");
        //题型编辑框  编辑功能html

        html.push("<div id=\"questypeheadbox2_" + (i + 1) + "\" class=\"questypeheadbox\">");
        html.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">");
        html.push("<tr>");
        html.push("<td width=\"1\">");
        html.push("<div style=\"width: 120px;\" class=\"questypescore\">");
        html.push("<table title=\"评分栏\" border=\"1\" cellpadding=\"0\" cellspacing=\"0\" bordercolor=\"#666666\" style=\"border:1px solid #666;\">");
        html.push("<tr>");
        html.push("<td width=\"55\" height=\"20\" align=\"center\">&nbsp;评卷人&nbsp;</td>");
        html.push("<td width=\"55\" align=\"center\">&nbsp;得&nbsp;&nbsp;分&nbsp;</td>");
        html.push("</tr>");
        html.push("<tr>");
        html.push("<td height=\"30\" align=\"center\">&nbsp;</td>");
        html.push("<td>&nbsp;</td>");
        html.push("</tr>");
        html.push("</table>");
        html.push("</div>");
        html.push("</td>");
        html.push("<td><div class=\"questypetitle\"><span class=\"questypeindex\"><b>" + NumConvert(i + 1) + "、</b></span>");
        html.push("<span id=\"questypename2_" + (i + 1) + "\" class=\"questypename\">" + value.kindName + "</span>"); //（" + value.试题数量 + "题）
        html.push("(");
        html.push("<span> " + value.remark == null || value.remark == undefined || value.remark == '' ? '' : value.remark + " </span>,");
        html.push("共<span id=\"questypenote2_" + (i + 1) + "\" class=\"questypenote\">0</span>分）");

        html.push("</div></td>");
        html.push("</tr>");
        html.push("</table>");
        html.push("</div>");
        html.push("</div>");

        html.push("<div class=\"questypebody\" id=\"questypebody_" + (i + 1) + " \">");
        $.each(value.examList, function (j, data) {
            questionNumber += 1;
            // isZhnetST=\"" + data.是否志鸿题 + "\" isPicQues=\"" + data.是否图片试题 + "\"
            html.push("<div id=\"quesbox" + data.id + "\"  class=\"quesbox\">"); // isPicQues=\"" + data.是否图片试题 + "\"

            //编辑功能  html
            html.push("<div style=\"display: none;\" class=\"quesopmenu\">");
            html.push("<a  onclick='addQuestion(\"" + value.kindName + "\",\"" + i + "\")'>添加试题</a>");
            html.push("<a  onclick='editeResult(\"" + data.id + "\",\"" + paperType + "\")'>编辑</a>");
            html.push("<a class=\"del\">删除</a>");
            html.push("<a style=\"opacity: 0.5;\" class=\"moveup\" title=\"向上移动试题。&#13;&#10;\">上移</a>");
            html.push("<a style=\"opacity: 1;\" class=\"movedn\" title=\"向下移动试题。&#13;&#10;\">下移</a>");
            //html.push("<a class=\"detail\" >编辑</a>");
            html.push("<a class=\"detail\">设置</a>");
            html.push("<a class=\"replace\">详细</a>");
            html.push("</div>");
            //编辑功能  html

            html.push("<div id=\"quesdiv" + data.id + "\" class=\"quesdiv\">");
            html.push("<div><span class=\"quesindex\"><b>" + questionNumber + "．</b><span>（" + data.score + "分）</span></span>");
            //html.push(data.Tid1 + " | " + data.命题内容);
            html.push("<div id=\"content" + data.id + "\">" + data.tigan + "</div>");
            html.push("</div>");
            html.push("</div>");
            html.push("</div>");
            quesTypeScoreCount += data.score;
        });

        html.push("</div>");
        html.push("</div>");
        paperScoreCount += quesTypeScoreCount;
    });
    html.push("</div>");
    html.push("</div>");

    $("#pui_body").empty().html(html.join(""));

    //计算试卷的分数
    //var paperScoreCount = setQuestionPaperScore();
    $("#pui_testinfo_score").text(paperScoreCount);
    //绑定题型的分数
    setQuestionTypeScore();
}

function UpdateTestCenterInfo(testData) {

    //alert(testData[0].题型 + " " + testData[0].试题数量 + " " + testData[1]);
    // console.log(testData[0] + '11111' + testData[1] + '11111'+testData[2]);
    var questionNumber = 0;
    var paperScoreCount = 0;
    var html = [];
    html.push("<div class=\"paperpart\" id=\"paperpart1\">");

    html.push("<div class=\"partbody\" style=\"min-height:450px;\">");
    $.each(testData, function (i, value) {

        var quesTypeScoreCount = 0;

        html.push("<div class=\"questype\" id=\"questype1_" + (i + 1) + "\">");
        html.push("<div id=\"questypehead2_" + (i + 1) + "\" class=\"questypehead\">");
        html.push("<div class=\"questypemenu\">");
        //html.push("<a class=\"empty\">清空</a>");

        html.push("<a onclick='set(\"" + i + "\")'>重置题型</a>");
        html.push("<a  onclick='addQuestion(\"" + value.题型 + "\",\"" + i + "\")'>添加试题</a>");
        // html.push("<a  onclick='addQuestionForNewType(\"" + i + "\")'>添加试题</a>");
        // html.push("<a  onclick='addQuestionForNewType(\"" + value.题型 + "\")'>添加试题</a>");
        html.push("<a class=\"del\">删除</a>");
        html.push("<a class=\"moveup\">上移</a><a class=\"movedn\">下移</a>");
        //html.push("<a class=\"edit\">设置</a>");
        html.push("</div>");
        html.push("<div id=\"questypeheadbox2_" + (i + 1) + "\" class=\"questypeheadbox\">");
        html.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"100%\">");
        html.push("<tr>");
        html.push("<td width=\"1\">");
        html.push("<div style=\"width: 120px;\" class=\"questypescore\">");
        html.push("<table title=\"评分栏\" border=\"1\" cellpadding=\"0\" cellspacing=\"0\" bordercolor=\"#666666\" style=\"border:1px solid #666;\">");
        html.push("<tr>");
        html.push("<td width=\"55\" height=\"20\" align=\"center\">&nbsp;评卷人&nbsp;</td>");
        html.push("<td width=\"55\" align=\"center\">&nbsp;得&nbsp;&nbsp;分&nbsp;</td>");
        html.push("</tr>");
        html.push("<tr>");
        html.push("<td height=\"30\" align=\"center\">&nbsp;</td>");
        html.push("<td>&nbsp;</td>");
        html.push("</tr>");
        html.push("</table>");
        html.push("</div>");
        html.push("</td>");
        html.push("<td><div class=\"questypetitle\"><span class=\"questypeindex\"><b>" + NumConvert(i + 1) + "、</b></span>");
        html.push("<span id=\"questypename2_" + (i + 1) + "\" class=\"questypename\">" + value.题型 + "</span>"); //（" + value.试题数量 + "题）
        html.push("(");
        html.push("<span> " + value.remark == null || value.remark == undefined || value.remark == '' ? '' : value.remark + " </span>,");
        html.push("共<span id=\"questypenote2_" + (i + 1) + "\" class=\"questypenote\">0</span>分）");


        html.push("</div></td>");
        html.push("</tr>");
        html.push("</table>");
        html.push("</div>");
        html.push("</div>");

        html.push("<div class=\"questypebody\" id=\"questypebody_" + (i + 1) + " \">");
        $.each(value.Question, function (j, data) {
            questionNumber += 1;
            html.push("<div id=\"quesbox" + data.Tid1 + "\" isZhnetST=\"" + data.是否志鸿题 + "\" isPicQues=\"" + data.是否图片试题 + "\" class=\"quesbox\">"); // isPicQues=\"" + data.是否图片试题 + "\"
            html.push("<div style=\"display: none;\" class=\"quesopmenu\">");
            //html.push("<a class=\"detail\">详细</a><a class=\"replace\">替换</a>");
            html.push("<a  onclick='addQuestion(\"" + value.题型 + "\",\"" + i + "\")'>添加试题</a>");
            html.push("<a  onclick='editeResult(\"" + data.Tid1 + "\")'>编辑</a>");
            html.push("<a class=\"del\">删除</a>");
            html.push("<a style=\"opacity: 0.5;\" class=\"moveup\" title=\"向上移动试题。&#13;&#10;\">上移</a>");
            html.push("<a style=\"opacity: 1;\" class=\"movedn\" title=\"向下移动试题。&#13;&#10;\">下移</a>");
            //html.push("<a class=\"detail\" >编辑</a>");
            html.push("<a class=\"detail\">设置</a>");
            html.push("<a class=\"replace\">详细</a>");
            html.push("</div>");
            html.push("<div id=\"quesdiv" + data.Tid1 + "\" class=\"quesdiv\">");
            html.push("<div><span class=\"quesindex\"><b>" + questionNumber + "．</b><span>（" + data.分值 + "分）</span></span>");
            //html.push(data.Tid1 + " | " + data.命题内容);
            html.push("<div id=\"content" + data.Tid1 + "\">" + data.命题内容 + "</div>");
            html.push("</div>");
            html.push("</div>");
            html.push("</div>");
            quesTypeScoreCount += data.分值;
        });

        html.push("</div>");
        html.push("</div>");

        paperScoreCount += quesTypeScoreCount;
    });
    html.push("</div>");
    html.push("</div>");

    $("#pui_body").empty().html(html.join(""));

    //计算试卷的分数
    //var paperScoreCount = setQuestionPaperScore();
    $("#pui_testinfo_score").text(paperScoreCount);
    //绑定题型的分数
    setQuestionTypeScore();
}

//接收  修改试卷信息后的 返回值
function returnSetPaperInfoClient(returnValue, returnData) {
    //alert(typeof (returnData));
    //alert(returnValue + " " + returnData);
    //    $("#OpenWindow-header").html(returnValue);
    //$("#lean_overlay,#OpenWindow").hide();//这个效果太生硬 
    //这个是淡入淡出的关闭层
    $(".modal_close").trigger("click");
    if (returnValue == "成功") {
        if (flagSave == true) {
            //输入试卷信息后直接调用完成按钮的事件方法
            $("#wanc").trigger("click");
        }
        else {
            paperData = returnData; //更新试卷信息
            if (paperData != null) {
                if (paperData.caption != null) {
                    $("#pui_maintitle").html("试卷标题：" + paperData.caption);
                } else {
                    $("#pui_maintitle").html("试卷标题：" + dataNullInfo);
                }
                if (paperData.scope == null) {
                    paperData.scope = dataNullInfo
                }
                if (paperData.timeLen == null) {
                    paperData.timeLen = dataNullInfo
                }
                if (paperData.person == null) {
                    paperData.person = dataNullInfo
                }
                $("#pui_testinfo").html("考试范围：" + paperData.scope + "；考试时间：" + paperData.timeLen + "；命题人：" + paperData.person + "；满分：<span id=\"pui_testinfo_score\">0</span>分");
                // $("#pui_maintitle").html("试卷标题：" + paperData.caption);
                // $("#pui_testinfo").html("考试范围：" + paperData.scope + "；考试时间：" + paperData.timeLen + "；命题人：" + paperData.person + "；满分：<span id=\"pui_testinfo_score\">0</span>分");
                setQuestionPaperScore(); //得到试卷总分 赋值给 pui_testinfo_score
            }
        }
    }
    else {
        v_jsLayer.tipForTime(returnValue, 1000);
    }
}

//得到试卷誉分栏
function GetScoreTable() {
    var questypeLen = questionData.length;
    if (questypeLen > 0) {
        var html = [];
        html.push("<table align='center' border='1' cellpadding='0' cellspacing='0' id='pui_scoretable' title='得分栏'>");
        html.push("<tr><td>题号</td>");
        for (var i = 0; i < questypeLen; i++) {
            html.push("<td>" + NumConvert(i + 1) + "</td>");
        }
        ;
        html.push("<td>总分</td></tr><tr><td>得分</td>");
        for (var i = 0; i < questypeLen; i++) {
            html.push("<td>&nbsp;</td>");
        }
        ;
        html.push("<td>&nbsp;</td></tr></table>");
        return html.join("");
    } else {
        return "";
    }
}

//更新试卷誉分栏
function UpdateScoreTable() {
    var quesTypeIndexS = $("span.questypeindex");
    if (quesTypeIndexS != null) {
        var questypeLen = quesTypeIndexS.length;
        if (questypeLen > 0) {
            var html = [];
            html.push("<table align='center' border='1' cellpadding='0' cellspacing='0' id='pui_scoretable' title='得分栏'>");
            html.push("<tr><td>题号</td>");
            for (var i = 0; i < questypeLen; i++) {
                html.push("<td>" + NumConvert(i + 1) + "</td>");
            }
            ;
            html.push("<td>总分</td></tr><tr><td>得分</td>");
            for (var i = 0; i < questypeLen; i++) {
                html.push("<td>&nbsp;</td>");
            }
            ;
            html.push("<td>&nbsp;</td></tr></table>");
            return html.join("");
        } else {
            return "";
        }
    }
}

function getPaperInfoStr() {
    var str = "";
    //var partbodyHtml = $("div.partbody"); //找到题型外框
    var quesTypeNameHtml = $("div.partbody").find("span.questypename"); //找到每个题型
    //alert(quesTypeNameHtml.length);
    for (var i = 0; i < quesTypeNameHtml.length; i++) {
        var questionTypeName = quesTypeNameHtml.eq(i).text();
        str += questionTypeName + "***";
        //var questypebodyHtml = partbodyHtml.find("div.questypebody"); //找到试题外框
        var questionBoxHtml = $("div.partbody").find("div.questypebody").eq(i).find("div.quesbox"); //找到每个试题
        for (var j = 0; j < questionBoxHtml.length; j++) {
            var itemTid = questionBoxHtml.eq(j).attr("id").replace("quesbox", "");
            var isZhnetST = questionBoxHtml.eq(j).attr("isZhnetST");
            var isPicQues = questionBoxHtml.eq(j).attr("isPicQues");
            str += itemTid + "&&&" + isZhnetST + "%%%" + isPicQues + "###";
        }
        str += "|||";
    }
    return str;
}

var isBas = false;

/* 一次性的绑定事件 */
function PaperEvents() {
    //点击完成试卷
    $("#wanc").click(function () {
        _setPapperChanged(false);
        // _setPapperChanged(true);
        if (questionData == null) {
            v_jsLayer.tipForTime("你的试卷篮是空的，去选题加入试卷吧！", 1000);
        } else {
            //alert('a');
            if ($("div.quesbox").length == 0) {
                v_jsLayer.tipForTime("你的试卷篮是空的，去选题加入试卷吧！", 1000);
            } else if (paperData == null) {//if (paperData.TEST_PAPER_ID == 0) {
                flagSave = true; //告诉程序 点击了完成按钮  输入试卷信息后直接跳至我的试卷列表
                $("#aOpen").trigger("click");
                var examScore = $("#pui_testinfo_score").text();
                $("#examScore").val(examScore);
            } else {
                // var paperTitle = $("#paperName").val();
                // var paperRange = $("#paperRange").val();
                // var examTime = $("#examTime").val();
                // var examIners = $("#examIners").val();
                if (paperData.caption != dataNullInfo) {
                    var paperTitle = paperData.caption
                }
                if (paperData.scope != dataNullInfo) {
                    var paperRange = paperData.scope
                }
                if (paperData.timeLen != dataNullInfo) {
                    var examTime = paperData.timeLen
                }
                if (paperData.person != dataNullInfo) {
                    var examIners = paperData.person
                }

                if ((null != paperTitle && "" != paperTitle) && (null != paperRange && "" != paperRange) &&
                    (null != examTime && "" != examTime) && (null != examIners && "" != examIners)) {
                    isBas = true;
                    $("#aOpen").trigger("click");
                } else {
                    $("#aOpen_nomsg").trigger("click");
                }
            }
        }
    });

    $("#nomsg_click").on("click", function myfunction() {
        $(".modal_close").trigger("click");
    });

    //点击卷头设置的事件
    $("#pui_maintitle,#pui_testinfo").click(function () {
        if (paperData != null) {
            if (paperData.id != 0) {
                // $("#paperName").val(paperData.TEST_PAPER_TITLE);
                // $("#paperRange").val(paperData.TEST_PAPER_RANGE);
                // $("#examTime").val(paperData.TEST_PAPER_EXAMTIME);
                // $("#examIners").val(paperData.TEST_PAPER_EXAMINERS);
                $("#examScore").val($("#pui_testinfo_score").text());
                if (paperData.caption != dataNullInfo) {
                    $("#paperName").val(paperData.caption)
                }
                if (paperData.scope != dataNullInfo) {
                    $("#paperRange").val(paperData.scope)
                }
                if (paperData.timeLen != dataNullInfo) {
                    $("#examTime").val(paperData.timeLen)
                }
                if (paperData.person != dataNullInfo) {
                    $("#examIners").val(paperData.person)
                }
            }
        }
        if (questionData == null) {
            v_jsLayer.tipForTime("你的试卷篮是空的，去选题加入试卷吧！", 1000);
        }
        else if ($("div.quesbox").length == 0) {
            v_jsLayer.tipForTime("你的试卷篮是空的，去选题加入试卷吧！", 1000);
        }
        else {
            if (flagSave == true) {

            }
            else {
                flagSave = false; //告诉程序  点击的是设置标题  不是完成按钮  输入试卷信息后直接跳至我的试卷列表
            }
            $("#aOpenInfo").trigger("click");
        }
        //设置输入栏初始值
        $("#examScore").val($("#pui_testinfo_score").text());
        if (paperData.caption != dataNullInfo) {
            $("#paperName").val(paperData.caption)
        }
        if (paperData.scope != dataNullInfo) {
            $("#paperRange").val(paperData.scope)
        }
        if (paperData.timeLen != dataNullInfo) {
            $("#examTime").val(paperData.timeLen)
        }
        if (paperData.person != dataNullInfo) {
            $("#examIners").val(paperData.person)
        }
    });
    //点击设置试卷信息
    $("#submitPaperInfo").click(function () {
        var paperName = $("#paperName").val();
        var paperRange = $("#paperRange").val();
        var examTime = $("#examTime").val();
        var examIners = $("#examIners").val();
        if (paperName && paperRange && examTime && examIners) {
            var paperId = paperData.id;
            $.ajax({
                type: "post",
                url: "/MyPaperStructs/changeMyPaperInfo",
                data: {
                    paperTitle: paperName,
                    paperRange: paperRange,
                    examTime: examTime,
                    examIners: examIners,
                    paperId: paperData.id
                },
                async: false,
                success: function (data) {
                    if (data.result == 0) {
                        if (paperData.caption != null) {
                            $("#pui_maintitle").html("试卷标题：" + paperData.caption);
                        } else {
                            $("#pui_maintitle").html("试卷标题：" + dataNullInfo);
                        }
                        if (paperData.scope == null) {
                            paperData.scope = dataNullInfo
                        }
                        if (paperData.timeLen == null) {
                            paperData.timeLen = dataNullInfo
                        }
                        if (paperData.person == null) {
                            paperData.person = dataNullInfo
                        }
                        $("#pui_maintitle").html("试卷标题：" + paperName);
                        $("#pui_testinfo").html("考试范围：" + paperRange + "；考试时间：" + examTime + "；命题人：" + examIners + "；满分：<span id=\"pui_testinfo_score\">0</span>分");

                        // $("#pui_maintitle").html("试卷标题：" + paperName);
                        // $("#pui_testinfo").html("考试范围：" + paperRange + "；考试时间：" + examTime + "；命题人：" + examIners + "；满分：<span id=\"pui_testinfo_score\">0</span>分");
                        setQuestionPaperScore(); //得到试卷总分 赋值给 pui_testinfo_score
                        $(".modal_close").trigger("click");
                        loadTestCenterPaper();
                    } else {
                        v_jsLayer.tipForTime(data.reason, 1000);
                    }
                    if (data == "失败") {
                        v_jsLayer.tipForTime(data, 1000);
                    }
                    else if (data == "字符太多") {
                        v_jsLayer.tipForTime("每项输入框最多只能输入40个字", 1000);
                    }
                    else {
                        // var jData = eval(data);
                        // returnSetPaperInfoClient(jData[0], JSON.parse(jData[1]));

                    }
                },
                error: function (data) {
                    v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                }
            })
        } else {
            $("#submitPaperInfoLabel").show();
        }
    });

    //点击设置试题分数按钮
    $("#submitPaperInfoScore").click(function () {

        var questionScore = $("#editorScoreValue").val();
        // alert(questionScore);
        var stId = $("#EditScoreQuestionId").val();
        // alert(stId);
        if (questionScore == null || questionScore == "" || parseFloat(questionScore) <= 0 || isNaN(questionScore)) {
            $("#setQuestionScoreValueTS").show();
            return;
        }
        questionScore = (Math.round(questionScore * 10) / 10);
        if (stId != null && stId > 0) {
            //存储试卷信息到本地
            $.ajax({
                type: "get",
                // url: "/zujuan/setQuestionBasketScore",
                url: "/MyPaperStructs/editExamScoreUe",
                data: {paperId: myPaperId, examId: stId, score: questionScore},
                async: false,
                success: function (data) {
                    if (data == "修改试题分数失败") {
                        v_jsLayer.tipForTime(data, 1000);
                    }
                    else {
                        $(".modal_close").trigger("click");
                        //更新 试题分数、题型分数、总分分数
                        $("#quesdiv" + stId).find(".quesindex span").text("（" + questionScore + "分）");
                        //更新题型分数
                        setQuestionTypeScore();
                        //更新试卷总分
                        setQuestionPaperScore();
                        // var jData = eval(data);
                        // //console.log(jData);
                        // if (parseInt(JSON.parse(jData[1])) > 0) {
                        //
                        // }
                        // else {
                        //     v_jsLayer.tipForTime("修改试题分数失败", 1000);
                        // }
                    }
                },
                error: function (data) {
                    v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                }
            });
        }
    });

    //卷头的一些事件
    $("#pui_seal").hover(function () {
        $(this).css({color: "#f00", cursor: "pointer", background: "#C1FFFF"});
        $(this).find("td.pui_sealblock").css({background: "#00CCCC"});
    }, function () {
        $(this).css({color: "#000", cursor: "pointer", background: "#ECECEC"});
        $(this).find("td.pui_sealblock").css({background: "#999"});
    });

    $("#pui_marktag,#pui_maintitle,#pui_subtitle,#pui_testinfo,#pui_studentinput").hover(function () {
        $(this).css({color: "#f00", cursor: "pointer"});
    }, function () {
        $(this).css({color: "#000", cursor: "pointer"});
    });

    $("#pui_notice").find("div").hover(function () {
        $(this).css({color: "#f00", cursor: "pointer"});
    }, function () {
        $(this).css({color: "#000", cursor: "pointer"});
    });

    //鼠标经过分卷头
    $("div.parthead").hover(function () {
        $(this).parents("div.paperpart").css({border: "1px solid #009B9B"});
        $(this).css({border: "1px solid #009B9B", background: "#DDFFFF", color: "#f00"});
        $(this).find("div.partmenu").show();
    }, function () {
        $(this).parents("div.paperpart").css({border: "1px solid #fff"});
        $(this).css({border: "1px solid #fff", background: "#ffffff", color: "#000"});
        $(this).find("div.partmenu").hide();
    });
}

//重复绑定的事件
function PaperEventAgain() {
    //当鼠标放入到试卷信息输入框，影藏红字提示
    $("#paperName,#paperRange,#examTime,#examIners").on("focus", function () {
        $("#submitPaperInfoLabel").hide();
    });
    //鼠标经过题型头
    $("div.questypehead").unbind().hover(function () {
        $(this).parents("div.questype").css({border: "1px solid #009B9B"});
        $(this).css({border: "1px solid #009B9B", background: "#DDFFFF"}); //, color: "#f00"//鼠标经过评分栏红色文字效果
        //        $(this).find("div.questypescore table").css({ border: "1px solid #FF0000" });//评分篮效果
        //        $(this).find("div.questypescore td").css({ border: "1px solid #FF0000", color: "#f00" });
        $(this).find("div.questypemenu").show();
        var partindex = $("div.paperpart").index($(this).parents("div.paperpart"));
        var canmoveup = $("div.paperpart").eq(partindex).find("div.questype").index($(this).parents("div.questype")) > 0;
        var canmovedn = $("div.paperpart").eq(partindex).find("div.questype").index($(this).parents("div.questype")) < $("div.paperpart").eq(partindex).find("div.questype").length - 1;
        var quesTypeMenu = $(this).find("div.questypemenu a");
        quesTypeMenu.eq(3).css({opacity: (canmoveup) ? 1 : 0.5});
        quesTypeMenu.eq(4).css({opacity: (canmovedn) ? 1 : 0.5});
    }, function () {
        $(this).parents("div.questype").css({border: "1px solid #ffffff"});
        $(this).css({border: "1px solid #fff", background: "#ffffff", color: "#000"});
        $(this).find("div.questypescore table").css({border: "1px solid #666666"});
        $(this).find("div.questypescore td").css({border: "1px solid #666666", color: "#666"});
        $(this).find("div.questypemenu").hide();
    });

    //题型菜单
    $("div.questypemenu a").off("click").on("click", function () {
        _setPapperChanged(true);
        switch (this.className) {
            case "del": //删除题型
                //alert($("div.questype").length);
                // if ($("div.questype").length == 0) {
                // v_jsLayer.tipForTime("最后一个题型不能删除，组卷中心至少要保留一个题型！", 1000);
                // return;
                // }
                var quesTypeIndex = $("div.questype").index($(this).parents("div.questype"));
                //alert(quesTypeIndex);
                //删除题型数据
                //alert($(this).parents("div.questypehead").find("span.questypename").html());
                var quesType = $(this).parents("div.questypehead").find("span.questypename").text();
                // deleteQuestionType(quesType); //以前用这个方法更新题型顺序 现在不需要了 汤立德20150422
                deleteQuestionType(quesTypeIndex);
                $("div.questype").eq(quesTypeIndex).unbind().empty().remove(); //仅仅移除 
                //SetQuesTypeOrder(true);
                //SetQuesOrder(true);
                setQuestionTypeAndQuestionOrder(true, 0, quesTypeIndex);
                $("#pui_score").html(UpdateScoreTable()); //更新试卷誉分栏
                setQuestionPaperScore();//更新总分数
                if ($("div.questype").length == 0) {
                    // v_jsLayer.tipForTime("最后一个题型不能删除，组卷中心至少要保留一个题型！", 1000);
                    window.location.href = "knowledge.html?username=" + getQueryString("username");
                    return;
                }
                break;
            case "moveup": //题型上移
                var quesTypeIndex = $("div.questype").index($(this).parents("div.questype"));
                var prevQuesTypeIndex = quesTypeIndex - 1;
                if (prevQuesTypeIndex < 0) {
                    return;
                } //如果此题是第一题
                $("div.questype").eq(quesTypeIndex).css({border: "1px solid #ffffff"});
                $("div.questypehead").eq(quesTypeIndex).css({
                    border: "1px solid #fff",
                    background: "#ffffff",
                    color: "#000"
                });
                $("div.questypehead").eq(quesTypeIndex).find("div.questypescore table").css({border: "1px solid #666666"});
                $("div.questypehead").eq(quesTypeIndex).find("div.questypescore td").css({border: "1px solid #666666"});
                $("div.questypehead").eq(quesTypeIndex).find("div.questypemenu").hide();
                $("div.questype").eq(quesTypeIndex).insertBefore($("div.questype").eq(prevQuesTypeIndex));
                //更新试题篮题型数据
                //先js 排序 再 排序数据
                //SetQuesTypeOrder(true);
                //SetQuesOrder(true);
                //上移 1 下移-1
                setQuestionTypeAndQuestionOrder(true, 1, quesTypeIndex);
                //更新试题篮  处理完数据后
                //alert('moveup');
                ScrollTo($("div.questype").eq(prevQuesTypeIndex));
                break;
            case "movedn":
                var quesTypeIndex = $("div.questype").index($(this).parents("div.questype"));
                var nextQuesTypeIndex = quesTypeIndex + 1;
                if (nextQuesTypeIndex >= $("div.questype").length) {
                    return;
                } //如果此题后没有试题了
                $("div.questype").eq(quesTypeIndex).css({border: "1px solid #ffffff"});
                $("div.questypehead").eq(quesTypeIndex).css({
                    border: "1px solid #fff",
                    background: "#ffffff",
                    color: "#000"
                });
                $("div.questypehead").eq(quesTypeIndex).find("div.questypescore table").css({border: "1px solid #666666"});
                $("div.questypehead").eq(quesTypeIndex).find("div.questypescore td").css({border: "1px solid #666666"});
                $("div.questypehead").eq(quesTypeIndex).find("div.questypemenu").hide();
                $("div.questype").eq(quesTypeIndex).insertAfter($("div.questype").eq(nextQuesTypeIndex));
                //先js 排序 再 排序数据
                //SetQuesTypeOrder(true);
                //SetQuesOrder(true);
                //上移 1 下移-1
                setQuestionTypeAndQuestionOrder(true, -1, quesTypeIndex);
                //更新试题篮
                //alert('movedn');
                ScrollTo($("div.questype").eq(nextQuesTypeIndex));
                break;
            //            case "edit":
            //                //模拟点击 aOpen_Score 按钮显示弹出层
            //                $("#aOpen_Score").trigger("click");
            //                //获取题型名称 题型总分数
            //                var typeName = $(this).parent().next().find(".questypename").text();
            //                //alert(typeName);
            //                var typeScore = $(this).parent().next().find(".questypenote").text();
            //                //alert(typeScore);
            //                $("#editorScoreType").text(typeName + "分数：");
            //                $("#editorScoreValue").val(typeScore);
            //                break;
        }
        ;
    });

    //鼠标经过试题
    $("div.quesbox").unbind().hover(function () {
        $(this).css({border: "1px solid #5CC6F8"});
        $(this).find("div.quesopmenu").show();
        var quesBoxs = $(this).parents("div.questypebody").find("div.quesbox");
        var canmoveup = quesBoxs.index($(this)) > 0;
        var canmovedn = quesBoxs.index($(this)) < quesBoxs.length - 1;
        var quesOPMenu = $(this).find("div.quesopmenu a");
        quesOPMenu.eq(3).css({opacity: (canmoveup) ? 1 : 0.5});
        quesOPMenu.eq(4).css({opacity: (canmovedn) ? 1 : 0.5});
    }, function () {
        $(this).css({border: "1px solid #fff"});
        $(this).find("div.quesopmenu").hide();
    });

    //点击试题菜单
    $("div.quesopmenu a").off("click").on("click", function () {// 移除时间用 .die改成.off  添加事件用 .live 改成.on
        _setPapperChanged(true);
        var quesid = $(this).parents("div.quesbox").attr("id").replace("quesbox", "");
        switch (this.className) {
            case "del":
                //if ($("div.quesbox").length <= 1) {
                //    v_jsLayer.tipForTime("最后一道试题不能删除，组卷中心至少要保留一道试题！", 1000);
                //    return;
                //}

                //var quesid = $(this).parents("div.quesbox").attr("id").replace("quesbox", "");
                //删除试题数据
                //alert(quesid);
                deleteQuestion(quesid); //以前用这个方法更新试题顺序 现在不需要了 汤立德20150422

                var stParent = $("#quesbox" + quesid).parent(); //获取此试题 div 的父级 div
                var stParentId = stParent.attr("id");
                var stPrevId = stParent.prev().parent().attr("id"); //获取此试题的 上一个同级
                //alert(stPrevId + " | " + stParent.children().length);
                //alert(stParent.html());
                if (stParent.children().length <= 1) {
                    //alert($("#quesbox" + quesid).html());
                    //alert(stPrevId + " | " + $("#" + stPrevId).html());
                    $("#" + stParentId).unbind().empty().remove(); //试题的父级
                    $("#" + stPrevId).unbind().empty().remove(); //试题的父级的上一个同级
                }
                $("#quesbox" + quesid).unbind().empty().remove(); //不仅仅移除 而且清除事件

                setQuestionTypeAndQuestionOrder(true, 0, 0); //SetQuesOrder(true); //true代表要更新试题蓝
                setQuestionTypeScore();     //更新题型分数
                setQuestionPaperScore();    //更新总分数
                break;
            case "moveup":
                var quesTypeIndex = $("div.questype").index($(this).parents("div.questype"));
                //var quesid = $(this).parents("div.quesbox").attr("id").replace("quesbox", "");
                //alert(quesTypeIndex + " " + quesid);
                var prevQuesBox = $(this).parents("div.quesbox").prev(); //获取前一个元素
                if (prevQuesBox.length == 0) {
                    return;
                }
                var prevQuesId = prevQuesBox.attr("id").replace("quesbox", "");
                $(this).parents("div.quesbox").css({border: "1px solid #fff"});
                $(this).parents("div.quesopmenu").hide();
                MoveQues(quesid, 0, prevQuesId, quesTypeIndex, 1);
                break;
            case "movedn":
                var quesTypeIndex = $("div.questype").index($(this).parents("div.questype"));
                //var quesid = $(this).parents("div.quesbox").attr("id").replace("quesbox", "");
                //alert(quesTypeIndex + " " + quesid);
                var nextQuesBox = $(this).parents("div.quesbox").next(); //获取后一个元素
                if (nextQuesBox.length == 0) {
                    return;
                }
                var nextQuesId = nextQuesBox.attr("id").replace("quesbox", "");
                $(this).parents("div.quesbox").css({border: "1px solid #fff"});
                $(this).parents("div.quesopmenu").hide();
                MoveQues(quesid, nextQuesId, 0, quesTypeIndex, -1);
                break;
            case "replace":
                var quesid = $(this).parents("div.quesbox").attr("id").replace("quesbox", "");
                var quesTypeIndex = $("div.questype").index($(this).parents("div.questype"));
                var examNum = -1
                for (var i = 0; i < paperData.data[quesTypeIndex].examList.length; i++) {
                    if (quesid == paperData.data[quesTypeIndex].examList[i].id) {
                        examNum = paperData.data[quesTypeIndex].examList[i]
                    }
                }
                setQuestionInfoToDetailGjw(examNum);
                // var isZhnet = $("#quesbox" + quesid + "").attr("isZhnetST");
                // $.ajax({
                //     type: "get",
                //     url: "/zujuan/GetQuestionDetailInfo",
                //     data: { tId: quesid, isZhnet: isZhnet },
                //     async: false,
                //     success: function (data) {
                //         if (data == "查询失败") {
                //             v_jsLayer.tipForTime(data, 1000);
                //         }
                //         else if (data == "暂无数据") {
                //             v_jsLayer.tipForTime(data, 1000);
                //         }
                //         else {
                //             var jData = eval(data);
                //             //alert(typeof (JSON.parse(jData[1])));
                //             setQuestionInfoToDetail(jData[0], JSON.parse(jData[1]));
                //         }
                //     },
                //     error: function (data) {
                //         v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                //     }
                // });
                break;
            case "detail":
                //模拟点击 aOpen_Score 按钮显示弹出层 
                $("#aOpen_Score").trigger("click");
                //获取题号 试题分数 
                var questionNum = $(this).parent().next().find(".quesindex b").text();
                //alert(questionNum); 
                var questionScore = $(this).parent().next().find(".quesindex span").text();
                //alert(questionScore); 
                var stId = $(this).parent().parent().attr("id").replace("quesbox", "");
                $("#EditScoreQuestionId").val(stId);
                $("#editorScoreType").text("第" + questionNum.replace("．", "") + "题分数：");
                $("#editorScoreValue").val(questionScore.replace("（", "").replace("分）", ""));
                break;
        }
    });
}

function setQuestionInfoToDetailGjw(question) {
    //paperData.data[quesTypeIndex].examList[i]
    if (question != -1) {
        //显示弹出层
        $("#aOpen_Detail").trigger("click");
        //打印试题信息
        var stContentHtml = "";
        stContentHtml += "<div class=\"shitk_Detail\" id='T" + question.id + "'>";
        //question.Tid1   question.题型   question.考查能力  question.难度  question.命题内容  question.客观题  question.答案  question.解析
        stContentHtml += "<h1><span class=\"t2\">" + question.kindName + "</span><span class=\"t5\">" + question.abiCap + "</span><span class=\"t3\">" + question.deep + "</span>";
        stContentHtml += "<span  class='t6'>" + question.score + "</span>";


        //stContentHtml += "<span class=\"right\">来源：" + question.资料来源 + " 更新时间：" + (new Date(question.录入时间).toLocaleDateString().replace(/年|月/g, '-')).replace(/日/g, '') + " 题号：<span>" + question.Tid1 + "</span></span>";
        //stContentHtml += "<span class=\"right\">来源：<span>" + question.TEST_SOURCE + "</span>题号：<span>" + question.TEST_TID + "</span></span>";
        stContentHtml += "<span class=\"right\">题号：<span>" + question.id + "</span></span>";
        stContentHtml += "</h1>";
        stContentHtml += "<div class=\"cls\"></div>";
        stContentHtml += "<div class=\"quesdiv\" id=\"QuestionContent" + question.id + "\">";
        stContentHtml += "<div class=\"nr\"><span style=\"color:red;\">【命题】</span>" + question.mingti + "</div>";
        stContentHtml += "<div class=\"answer\" >";

        stContentHtml += "<h1>【答案】</h1>";
        stContentHtml += "<div class=\"dadan\">" + question.answer + "</div>";

        stContentHtml += "<h1>【解析】</h1>";
        stContentHtml += "<div class=\"dadan\">" + question.jiexi + "</div>";

        stContentHtml += "</div>";
        stContentHtml += "</div>";
        $("#stContent").html(stContentHtml);
    }
    else {
        SimplePop.alert(returnValue);
    }
}

function setQuestionInfoToDetail(returnValue, question) {
    //alert(returnValue + " | " + question);
    if (returnValue == "成功") {
        //显示弹出层
        $("#aOpen_Detail").trigger("click");
        //打印试题信息
        var stContentHtml = "";
        stContentHtml += "<div class=\"shitk_Detail\" id='T" + question.TEST_TID + "'>";
        //question.Tid1   question.题型   question.考查能力  question.难度  question.命题内容  question.客观题  question.答案  question.解析
        stContentHtml += "<h1><span class=\"t2\">" + question.TEST_QUESTIONS + "</span><span class=\"t5\">" + question.TEST_ABILITY + "</span><span class=\"t3\">" + question.TEST_DIFFICULTY + "</span>";
        //教材 知识点
        //        if (true) {

        //        }
        stContentHtml += "<span class=\"t6\">" + question.TEST_SCORE + "</span>";


        //stContentHtml += "<span class=\"right\">来源：" + question.资料来源 + " 更新时间：" + (new Date(question.录入时间).toLocaleDateString().replace(/年|月/g, '-')).replace(/日/g, '') + " 题号：<span>" + question.Tid1 + "</span></span>";
        //stContentHtml += "<span class=\"right\">来源：<span>" + question.TEST_SOURCE + "</span>题号：<span>" + question.TEST_TID + "</span></span>";
        stContentHtml += "<span class=\"right\">题号：<span>" + question.TEST_TID + "</span></span>";
        stContentHtml += "</h1>";
        stContentHtml += "<div class=\"cls\"></div>";
        stContentHtml += "<div class=\"quesdiv\" id=\"QuestionContent" + question.TEST_TID + "\">";
        stContentHtml += "<div class=\"nr\"><span style=\"color:red;\">【命题】</span>" + question.TEST_QUESTION + "</div>";
        stContentHtml += "<div class=\"answer\" >";

        stContentHtml += "<h1>【答案】</h1>";
        stContentHtml += "<div class=\"dadan\">" + question.TEST_ANSWER + "</div>";

        stContentHtml += "<h1>【解析】</h1>";
        stContentHtml += "<div class=\"dadan\">" + question.TEST_ANALYTICAL + "</div>";

        stContentHtml += "</div>";
        stContentHtml += "</div>";
        $("#stContent").html(stContentHtml);
    }
    else {
        SimplePop.alert(returnValue);
    }
}

function MoveQues(QuesId, prevQuesId, nextQuesId, quesTypeIndex, moveQuesDivType) {
    QuesId = parseInt(QuesId);
    //alert(QuesId);
    prevQuesId = parseInt(prevQuesId);
    nextQuesId = parseInt(nextQuesId);
    quesTypeIndex = parseInt(quesTypeIndex);
    //ZujuanCom.Paper.MoveQues(QuesId, prevQuesId, nextQuesId, quesTypeIndex);
    // switch (moveQuesDivType) {
    //     default: case "big": //只移动右侧试题
    //         if (prevQuesId > 0) {
    //             $("#quesbox" + QuesId).insertAfter($("#quesbox" + prevQuesId));
    //         } else if (nextQuesId > 0) {
    //             $("#quesbox" + QuesId).insertBefore($("#quesbox" + nextQuesId));
    //         } else {
    //             $("#quesbox" + QuesId).appendTo($("div.questypebody").eq(quesTypeIndex));
    //         };
    //         break;
    // }
    if (prevQuesId > 0) {
        $("#quesbox" + QuesId).insertAfter($("#quesbox" + prevQuesId));
    } else if (nextQuesId > 0) {
        $("#quesbox" + QuesId).insertBefore($("#quesbox" + nextQuesId));
    } else {
        $("#quesbox" + QuesId).appendTo($("div.questypebody").eq(quesTypeIndex));
    }
    ;
    // setQuestionTypeAndQuestionOrder(true,quesTypeIndex,moveQuesDivType); //SetQuesOrder(true); //false代表不更新试题蓝*****************************************************************要更新
    setQuestionTypeAndQuestionOrderExam(true, moveQuesDivType, quesTypeIndex, QuesId);
    ScrollTo($("#quesbox" + QuesId));
}

//滚动条移动到某对象并高亮
function ScrollTo(obj, callback) {
    if (obj.css("display") == "none") {
        return;
    }
    var y = $(document).scrollTop();
    var top = 0;
    if (y > 90) {//90为页头部高度
        top = obj.offset().top + $("#pui_main").scrollTop() - y;
    } else {
        top = obj.offset().top + $("#pui_main").scrollTop() - 90;
    }
    $("#pui_main").animate({scrollTop: top + "px"}, 300, function () {
        HighEffect(obj);
    });
}

//高亮
function HighEffect(obj) {
    if (obj.length == 0 || obj.css("display") == "none") {
        return;
    }
    var oldpostion = obj.css("position");
    if (oldpostion == "static") {
        obj.css("position", "relative");
    }
    var effect = obj.find("div.effect");
    if (effect.length == 0) {
        obj.append("<div class='effect'></div>");
        effect = obj.find("div.effect");
        effect.css({
            position: "absolute", top: "0px", left: "0px",
            zIndex: 9999999, backgroundColor: "#009b9b", opacity: 0
        });
    };
    effect.stop().css({display: "", width: obj.outerWidth(), height: obj.outerHeight()});
    effect.animate({opacity: '0.6'}, 200, function () {
        effect.animate({opacity: '0'}, 500, function () {
            effect.css({display: "none"}); //.remove();
            if (oldpostion == "static") {
                obj.css({position: oldpostion});
            }
        });
    });
}

//重置题型  修改 效率问题
function setQuestionTypeAndQuestionOrder(bool, upOrDown, num) {
    _setPapperChanged(true);
    //alert('tanglide');
    //获取题型项
    var quesTypeIndexS = $("span.questypeindex b");
    for (var i = 0; i < quesTypeIndexS.length; i++) {
        var typeOrderHtml = NumConvert(i + 1) + "、";
        quesTypeIndexS.eq(i).html(typeOrderHtml);
    }
    //获取试题项
    var questypebody = $("div.questypebody");
    //alert(questypebody.length);
    //alert(questionData.length);
    var indexNum = 0;
    for (var i = 0, len = questionData.length; i < len; i++) {
        //for (var i = 0, len = questypebody.length; i < len; i++) {
        var quesIndexSpan = questypebody.eq(i).find("span.quesindex b");
        for (var j = 0; j < quesIndexSpan.length; j++) {
            indexNum++;
            var indexHtml = indexNum + "．";
            quesIndexSpan.eq(j).html(indexHtml);
            //alert(indexHtml);
        }
    }
    //如果要更新 试题篮
    if (bool.toString() == "true") {
        var str = "";
        //获取页面区域
        var paperType = $("#pui_body div.questype");
        for (var t = 0; t < paperType.length; t++) {
            var paperTypeName = paperType.eq(t).find("div.questypehead").find("span.questypename");
            str += paperTypeName.text() + "***";
            var paperTypeBody = paperType.eq(t).find("div.questypebody").find("div.quesbox");
            for (var i = 0; i < paperTypeBody.length; i++) {
                var itemTid = paperTypeBody.eq(i).attr("id").replace("quesbox", "");
                str += itemTid + "###";
            }
            str += "|||";
        }
        // alert(str + '------fk');
        //更新题型和试题顺序
        if (upOrDown != 0) {
            $.ajax({
                type: "get",
                // url: "/zujuan/UpdateQuestionTypeAndQuestionOrder",
                url: "/MyPaperStructs/moveMyPaperRegionNum",
                //     Long paperId = getParaToLong("paperId");
                // int num = getParaToInt("num");
                // int state = getParaToInt("state");//上移 1 下移-1
                //     data: { typeAndQuesStr: str },
                data: {paperId: paperData.id, num: num, state: upOrDown},
                async: false,
                success: function (data) {
                    if (data == "请加入试题到试题篮") {
                        v_jsLayer.tipForTime(data, 1000);
                    }
                    else if (data == "获取数据异常") {
                        v_jsLayer.tipForTime(data, 1000);
                    }
                    else {
                        var jData = eval(data);
                        getQuestionBasketInfo(jData[0], eval(jData[1]), jData[2]);
                    }
                },
                error: function (data) {
                    v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                }
            });
        }
    }
}

//重置试题序号  修改 效率问题
function setQuestionTypeAndQuestionOrderExam(bool, upOrDown, num, QuesId) {
    _setPapperChanged(true);
    //alert('tanglide');
    //获取题型项
    var quesTypeIndexS = $("span.questypeindex b");
    for (var i = 0; i < quesTypeIndexS.length; i++) {
        var typeOrderHtml = NumConvert(i + 1) + "、";
        quesTypeIndexS.eq(i).html(typeOrderHtml);
    }
    //获取试题项
    var questypebody = $("div.questypebody");
    //alert(questypebody.length);
    //alert(questionData.length);
    var indexNum = 0;
    for (var i = 0, len = questionData.length; i < len; i++) {
        //for (var i = 0, len = questypebody.length; i < len; i++) {
        var quesIndexSpan = questypebody.eq(i).find("span.quesindex b");
        for (var j = 0; j < quesIndexSpan.length; j++) {
            indexNum++;
            var indexHtml = indexNum + "．";
            quesIndexSpan.eq(j).html(indexHtml);
            //alert(indexHtml);
        }
    }
    //如果要更新 试题篮
    if (bool.toString() == "true") {
        var str = "";
        //获取页面区域
        var paperType = $("#pui_body div.questype");
        for (var t = 0; t < paperType.length; t++) {
            var paperTypeName = paperType.eq(t).find("div.questypehead").find("span.questypename");
            str += paperTypeName.text() + "***";
            var paperTypeBody = paperType.eq(t).find("div.questypebody").find("div.quesbox");
            for (var i = 0; i < paperTypeBody.length; i++) {
                var itemTid = paperTypeBody.eq(i).attr("id").replace("quesbox", "");
                str += itemTid + "###";
            }
            str += "|||";
        }
        // alert(str + '------fk');
        //更新题型和试题顺序
        if (upOrDown != 0) {
            $.ajax({
                type: "get",
                // url: "/zujuan/UpdateQuestionTypeAndQuestionOrder",
                url: "/MyPaperStructs/moveMyPaperExamNum",
                //     Long paperId = getParaToLong("paperId");
                // int num = getParaToInt("num");
                // int state = getParaToInt("state");//上移 1 下移-1
                //     data: { typeAndQuesStr: str },
                data: {paperId: paperData.id, examId: QuesId, state: upOrDown, region: num},
                async: false,
                success: function (data) {
                    if (data == "请加入试题到试题篮") {
                        v_jsLayer.tipForTime(data, 1000);
                    }
                    else if (data == "获取数据异常") {
                        v_jsLayer.tipForTime(data, 1000);
                    }
                    else {
                        var jData = eval(data);
                        getQuestionBasketInfo(jData[0], eval(jData[1]), jData[2]);
                    }
                },
                error: function (data) {
                    v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                }
            });
        }
    }
}
var deleteQuestionTypeTids = []
function deleteQuestionType(quesTypeIndex) {
    // deleteQuestionTypeTids.push( quesTypeIndex )
    //s alert('更新题型顺序');
    //更新题型顺序
    // $.ajax({
    //     type: "get",
    //     url: "/zujuan/TestCenterDeleteQuestionType",
    //     data: { type: typeName },
    //     async: false,
    //     success: function (data) {
    //         if (data == "删除题型失败") {
    //             v_jsLayer.tipForTime(data, 1000);
    //         }
    //         else if (data == "获取数据异常") {
    //             v_jsLayer.tipForTime(data, 1000);
    //         }
    //         else {
    //             var jData = eval(data);
    //             getQuestionBasketInfo(jData[0], eval(jData[1]), jData[2]);
    //         }
    //     },
    //     error: function (data) {
    //         v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
    //     }
    // });

    $.ajax({
        type: "get",
        url: "/MyPaperStructs/removeMyPaperRegion",
        data: {regionPosition: quesTypeIndex, paperId: paperData.id},
        async: false,
        success: function (data) {
            if (data == "删除题型失败") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else if (data == "获取数据异常") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else {
                var jData = eval(data);
                getQuestionBasketInfo(jData[0], eval(jData[1]), jData[2]);
            }
        },
        error: function (data) {
            v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
        }
    });
}
function deleteQuestionTypesReal(quesTypeIndex){
    $.ajax({
        type: "get",
        url: "/MyPaperStructs/removeMyPaperRegion",
        data: {regionPosition: quesTypeIndex, paperId: paperData.id},
        async: false,
        success: function (data) {
            if (data == "删除题型失败") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else if (data == "获取数据异常") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else {
                var jData = eval(data);
                getQuestionBasketInfo(jData[0], eval(jData[1]), jData[2]);
            }
        },
        error: function (data) {
            v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
        }
    });
}

 var deleteQuestionTids = []
function deleteQuestion(tid) {
    // deleteQuestionTids.push( tid )
    //更新试题顺序
    $.ajax({
        type: "get",
        // url: "/zujuan/TestCenterDeleteQuestion",
        url: "/MyPaperStructs/removeMyPaper",
        data: {tId: tid, paperId: paperData.id},
        async: false,
        success: function (data) {
            if (data == "删除试题失败") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else if (data == "获取数据异常") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else {
                var jData = eval(data);
                getQuestionBasketInfo(jData[0], eval(jData[1]), jData[2]);
            }
        },
        error: function (data) {
            v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
        }
    });
}
function deleteQuestionReal(tid) {
    //更新试题顺序
    $.ajax({
        type: "get",
        // url: "/zujuan/TestCenterDeleteQuestion",
        url: "/MyPaperStructs/removeMyPaper",
        data: {tId: tid, paperId: paperData.id},
        async: false,
        success: function (data) {
            // if (data == "删除试题失败") {
            //     v_jsLayer.tipForTime(data, 1000);
            // }
            // else if (data == "获取数据异常") {
            //     v_jsLayer.tipForTime(data, 1000);
            // }
            // else {
            //     var jData = eval(data);
            //     getQuestionBasketInfo(jData[0], eval(jData[1]), jData[2]);
            // }
        },
        error: function (data) {
            // v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
        }
    });
}

function deleteQuestionsAndQuestionType() {
//     // 删除试题,删除题型。
//     for(var i=0;i<deleteQuestionTids.length;i++){
//         deleteQuestionReal(deleteQuestionTids[i])
//     }
//     deleteQuestionTids = []
// //    删除题型。
//     for(var i=0;i<deleteQuestionTypeTids.length;i++){
//         deleteQuestionTypesReal(deleteQuestionTypeTids[i])
//     }
//     deleteQuestionTypeTids = []
}




