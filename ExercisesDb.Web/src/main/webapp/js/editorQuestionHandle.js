$(document).ready(function () {//页面Dom元素加载完后  图片文件加载前执行
    $(document).on("click", ".editor_close", function () {
        var tId = $("#myEditQuesId").val();
        //alert(tId);
        $.ajax({
            type: "get",
            url: "/zujuan/GetMyQuestionDetailInfo",
            data: { tId: tId },
            async: false,
            success: function (data) {
                if (data == "移除试题篮失败") {
                    v_jsLayer.tipForTime(data, 1000);
                }
                else {
                    var jData = eval(data);
                    $(".modal_close").trigger("click");
                    setMyQuestionDetailInfo(jData[0], JSON.parse(jData[1]), tId);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
    });
});

//赋值 得到试题新的信息 赋值到页面
function setMyQuestionDetailInfo(returnVal, questionInfo, quesId) {
   
    //alert(returnVal + " | " + questionInfo + " | " + quesId);
    if (returnVal == "成功") {
        //alert($("#T" + quesId + " h1 .t3").html());
        //alert(questionInfo.QUESTION_TYPE);
        //找到 试题属性 类型 能力 难度
        $("#T" + quesId + " h1 .t2").html(questionInfo.QUESTION_TYPE);
        $("#T" + quesId + " h1 .t5").html(questionInfo.QUESTION_ABILITY);
        $("#T" + quesId + " h1 .t3").html(questionInfo.QUESTION_DIFFICULTY);
        $("#T" + quesId + " h1 .t6").html(questionInfo.QUESTION_SCORE);
        //找到 id  对应的a 标签
        var aHref = $("#T" + quesId + " #QuestionOperate" + quesId);
        if (aHref[0]) {
            //alert("true");
            aHref.attr("node", "");
            aHref.attr("period", questionInfo.QUESTION_PERIOD);
            aHref.attr("subject", questionInfo.QUESTION_SUBJECT);

            aHref.attr("questionType", questionInfo.QUESTION_TYPE);
            aHref.attr("difficulty", questionInfo.QUESTION_DIFFICULTY);
            aHref.attr("score", questionInfo.QUESTION_SCORE);
        }
        else {
            //alert("false");
        }


        var aHrefImg = $("#T" + quesId + " #QuestionOperatePic" + quesId);
        if (aHrefImg[0]) {
            //alert("true");
            aHrefImg.attr("node", "");
            aHrefImg.attr("period", questionInfo.QUESTION_PERIOD);
            aHrefImg.attr("subject", questionInfo.QUESTION_SUBJECT);

            aHrefImg.attr("questionType", questionInfo.QUESTION_TYPE);
            aHrefImg.attr("difficulty", questionInfo.QUESTION_DIFFICULTY);
            aHrefImg.attr("score", questionInfo.QUESTION_SCORE);
        }
        else {
            //alert("false");
        }

        //alert($("#QuestionOperate" + quesId).attr("difficulty"));
        //找到试题内容 答案 解析并赋值
        //alert(questionInfo.QUESTION_CONTENT);
        if (isZhnetQuestionStyle == 0) { $("#T" + quesId + " .stContent").html(questionInfo.QUESTION_CONTENT); }
        else if (isZhnetQuestionStyle == 1) { $("#T" + quesId + " .rightext").html(questionInfo.QUESTION_CONTENT); }
        //alert(questionInfo.QUESTION_ANSWER);
        $("#T" + quesId + " .dadan:eq(0)").html(questionInfo.QUESTION_ANSWER);
        //alert(questionInfo.QUESTION_ANALYTICAL);
        $("#T" + quesId + " .dadan:eq(1)").html(questionInfo.QUESTION_ANALYTICAL);
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    } 
}
