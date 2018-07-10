
//返回编辑 试题 内容
var JsonSTSingleValue;

$(document).ready(function () {
    var questionId = getQueryString("tId"); //$("#quesId").val();
    //alert(questionId);
    if (questionId != null && questionId != 0) {
        $.ajax({
            type: "get",
            url: "/zujuan/EditorMyQuestionAttrByQuesId",
            data: { tId: questionId },
            async: false,
            success: function (data) {
                if (data == "查询数据失败") {
                    SimplePop.alert(data);
                }
                else if (data == "暂无数据") {
                    SimplePop.alert(data);
                }
                else {
                    var jData = eval(data);
                    //alert(jData);
                    returnLoadMyQuestionInfoByQuesId(jData[0], jData[1], jData[2], jData[3], jData[4]);
                }
            },
            error: function (data) {
                SimplePop.alert("未获取到数据，请稍候再访问！");
            }
        });
    }
});

function returnLoadMyQuestionInfoByQuesId(returnVal, strJsonTX, strJsonNL, strJsonND, JsonSTSingle) {
    //alert(eval(JsonSTSingle)[0].MYQUESTION_ID);
    //alert(typeof (strJsonTX) + " | " + typeof (strJsonNL) + " | " + typeof (strJsonND) + " | " + typeof (JsonSTSingle));
    if (returnVal == "成功") {
        var jsonTX = ""; var jsonNL = ""; var jsonND = "";
        if (strJsonTX != "暂无数据") jsonTX = eval(strJsonTX);
        if (strJsonNL != "暂无数据") jsonNL = eval(strJsonNL);
        if (strJsonND != "暂无数据") jsonND = eval(strJsonND);
        //JsonSTSingle = eval(JsonSTSingle.parseJSON());//无法转换为 Object
        //alert(typeof (JSON.parse(JsonSTSingle)));
        JsonSTSingle = JSON.parse(JsonSTSingle);
        //alert(jsonTX + " | " + jsonNL + " | " + jsonND + " | " + JsonSTSingle);

        JsonSTSingleValue = JsonSTSingle;
        var Editor_Type_HTML = ""; var Editor_Ability_HTML = ""; var Editor_Difficulty_HTML = "";

        Editor_Type_HTML += "<option value=\"请选择题型\">请选择题型</option>";
        $.each(jsonTX, function () {
            if (this.题型属性 == JsonSTSingle.QUESTION_TYPE) {
                Editor_Type_HTML += "<option value=" + this.题型属性 + " selected=\"selected\">" + this.题型属性 + "</option>";
            }
            else {
                Editor_Type_HTML += "<option value=" + this.题型属性 + ">" + this.题型属性 + "</option>";
            }
        });
        Editor_Ability_HTML += "<option value=\"请选择考查能力\">请选择考查能力</option>";
        $.each(jsonNL, function () {
            if (this.考查能力 == JsonSTSingle.QUESTION_ABILITY) {
                Editor_Ability_HTML += "<option value=" + this.考查能力 + " selected=\"selected\">" + this.考查能力 + "</option>";
            }
            else {
                Editor_Ability_HTML += "<option value=" + this.考查能力 + ">" + this.考查能力 + "</option>";
            }
        });
        Editor_Difficulty_HTML += "<option value=\"请选择难度\">请选择难度</option>";
        $.each(jsonND, function (i, val) {
            if (val == JsonSTSingle.QUESTION_DIFFICULTY) {
                Editor_Difficulty_HTML += "<option value=" + val + " selected=\"selected\">" + val + "</option>";
            }
            else {
                Editor_Difficulty_HTML += "<option value=" + val + ">" + val + "</option>";
            }
        });
        //alert(Editor_Ability_HTML);
        $("#Editor_Type").html(Editor_Type_HTML);
        $("#Editor_Ability").html(Editor_Ability_HTML);
        $("#Editor_Difficulty").html(Editor_Difficulty_HTML);
        $("#Editor_Score").val(JsonSTSingle.QUESTION_SCORE);
    }
}

function setQuestionInfo() {
    //alert('进入方法');
    var Editor_Type_Value = $("#Editor_Type").find("option:selected").text();
    var Editor_Ability_Value = $("#Editor_Ability").find("option:selected").text();
    var Editor_Difficulty_Value = $("#Editor_Difficulty").find("option:selected").text();
    var Editor_Score_Value = $("#Editor_Score").val();

    if (Editor_Type_Value == "请选择题型") {
        SimplePop.alert("请选择题型");
    }
    else if (Editor_Ability_Value == "请选择考查能力") {
        SimplePop.alert("请选择考查能力");
    }
    else if (Editor_Difficulty_Value == "请选择难度") {
        SimplePop.alert("请选择难度");
    }
    else if (Editor_Score_Value == "" || Editor_Score_Value == null) {
        SimplePop.alert("请输入试题分值");
    }
    else if (parseFloat(Editor_Score_Value.trim()) <= 0) {
        SimplePop.alert("试题分值要大于0");
    }
    else {
        //alert('成功！');
        //alert(JsonSTSingleValue.MYQUESTION_ID + " | " + Editor_Type_Value + " | " + Editor_Ability_Value + " | " + Editor_Difficulty_Value + " | " + Editor_Score_Value);
        $.ajax({
            type: "get",
            url: "/zujuan/UpdateQuestionAttribute",
            data: { tId: JsonSTSingleValue.MYQUESTION_ID, qType: Editor_Type_Value, qAbility: Editor_Ability_Value, qDifficulty: Editor_Difficulty_Value, qScore: Editor_Score_Value },
            async: false,
            success: function (data) {
                SimplePop.alert(data);
            },
            error: function (data) {
                SimplePop.alert("未获取到数据，请稍候再访问！");
            }
        });
    } 
}

function setEditorContent(content, select, title) {
    //alert(title);
    var questionId = getQueryString("tId");
    //alert(questionId + " | " + content + " | " + select + " | " + title);
    var localHref = window.location.href.toString().substring(0, window.location.href.toString().lastIndexOf("/"));
    //alert(localHref);
    location.href = localHref + "/editorPage?tId=" + questionId + "&qType=" + content + "&select=" + select + "&title=" + escape(title) + "";
}
