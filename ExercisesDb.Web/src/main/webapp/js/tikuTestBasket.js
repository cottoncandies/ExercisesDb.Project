var addZhnetQuestionValue = 0; //是否是志鸿题
var isZhnetQuestionStyle = 0;//加入试题 按钮样式

//页面加载时
//$(document).ready(function () {
function loadMyQuestionBasket() {
    var selectTypeLoad = $("#myTikuSelect").html();
    if (selectTypeLoad == "mycollect" || selectTypeLoad == "myscan") {
        addZhnetQuestionValue = 1; //
        if (selectTypeLoad == "myscan") {
            isZhnetQuestionStyle = 1;
        }
    }
    //绑定页面的事件
    InitPageTestEvents();
    //    //处理页面头部导航  //此js 已经单独 成文件
    //    stickUpNav();
    //初始化试题篮
    loadQuestionBasket();
}

//});

function loadQuestionBasket() {
    $.ajax({
        type: "get",
        url: "/zujuan/loadQuestionBasket",
        async: false,
        success: function (data) {
            // if (data == "获取数据异常") {
            //     v_jsLayer.tipForTime(data, 1000);
            // }
            if (data.result == 0) {
                //alert(data);
                // var jData = eval(data);
                // alert(jData+'5555');
                // getQuestionBasketInfo(jData[0], eval(jData[1]), jData[2]);
                $("#stlCount").text("(" + data.data + ")");
            }
        },
        error: function (data) {
            // v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
        }
    });
}

