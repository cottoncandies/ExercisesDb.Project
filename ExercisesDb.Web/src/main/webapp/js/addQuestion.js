var oCKeditor_stContent;
var oCKeditor_stAnswer;
var oCKeditor_stAnalytical;

!(function () {
    //让指定标签显示编辑器内容
    oCKeditor_stContent = CKEDITOR.replace('AddQuestionContent');
    oCKeditor_stAnswer = CKEDITOR.replace('AddQuestionAnswer');
    oCKeditor_stAnalytical = CKEDITOR.replace('AddQuestionAnalytical');
    loadQuestionAttrInfo();
    loadPageEvent();
})();

function loadQuestionAttrInfo() {
    $.ajax({
        type: "get",
        url: "/zujuan/getQuestionAttr",
        async: false,
        success: function (data) {
            if (data == "暂无数据") {
                SimplePop.alert(data);
            }
            else if (data == "获取数据失败") {
                SimplePop.alert(data);
            }
            else {
                var jData = eval(data);
                returnLoadQuestionAttrInfo(eval(jData[1]), eval(jData[2]), eval(jData[3]));
            }
        },
        error: function (data) {
            SimplePop.alert("未获取到数据，请稍候再访问！");
        }
    });
}

function returnLoadQuestionAttrInfo(jsonTX,jsonNL,jsonND) {
    //alert(typeof(jsonTX)+""+jsonNL+""+jsonND);
    var Editor_Type_HTML = ""; var Editor_Ability_HTML = ""; var Editor_Difficulty_HTML = "";
    Editor_Type_HTML += "<option value=\"请选择题型\">请选择题型</option>";
    $.each(eval(jsonTX), function () {
        Editor_Type_HTML += "<option value=" + this.题型属性 + ">" + this.题型属性 + "</option>";
    });
    Editor_Ability_HTML += "<option value=\"请选择考查能力\">请选择考查能力</option>";
    $.each(eval(jsonNL), function () {
        Editor_Ability_HTML += "<option value=" + this.考查能力 + ">" + this.考查能力 + "</option>";
    });
    Editor_Difficulty_HTML += "<option value=\"请选择难度\">请选择难度</option>";
    $.each(eval(jsonND), function (i, val) {
        Editor_Difficulty_HTML += "<option value=" + val + ">" + val + "</option>";
    });
    $("#Editor_Type").html(Editor_Type_HTML);
    $("#Editor_Ability").html(Editor_Ability_HTML);
    $("#Editor_Difficulty").html(Editor_Difficulty_HTML);
}

//添加试题信息
function addQuestionInfo() {
    var stContent = oCKeditor_stContent.getData();
    var stAnswer = oCKeditor_stAnswer.getData();
    var stAnalytical = oCKeditor_stAnalytical.getData();
    var stType = $("#Editor_Type").val();
    var stAbility = $("#Editor_Ability").val();
    var stDifficulty = $("#Editor_Difficulty").val();
    var stScore = $("#Editor_Score").val();
    //alert(stContent+" | "+stAnswer+" | "+stAnalytical+" | "+stType+" | "+stAbility+" | "+stDifficulty+" | "+stScore);
    if (stContent == null || stContent.length == 0) {
        SimplePop.alert("试题内容不能为空！");
    }
    else if (stType == "请选择题型") {
        SimplePop.alert("请选择题型");
    }
    else if (stAbility == "请选择考查能力") {
        SimplePop.alert("请选择考查能力");
    }
    else if (stDifficulty == "请选择难度") {
        SimplePop.alert("请选择难度");
    }
    else if (stScore == "" || stScore == null) {
        SimplePop.alert("请输入试题分值");
    }
    else if (parseFloat(stScore.trim()) <= 0) {
        SimplePop.alert("试题分值要大于0");
    }
    else {
        $.ajax({
            type: "post",
            url: "/zujuan/addMyQuestionInfo",
            data: { qContent: stContent, qAnswer: stAnswer, qAnalytical: stAnalytical, type: stType, ability: stAbility, difficulty: stDifficulty, score: stScore },
            async: false,
            success: function (data) {
                if (data == "成功") {
                    parent.location.reload(); //让父页面刷新
                }
                else {
                    SimplePop.alert(data);
                }
            },
            error: function (data) {
                SimplePop.alert("操作数据失败，请稍候再访问！");
            }
        });
    } 
}

function loadPageEvent() {
    $(document).on("click", ".topnavh a", function () {
        var aList = $(".topnavh a");
        //alert(aList.length);
        if (aList.length > 0) {
            $(".topnavh a").attr("class", "");
            $(this).attr("class", "tips");
//            for (var i = 0; i < length; i++) {
//                if (true) {

//                }
//                $(this).attr("class", "tips");
//            }
        }

    });

}