function getQuestionBasketInfo(returnVal, questionTypeData, questionDifficult) {
    //alert('返回加载试题篮' + returnVal + " | " + questionTypeData + " | " + questionDifficult);
    if (returnVal == "成功") {
        UpdateQuestionBasketInfo(questionTypeData, questionDifficult);
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

function InitPageTestEvents() {
    // alert('InitPageTestEvents');
    //当点击加入试卷时----在线试题
    $(document).on("click", ".jshijuan", function () {
        //$(".addques").on("click", function myfunction() {

        var hasLength = $("#questionCount").text();
        //alert(hasLength);
        if (hasLength < 50) {//判断如果 <=49 以内才可以加入试题
            var tid = $(this).attr("id").replace("QuestionOperate", "");
            var node = $(this).attr("node");
            var period = $(this).attr("period");
            var subject = $(this).attr("subject");
            var questionType = $(this).attr("questionType");
            var difficulty = $(this).attr("difficulty");
            var score = $(this).attr("score");
            var content = $("#T" + tid + " .stContent").html();
            var answer = $("#T" + tid + " .dadan:eq(0)").html();
            var analytical = $("#T" + tid + " .dadan:eq(1)").html();
            var questionTime = "";
            var source = ""; //来源
            if (addZhnetQuestionValue == 1) {
                questionTime = $("#T" + tid + " .right span:eq(0)").html();
                source = "我的题库网络试题";
            }
            else {
                questionTime = $("#T" + tid + " .right span:eq(1)").html(); //和 addquesMyQues  addquesMyQuesPic 不同 多了 来源
                source = $("#T" + tid + " .right span:eq(0)").html(); //来源
            }
            var ability = $("#T" + tid + " .t5").html();
            var knowledge = "";
            var material = "";
            if (location.href.trim().toLowerCase().indexOf("zujuan.html") > 0) {
                if (isMLorZSD == "ML") {
                    knowledge = $("#T" + tid + " .t4").html();
                }
                if (isMLorZSD == "ZSD") {
                    material = $("#T" + tid + " .t1").html();
                }
            }
            var zhnetST = addZhnetQuestionValue;
            var picST = 0; //0 是 文本试题 1是 图片
            // alert(questionType + " | " + difficulty + " | " + score + " | " + content + " | " + answer + " | " + analytical + " | " + questionTime + " | " + ability + " | " + knowledge + " | " + source + " | " + material);
            //var myQuestion = new QuestionClass(tid, node, period, subject, questionType, difficulty, score, analytical, answer, content, zhnetST, picST, questionTime, source, ability, knowledge, material);
            //alert(myQuestion.difficulty);
            //var paperJsonStr = JSON.stringify(myQuestion);
            //alert(paperJsonStr);
            if (returnFlagAddQuestion(questionType, difficulty, score, content, tid) == true) {
                $.ajax({
                    type: "get",
                    url: "/MyPaperStructs/addMyPaper",
                    data: {tid: tid, zhnetST: addZhnetQuestionValue, picST: picST},
                    //dataType: "json",
                    //contentType: "application/json",
                    async: false,
                    success: function (data) {

                        if (data == "加入试题篮失败") {
                            v_jsLayer.tipForTime(data, 1000);
                        }
                        else if (data == "没有这道题") {
                            v_jsLayer.tipForTime(data, 1000);
                        }
                        else {
                            var jData = eval(data);
                            var returnVal = "";
                            if (jData.result == 0) {
                                returnVal = "成功";
                            } else {
                                returnVal = "失败";
                            }
                            // console.log('加入试卷'+data);
                            var content = $("#stlCount").text();
                            var countString = content.substr(1, content.length - 1);
                            var count = parseInt(countString);
                            count++;
                            $("#stlCount").text("(" + count + ")");
                            addTestLogInfo(returnVal, jData.data, eval(jData[2]), jData[3]);
                        }
                    },
                    error: function (data) {
                        v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                    }
                });
            }
        }
        else {
            v_jsLayer.tipForTime("试题篮有" + hasLength + "道试题,不能超过50！", 1000);
        }
    });
    $(document).on("click", ".ycsj", function () {

        //$(".delques").on("click", function myfunction() {
        //alert('点击了移出试题');
        var tid = $(this).attr("id").replace("QuestionOperate", "");
        var questionType = $(this).attr("questionType");
        //alert(tid + " | " + questionType + " | " + addZhnetQuestionValue);
        $.ajax({
            type: "get",
            url: "/MyPaperStructs/removeMyPaper",
            data: {tId: tid, questionType: questionType, isZhnetST: addZhnetQuestionValue},
            async: false,
            success: function (data) {
                if (data == "移除试题篮失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    console.log(jData);
                    var returnVal = "";
                    if (jData.result == 0) {
                        returnVal = "成功";
                    } else {
                        returnVal = "失败";
                    }
                    var content = $("#stlCount").text();
                    var countString = content.substr(1, content.length - 1);
                    var count = parseInt(countString);
                    count--;
                    $("#stlCount").text("(" + count + ")");
                    removeTestLogInfo(returnVal, jData.data, eval(jData[2]), jData[3]);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    });
    //当点击本页试题全部加入试卷时
    $("#addAllTest").on("click", function myfunction() {
        //alert('点击了全部加入试题');
        //alert($(this).attr("data"));
        //var isZhnetST = $(this).attr("data");
        addAllPaper();
    });
    //给原本存在或脚本创建的元素添加事件  如果是 $(".addques2").click(function myfunction(){});  则只是原始元素才有事件
    $(".addques2").on("click", function myfunction() {
        v_jsLayer.tipForTime("抱歉！功能开发中...", 1000);
    });

    $(document).on("click", ".jiatk", function () {
        //$(".fav").on("click", function myfunction() {
        //alert("点击了收藏试题");
        var tid = $(this).attr("id").replace("collect", "");
        //alert(tid);
        $.ajax({
            type: "get",
            url: "/zujuan/addCollectQuestion",
            data: {tid: tid},
            async: false,
            success: function (data) {
                if (data == "收藏试题失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    addCollectLogInfo(jData[0], jData[1]);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    });

    $(document).on("click", ".yctk", function () {
        //$(".rav").on("click", function myfunction() {
        //alert("点击了移出收藏");
        var tid = $(this).attr("id").replace("collect", "");
        //alert(tid);
        $.ajax({
            type: "get",
            url: "/zujuan/removeCollectQuestion",
            data: {tid: tid},
            async: false,
            success: function (data) {
                if (data == "取消收藏失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    removeCollectLogInfo(jData[0], jData[1]);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    });

    $(document).on("click", ".yctkc", function () {
        var tid = $(this).attr("id").replace("collect", "");
        //alert(tid);
        $.ajax({
            type: "get",
            url: "/zujuan/removeCollectQuestion",
            data: {tid: tid},
            async: false,
            success: function (data) {
                if (data == "取消收藏失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    // removeCollectLogInfo(jData[0], jData[1]);
                    if (jData[0] == "成功") {
                        // InitNodeTree();
                        getNewSTInfo();
                    }
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    });

    $(document).on("click", ".emptyquestype", function () {
        //$(".emptyquestype").on("click", function myfunction() {//地方法对动态加载的 无效？？？
        var questionType = $(this).attr("title").replace("清空 ", "");
        //var conf = confirm("确定清空\"" + questionType + "\"吗?");
        //if (conf == true) {
        SimplePop.confirm("确定清空\"" + questionType + "\"吗?", {
            type: "confirm",
            confirm: function () {

                $.ajax({
                    type: "get",
                    url: "/zujuan/cleanQuestionTypeTest",
                    data: {type: questionType},
                    async: false,
                    success: function (data) {
                        //v_jsLayer.tipForTime(data, 1000);
                        if (data.indexOf("没有需要清空的") > 0 || data.indexOf("内没有试题") > 0 || data.indexOf("失败") > 0) {
                            v_jsLayer.tipForTime(data, 1000);
                        }
                        else {
                            var jData = eval(data);
                            cleanQuestionTestInfo(jData[0], jData[1], eval(jData[2]), eval(jData[3]), jData[4]);
                        }
                    },
                    error: function (data) {
                        v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                    }
                });

            }
        })

    });
    $(".deleteall").on("click", function myfunction() {
        //alert("清空所有试题");
        var hasLength = $("#questionCount").text();
        if (hasLength >= 0) {
            //var conf = confirm("确定清空试题篮所有试题吗?");
            //if (conf == true) {
            SimplePop.confirm("确定清空试题篮所有试题吗?", {
                type: "confirm",
                confirm: function () {

                    $.ajax({
                        type: "get",
                        url: "/zujuan/cleanAllQuestionTest",
                        async: false,
                        success: function (data) {
                            if (data == "清空全部试题失败") {
                                v_jsLayer.tipForTime(data, 1000);
                            }
                            else if (data == "没有需要清空的试题") {
                                v_jsLayer.tipForTime(data, 1000);
                            }
                            else {
                                var jData = eval(data);
                                console.log('pppp' + jData);
                                cleanAllQuestionTestInfo(jData[0], eval(jData[1]), jData[2]);
                            }
                        },
                        error: function (data) {
                            v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                        }
                    });

                }
            })

        }
        else {
            v_jsLayer.tipForTime("没有要清空的试题，请加入试题组卷吧！", 1000);
        }
    });
    ////我的题库页面的方法  将文本加入试题---扫描试题
    $(document).on("click", ".wbjsj,.cimg", function () {
        //$(".addquesMyQues,.addquesMyQuesPic").on("click", function myfunction() {
        //alert("点击了文本加入试题");
        var hasLength = $("#questionCount").text();
        //alert(hasLength);
        if (hasLength < 50) {//判断如果 <=49 以内才可以加入试题
            var tid = $(this).attr("id").replace("QuestionOperatePic", "").replace("QuestionOperate", "");// alert(tid);
            var isPicQuestioin = 0; //1 图片   0 文本
            var addQuesActionName = "addOneTestInfo";
            if ($(this).attr("id") == "QuestionOperate" + tid) {
                isPicQuestioin = 0;
                addQuesActionName = "addOneTestInfo";
            }
            else if ($(this).attr("id") == "QuestionOperatePic" + tid) {
                isPicQuestioin = 1;
                addQuesActionName = "addOneTestInfoImage";
            }
            var node = $(this).attr("node");
            var period = $(this).attr("period");
            var subject = $(this).attr("subject");
            var questionType = $(this).attr("questionType");
            var difficulty = $(this).attr("difficulty");
            var score = $(this).attr("score");
            var content = "";
            if (isZhnetQuestionStyle == 0) {//志鸿我收藏的试题
                content = $("#T" + tid + " .stContent").html();
            }
            else if (isZhnetQuestionStyle == 1) {//扫描的试题
                if (isPicQuestioin == 0) {//文本
                    content = $("#T" + tid + " .rightext").html();
                }
                else if (isPicQuestioin == 1) {//图片
                    content = $("#T" + tid + " .leftimg").html(); //.children().attr("src");
                }
            }
            var answer = $("#T" + tid + " .dadan:eq(0)").html();
            var analytical = $("#T" + tid + " .dadan:eq(1)").html();
            var questionTime = $("#T" + tid + " .right span:eq(0)").html();
            var ability = $("#T" + tid + " .t5").html();
            var knowledge = "";
            var source = "我的题库扫描试题";
            var material = "";
            var picST = isPicQuestioin; //0 是文本试题，1  是  图片试题
            //alert(questionType + " | " + difficulty + " | " + score + " | " + content + " | " + answer + " | " + analytical + " | " + questionTime + " | " + ability + " | " + knowledge + " | " + source + " | " + material);
            if (returnFlagAddQuestion(questionType, difficulty, score, content, tid) == true) {
                $.ajax({
                    type: "get",
                    url: "/zujuan/addOneTest",
                    data: {tid: tid, zhnetST: addZhnetQuestionValue, picST: isPicQuestioin},
                    async: false,
                    success: function (data) {
                        if (data == "清空全部试题失败") {
                            v_jsLayer.tipForTime(data, 1000);
                        }
                        else if (data == "没有需要清空的试题") {
                            v_jsLayer.tipForTime(data, 1000);
                        }
                        else {
                            var jData = eval(data);
                            addTestLogInfo(jData[0], jData[1], eval(jData[2]), jData[3]);
                        }
                    },
                    error: function (data) {
                        v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                    }
                });
            }
        }
        else {
            v_jsLayer.tipForTime("试题篮有" + hasLength + "道试题,不能超过50！", 1000);
        }
    });
    ///移出我的试题
    $(document).on("click", ".ycwdsj", function () {
        //$(".delquesMyQues").on("click", function myfunction() {
        //alert('点击了移出我的试题');
        var tid = $(this).attr("id").replace("QuestionOperatePic", "").replace("QuestionOperate", "");
        var questionType = $(this).attr("questionType");
        //alert(tid);
        $.ajax({
            type: "get",
            url: "/zujuan/removeOneTest",
            data: {tId: tid, questionType: questionType, isZhnetST: addZhnetQuestionValue}, //addZhnetQuestionValue=1
            async: false,
            success: function (data) {
                if (data == "移除试题篮失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    removeTestLogInfo(jData[0], jData[1], eval(jData[2]), jData[3]);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    });
}

//加入试卷  返回值
function addTestLogInfo(returnVal, tid, returnTestList, questionDifficult) {
    //alert(returnVal + " " + tid);
    //alert(typeof (returnTestList));
    if (returnVal == "成功") {
        QuesStyleSwitch("sj", tid);
        UpdateQuestionBasketInfo(returnTestList, questionDifficult); //更新试题篮子
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

//移出试卷  返回值
function removeTestLogInfo(returnVal, tid, returnTestList, questionDifficult) {
    // alert(returnVal + " " + tid);
    //alert(typeof (returnTestList));
    if (returnVal == "成功") {
        QuesStyleSwitch("sj", tid);
        UpdateQuestionBasketInfo(returnTestList, questionDifficult);
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

//全部加入试卷
var QuesButtons;  //$("a.addques");   $("#queslistbox a.addques");
function addAllPaper() {
    //alert(isZhnetQuestionStyle); //isZhnetST 参数 只能控制按钮样式  不能纯粹判断是否志鸿题 因为  我的网络题库 里面的题 不算志鸿题 而用的 志鸿题的样式
    if (isZhnetQuestionStyle == 0) {
        QuesButtons = $("#stContent a.jshijuan");
    }
    else if (isZhnetQuestionStyle == 1) {
        QuesButtons = $("#stContent a.wbjsj");
    }
    var len = QuesButtons.length;
    //alert(len);
    if (len == 0) {
        v_jsLayer.tipForTime("没有要添加的试题！", 1000);
        return;
    }
    //限制试题篮数量
    var hasLength = $("#questionCount").text();
    //alert(hasLength);
    //这个 比较特殊  判断 以加入和当前 可加入的 一起 判断
    if (parseInt(hasLength) + parseInt(len) <= 50) {
        var questionListStr = "";
        var questionFlagAdd = true;
        var breakInt = 0;
        for (var i = 0; i < len; i++) {
            var QuesButton = QuesButtons.eq(i);
            var question = new QuestionClass();
            var tid = QuesButton.attr("id").replace("QuestionOperate", "");
            question.id = tid;
            question.node = QuesButton.attr("node");
            question.period = QuesButton.attr("period");
            question.subject = QuesButton.attr("subject");
            question.questionType = QuesButton.attr("questionType");
            question.difficulty = QuesButton.attr("difficulty");
            question.score = QuesButton.attr("score");
            if (isZhnetQuestionStyle == 0) {
                question.content = $("#T" + tid + " .stContent").html();
            }
            else if (isZhnetQuestionStyle == 1) {
                question.content = $("#T" + tid + " .rightext").html();
            }
            question.answer = $("#T" + tid + " .dadan:eq(0)").html();
            question.analytical = $("#T" + tid + " .dadan:eq(1)").html();
            question.zhnetST = addZhnetQuestionValue;  //isZhnetQuestionStyle;
            question.picST = 0; //0 文本 1 图片 不是图片试题  批量不能加入图片试题 只能加入文本
            if (addZhnetQuestionValue == 1) {
                question.questionTime = $("#T" + tid + " .right span:eq(0)").html();
                if (isZhnetQuestionStyle == 0) {
                    question.source = "我的题库网络试题";
                }
                else if (isZhnetQuestionStyle == 1) {
                    question.source = "我的题库扫描试题";
                }
            }
            else {
                question.questionTime = $("#T" + tid + " .right span:eq(1)").html(); //和 addquesMyQues  addquesMyQuesPic 不同 多了 来源
                question.source = $("#T" + tid + " .right span:eq(0)").html(); //来源
            }
            question.ability = $("#T" + tid + " .t5").html();
            if (location.href.trim().toLowerCase().indexOf("zujuan.html") > 0) {
                if (isMLorZSD == "ML") {
                    question.knowledge = $("#T" + tid + " .t4").html();
                }
                if (isMLorZSD == "ZSD") {
                    question.material = $("#T" + tid + " .t1").html();
                }
            }
            var FlagAddQuestionValue = returnFlagAddQuestion(question.questionType, question.difficulty, question.score, question.content, tid);
            //alert(FlagAddQuestionValue);
            if (FlagAddQuestionValue == false) {
                questionFlagAdd = false;
                breakInt = parseInt(i + 1);
                break;
            }
            //            questionListStr += question.id + "***" + question.node + "***" + question.period + "***" + question.subject + "***" + question.questionType + "***" +
            //            question.difficulty + "***" + question.score + "***" + question.analytical + "***" + question.answer + "***" + question.content + "***" + question.zhnetST + "***" +
            //            question.ability + "***" + question.source + "***" + question.questionTime + "***" + question.material + "***" + question.knowledge + "***" + question.picST;  //每条数据
            //            questionListStr += "###"; //拼接每条数据
            questionListStr += tid + ",";
        }
        //alert(questionFlagAdd);
        if (questionFlagAdd == true) {
            //alert(questionListStr);
            //判断组后一个字符是","    str.charAt(str.length - 1)  或者  str.subStr(str.length-1,1)
            if (questionListStr.charAt(questionListStr.length - 1) == ",") {
                questionListStr = questionListStr.substr(0, questionListStr.length - 1);
            }
            //alert(addZhnetQuestionValue);
            $.ajax({
                type: "get",
                url: "/zujuan/addOnePageTest",
                data: {tIdS: questionListStr, isZhnetST: addZhnetQuestionValue, isPicST: 0},
                async: false,
                success: function (data) {
                    if (data == "加入试题篮失败") {
                        v_jsLayer.tipForTime(data, 1000);
                    }
                    else if (data == "未获取到试题蓝结构") {
                        v_jsLayer.tipForTime(data, 1000);
                    }
                    else if (data == "没有需要加入的试题") {
                        v_jsLayer.tipForTime(data, 1000);
                    }
                    else {
                        var jData = eval(data);
                        addAllTestLogInfo(jData[0], eval(jData[1]), jData[2]);
                    }
                },
                error: function (data) {
                    v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                }
            });
        }
        else {
            var delQuesButtonsCount = 0;
            if (isZhnetQuestionStyle == 0) {
                delQuesButtonsCount = $("#stContent a.delques").length;
            }
            else if (isZhnetQuestionStyle == 1) {
                delQuesButtonsCount = $("#stContent a.ycwdsj").length;
            }
            v_jsLayer.tipForTime("第" + (breakInt + delQuesButtonsCount) + "题缺少属性，暂不能加入到试题篮", 1000);
        }
    }
    else {
        v_jsLayer.tipForTime("试题篮有" + hasLength + "道试题,不能超过50！", 1000);
    }
}

//全部加入试卷  返回值
function addAllTestLogInfo(returnVal, returnTestList, questionDifficult) {
    //alert(returnVal + " | " + returnTestList + " | " + questionDifficult);
    if (returnVal == "成功") {
        var len = QuesButtons.length;
        //alert(len);
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                QuesStyleSwitch("sj2", QuesButtons.eq(i).attr("id").replace("QuestionOperate", ""));
            }
            UpdateQuestionBasketInfo(returnTestList, questionDifficult);
        }
        v_jsLayer.tipForTime("试题已全部选入！", 1000);
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

//清空 某题型试题  返回值
function cleanQuestionTestInfo(returnVal, type, returnTestList, returnTestList2, questionDifficult) {
    //alert(returnVal);
    if (returnVal == "成功") {
        //alert('清空 某题型试题  返回值');
        UpdateQuestionBasketInfo(returnTestList2, questionDifficult); //更新试题篮  returnTestList2 是操作后剩下的试题
        updateQuestionButtonStyle(returnTestList, type);  //更新试题及按钮样式 returnTestList 是操作前有的试题
        //判断是否是组卷中心,如果是需要刷新 或者 重新加载试题
        //alert(flagIsZJZX);
        if (flagIsZJZX == true) {
            //loadTestCenter(); //汤立德 20151105 改成页面刷新 就不用 单独加载了
            location.href = "/zujuan/paperCenter";
        }
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

//清空 全部题型试题  返回值
function cleanAllQuestionTestInfo(returnVal, returnTestList, questionDifficult) {
    //alert(returnVal);
    if (returnVal == "成功") {
        UpdateQuestionBasketInfo("", questionDifficult);
        updateQuestionButtonStyle(returnTestList, "");
        //判断是否是组卷中心,如果是需要刷新 或者 重新加载试题


        if (flagIsZJZX == true) {

            window.location.href = "/zujuan/paperCenter";
        }
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

//加入收藏  返回值
function addCollectLogInfo(returnVal, tid) {
    //alert('返回加入收藏');
    if (returnVal == "成功") {
        QuesStyleSwitch("sc", tid);
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

//移出收藏  返回值
function removeCollectLogInfo(returnVal, tid) {
    //alert('返回移出收藏');
    if (returnVal == "成功") {
        //BasketQuesTypeCount();
        QuesStyleSwitch("sc", tid);
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}

//加入试卷 加入收藏 选入选出效果切换
function QuesStyleSwitch(type, tid) {
    //alert(type + " | " + tid);
    if (type == "sj") {//单一加入移除
        var quesSelect = $("#QuestionOperate" + tid);
        var quesDiv = $("#QuestionContent" + tid);
        if (quesSelect.length == 0) {
            return;
        }
        if (quesSelect.hasClass("buo jshijuan") || quesSelect.hasClass("buo wbjsj")) {//选择试题
            //quesSelect.next().remove(); //点击加入试卷篮后移出后面的三角
            if (quesSelect.hasClass("buo jshijuan")) {
                quesSelect.removeClass("buo jshijuan").addClass("buh ycsj");
                quesSelect.text("移出试卷");
            } //移出试卷
            if (quesSelect.hasClass("buo wbjsj")) {
                quesSelect.removeClass("buo wbjsj").addClass("buh ycwdsj");
                quesSelect.text("移出试卷");
            } //移出我的试卷

            $("#QuestionOperatePic" + tid).hide(); //当试题加入试题篮，这时 不能再加入试题了（图片和文本两个按钮，文本按钮的样式换成了移出，将图片按钮隐藏）
            $("#deleteId" + tid).hide(); //隐藏删除试题
            $("#editId" + tid).hide(); //当试题已加入试题篮，隐藏编辑按钮

            if (quesDiv.find("div.selectedmask").length == 0) {
                quesDiv.append("<div class=\"selectedmask\"></div>"); //添加试题遮罩
                quesDiv.find("div.selectedmask").css({width: quesDiv.width(), height: quesDiv.height()});
            }
            // liveAddquesBtn(tid);
        } else {//删除试题
            //alert('删除试题');
            //$("<a class=\"addques2\" title=\"选入试题篮\"></a>").insertAfter(quesSelect);
            if (quesSelect.hasClass("buh ycsj")) {
                quesSelect.removeClass("buh ycsj").addClass("buo jshijuan");
                quesSelect.text("加入试卷");
            }  //加入试卷
            if (quesSelect.hasClass("buh ycwdsj")) {
                if (isZhnetQuestionStyle == 0) {//网络试题
                    quesSelect.removeClass("buh ycwdsj").addClass("buo jshijuan");
                    quesSelect.text("加入试卷");
                }
                else {//=1 扫描试题
                    quesSelect.removeClass("buh ycwdsj").addClass("buo wbjsj");
                    quesSelect.text("文本加入试卷");
                }
            }  //文本加入试卷

            $("#QuestionOperatePic" + tid).show(); //当试题移出试题篮，显示图片按钮
            $("#deleteId" + tid).show(); //显示删除试题
            $("#editId" + tid).show(); //当试题已加入试题篮，图片按钮显示

            if (quesDiv.find("div.selectedmask").length > 0) {
                quesDiv.find("div.selectedmask").remove();
            }
            // liveDelquesBtn(tid);
        }
    }
    else if (type == "sj2") {//全部加入
        var quesSelect = $("#QuestionOperate" + tid);
        var quesDiv = $("#QuestionContent" + tid);
        if (quesSelect.length == 0) {
            return;
        }
        if (quesSelect.hasClass("buo jshijuan") || quesSelect.hasClass("buo wbjsj")) {//选择试题
            //quesSelect.next().remove(); //点击加入试卷篮后移出后面的三角
            if (quesSelect.hasClass("buo jshijuan")) {
                quesSelect.removeClass("buo jshijuan").addClass("buh ycsj");
                quesSelect.text("移出试卷");
            }
            if (quesSelect.hasClass("buo wbjsj")) {
                quesSelect.removeClass("buo wbjsj").addClass("buh ycwdsj");
                quesSelect.text("移出试卷");
            }

            $("#QuestionOperatePic" + tid).hide(); //隐藏图片加入按钮
            $("#deleteId" + tid).hide(); //隐藏删除试题按钮
            $("#editId" + tid).hide(); //隐藏修改试题按钮

            if (quesDiv.find("div.selectedmask").length == 0) {
                quesDiv.append("<div class=\"selectedmask\"></div>"); //添加试题遮罩
                quesDiv.find("div.selectedmask").css({width: quesDiv.width(), height: quesDiv.height()});
            }
        } else {//删除试题
            //alert('删除试题');
            //$("<a class=\"addques2\" title=\"选入试题篮\"></a>").insertAfter(quesSelect);
            if (quesSelect.hasClass("buh ycsj")) {
                quesSelect.removeClass("buh ycsj").addClass("buo jshijuan");
                quesSelect.text("加入试卷");
            }
            if (quesSelect.hasClass("buh ycwdsj")) {
                quesSelect.removeClass("buh ycwdsj").addClass("buo wbjsj");
                quesSelect.text("文本加入试卷");
            }

            $("#QuestionOperatePic" + tid).show(); //显示图片加入按钮
            $("#deleteId" + tid).show(); //显示删除试题也
            $("#editId" + tid).show(); //显示修改试题按钮

            if (quesDiv.find("div.selectedmask").length > 0) {
                quesDiv.find("div.selectedmask").remove();
            }
        }
    }
    else if (type == "sc") {
        //alert(type + " " + tid);
        var quesSelect = $("#collect" + tid);
        if (quesSelect.length == 0) {
            return;
        }
        if (quesSelect.hasClass("buo jiatk")) {//加入收藏
            quesSelect.removeClass("buo jiatk").addClass("buh yctk");
            quesSelect.text("移出我的题库");
            v_jsLayer.tipForTime("试题已成功加入我的题库", 500);
        } else {//移出收藏
            quesSelect.removeClass("buh yctk").addClass("buo jiatk");
            quesSelect.text("加入我的题库");
            v_jsLayer.tipForTime("试题已成功移出我的题库", 500);
        }
    }
    else {
        v_jsLayer.tipForTime("类型错误！" + type, 2000);
    }
}

function setShadowSize(tid) {
    var quesDiv = $("#QuestionContent" + tid);
    if (quesDiv.find("div.selectedmask").length > 0) {
        //ie6试题遮罩的高度调整
        quesDiv.find("div.selectedmask").css({width: quesDiv.width(), height: quesDiv.height()});
    }
}

//试题篮，根据各题型的试题数据绘制
function UpdateQuestionBasketInfo(questionTypeData, questionDifficult) {

    //alert('更新试题蓝|' + questionTypeData + " " + questionDifficult);
    var length = 0;
    if (questionTypeData != undefined && questionTypeData.length > 0)
        length = questionTypeData.length;

    if (parseInt(length) < 1) {
        $("#cartEmptyText").hide();
        $("#cartEmptyInput").hide();
        $("#cartEmptyTS").show().html("您的试题篮没有试题，赶快加入试题吧！");
    }
    else {
        $("#cartEmptyText").show();
        $("#cartEmptyInput").show();
        $("#cartEmptyTS").hide();
    }
    var html = [];
    var questionCount = 0;
    var maxbiliwidth = 60;
    for (var i = 0; i < length; i++) {
        questionCount += Number(questionTypeData[i]["TEST_QUESTIONS_COUNT"]);
    }
    // alert(questionCount);
    html.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody>");
    for (var i = 0; i < length; i++) {
        var questionName = questionTypeData[i]["TEST_QUESTIONS"];
        var questionTypeCount = questionTypeData[i]["TEST_QUESTIONS_COUNT"];
        //alert(questionName + " | " + questionTypeCount);
        var bili = questionTypeCount / questionCount;
        var width = parseInt(maxbiliwidth * bili);
        var percentage = parseFloat(bili * 100).toFixed(1); //计算占据百分比
        percentage = percentage == "NaN" ? 0 : percentage;
        html.push("<tr title='占 " + percentage + "%'>" +
            "<td align='right' title='" + questionName + "'>" +
            ((questionName.length > 5) ? questionName.substr(0, 5) + ".." : questionName) + "：</td>" +
            "<td align='left'><span class='bilibox' style='width:" + maxbiliwidth + "px;'>" +
            "<span class='bilibg' style='width:" + width + "px;'></span>" +
            "</span></td>" +
            "<td>" + questionTypeCount + "题</td>" +
            "<td><a class='emptyquestype' href=\"javascript:;\" title='清空 " + questionName + "'></a></td>" +
            "</tr>");
    }
    html.push("</tbody></table>");
    //console.log(html.toString());
    $("#questionTypeCount").empty().html(html.join(""));
    $("#questionCountTip").html("(" + questionCount + ")");
    $("#questionCount").html(questionCount);
    //alert($("#questionTypeCount").html());
    if (questionDifficult.length > 0) {
        //处理平均难度  难度系数
        var ndValue = questionDifficult;
        var ndText = "";
        switch (true) {
            case 0 < ndValue && ndValue <= 0.2:
                ndText = "难";
                break;
            case 0.2 < ndValue && ndValue <= 0.4:
                ndText = "较难";
                break;
            case 0.4 < ndValue && ndValue <= 0.6:
                ndText = "中";
                break;
            case 0.6 < ndValue && ndValue <= 0.8:
                ndText = "较易";
                break;
            case 0.8 < ndValue && ndValue <= 1:
                ndText = "易";
                break;
            default:
                ndText = "未知";
                break;
        }
        $("#questionDiffValue").html(ndValue);
        $("#questionDiffText").html(ndText);
    }
}

//更新 清空试题后 试题及按钮的样式
var QuestionButtonsDelete;

function updateQuestionButtonStyle(deleteData, type) {
    //alert(deleteData + " " + type);
    if (isZhnetQuestionStyle == 0) {
        QuestionButtonsDelete = $("#stContent a.ycsj");
    }
    else if (isZhnetQuestionStyle == 1) {
        QuestionButtonsDelete = $("#stContent a.ycwdsj");
    }
    var len = QuestionButtonsDelete.length;
    //alert(len);
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            if (type == "") {
                if (QuestionButtonsDelete.eq(i).hasClass("ycsj") || QuestionButtonsDelete.eq(i).hasClass("ycwdsj")) {
                    QuesStyleSwitch("sj2", QuestionButtonsDelete.eq(i).attr("id").replace("QuestionOperate", ""));
                }
            }
            else {
                var tx = QuestionButtonsDelete.eq(i).attr("questionType");
                if (tx == type) {
                    QuesStyleSwitch("sj2", QuestionButtonsDelete.eq(i).attr("id").replace("QuestionOperate", ""));
                }
            }
        }
    }
}

function liveAddquesBtn(tid) {
    //alert('liveAddquesBtn' + tid);
    //$(".addques").live("click", function () {
    //得到id值
    //var tid = $(this).attr("id").replace("QuestionOperate", "");
    var ques = $("#QuestionContent" + tid + ">.nr");
    var top = ques.offset().top, left = ques.offset().left, width = ques.width(), height = ques.height();
    //alert(top + " | " + left + " | " + width + " | " + height);
    //得到试题篮的位置
    var cart = $("#testBasketID");
    var ttop = cart.offset().top, tleft = cart.offset().left, twidth = cart.width(), theight = cart.height();
    //alert(ttop + " " + tleft + " " + twidth + " " + theight);
    var cloneQues = ques.clone().appendTo('body');
    cloneQues.css("position", "absolute")
        .css('top', top + (height - 80))
        .css('left', left)
        .css('border', '1px solid #00A2E6')
        .css('background-color', '#F2F2F2')
        .css('width', width)
        .css('overflow', 'hidden')
        .css('height', '80px');

    cloneQues.animate({
        left: (tleft) + "px", top: ttop + "px", opacity: "1",
        width: twidth, height: theight
    }, 500, function () {
        //将clone删除掉
        cloneQues.remove();
    });
    //});
}

function liveDelquesBtn(tid) {
    //alert('liveDelquesBtn' + tid);
    //$(".delques").live("click", function () {
    //var tid = $(this).attr("id").replace("QuestionOperate", "");
    var ques = $("#QuestionContent" + tid + ">.nr");
    var ttop = ques.offset().top, tleft = ques.offset().left,
        width = ques.offset().width,
        twidth = ques.width(), theight = ques.height();
    //alert(ttop + " " + tleft + " " + twidth + " " + theight);
    //得到试题篮的位置
    var cart = $("#testBasketID");
    var top = cart.offset().top, left = cart.offset().left;

    var cloneQues = ques.clone().appendTo('body');
    cloneQues.css("position", "absolute")
        .css('top', top)
        .css('left', left)
        .css('background-color', '#F2F2F2')
        .css('border', '1px solid #00A2E6')
        .css('width', cart.width())
        .css('overflow', 'hidden')
        .css('height', cart.height());

    cloneQues.animate({
        left: (tleft) + "px", top: ttop + "px", opacity: "1",
        width: twidth, height: theight
    }, 500, function () {
        //将clone删除掉
        cloneQues.remove();
    });
    //});
}

function QuestionClass(id, node, period, subject, questionType, difficulty, score, analytical, answer, content, zhnetST, picST, questionTime, source, ability, knowledge, material) {
    this.id = id;
    this.node = node;
    this.period = period;
    this.subject = subject;
    this.questionType = questionType;
    this.difficulty = difficulty;
    this.score = score;
    this.analytical = analytical;
    this.answer = answer;
    this.content = content;
    this.zhnetST = zhnetST;
    this.picST = picST;

    this.questionTime = questionTime;
    this.source = source;
    this.ability = ability;
    this.knowledge = knowledge;
    this.material = material;
    return this;
}

function returnFlagAddQuestion(questionType, difficulty, score, content, tid) {
    //alert(questionType + " | " + difficulty + " | " + score + " | " + content);
    if (questionType == 'null' || questionType.length < 1) {
        v_jsLayer.tipForTime("题型不能为空", 1000);
        //var obj_edite = document.getElementById("editId" + tid)
        //console.log(obj_edite);
        wait(tid);

        return false;
    }
    else if (difficulty == 'null' || typeof (difficulty) == "undefined" || difficulty == undefined) {
        v_jsLayer.tipForTime("难度不能为空", 1000);
        wait(tid);
        return false;
    }
    else if (score == 'null' || parseFloat(score) <= 0 || score == '0') {
        v_jsLayer.tipForTime("试题分值要大于0", 1000);
        wait(tid);
        return false;
    }
    else if (content == 'null' || content.length < 1) {
        v_jsLayer.tipForTime("试题不能为空", 1000);
        wait(tid);
        return false;
    } else {
        return true;
    }
}

function wait(tid) {
    setTimeout(function () {
        $("#editId" + tid).trigger("click");
    }, 1000)
}


