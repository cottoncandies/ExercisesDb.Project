
function getQuesSetClass() {
    var quesSet = new QuesSetClass();
    quesSet.nt_title_bar = $("#signup-paperFormat input[name='PaperTitle']:checked").val();
    quesSet.nt_info_bar = $("#signup-paperFormat input[name='PaperInfo']:checked").val();
    quesSet.nt_input_bar = $("#signup-paperFormat input[name='ExamineeInput']:checked").val();
    quesSet.nt_tongfen_bar = $("#signup-paperFormat input[name='StatisticalScore']:checked").val();
    quesSet.nt_pingfen_bar = $("#signup-paperFormat input[name='MarkScore']:checked").val();
    quesSet.nt_show_answer = $("#signup-paperFormat input[name='AnswerAnalysis']:checked").val();
    quesSet.nt_show_defen = $("#signup-paperFormat input[name='PaperScore']:checked").val();
    quesSet.nt_file_kind = $("#signup-paperFormat input[name='PaperFormat']:checked").val();
    quesSet.nt_page_size = $("#signup-paperFormat input[name='PaperSize']:checked").val();
    return quesSet;
}

function QuesSetClass() {
    this.nt_title_bar = "";
    this.nt_info_bar = "";
    this.nt_input_bar = "";
    this.nt_tongfen_bar = "";
    this.nt_pingfen_bar = "";
    this.nt_show_answer = "";
    this.nt_show_defen = "";
    this.nt_file_kind = "";
    this.nt_page_size = "";

    //    this.Notes = "";
    //    this.Notes = "";
}

function setQuesSetByJsonData(quesSetData) {
    if (quesSetData.nt_title_bar == "显示") {
        $("#signup-paperFormat input[name='PaperTitle'][value='1']").attr("checked", true);
    }
    else if (quesSetData.nt_style_bar == "不显示") {
        $("#signup-paperFormat input[name='PaperTitle'][value='2']").attr("checked", true);
    }
    if (quesSetData.nt_info_bar == "显示") {
        $("#signup-paperFormat input[name='PaperInfo'][value='1']").attr("checked", true);
    }
    else if (quesSetData.nt_info_bar == "不显示") {
        $("#signup-paperFormat input[name='PaperInfo'][ value='2']").attr("checked", true);
    }
    if (quesSetData.nt_input_bar == "显示") {
        $("#signup-paperFormat input[name='ExamineeInput'][value='1']").attr("checked", true);
    }
    else if (quesSetData.nt_input_bar == "不显示") {
        $("#signup-paperFormat input[name='ExamineeInput'][value='2']").attr("checked", true);
    }
    if (quesSetData.nt_tongfen_bar == "显示") {
        $("#signup-paperFormat input[name='StatisticalScore'][value='1']").attr("checked", true);
    }
    else if (quesSetData.nt_tongfen_bar == "不显示") {
        $("#signup-paperFormat input[name='StatisticalScore'][value='2']").attr("checked", true);
    }
    if (quesSetData.nt_pingfen_bar == "显示") {
        $("#signup-paperFormat input[name='MarkScore'][value='1']").attr("checked", true);
    }
    else if (quesSetData.nt_pingfen_bar == "不显示") {
        $("#signup-paperFormat input[name='MarkScore'][value='2']").attr("checked", true);
    }
    if (quesSetData.nt_show_answer == "显示") {
        $("#signup-paperFormat input[name='AnswerAnalysis'][value='1']").attr("checked", true);
    }
    else if (quesSetData.nt_show_answer == "不显示") {
        $("#signup-paperFormat input[name='AnswerAnalysis'][value='2']").attr("checked", true);
    }
    if (quesSetData.nt_show_defen == "显示") {
        $("#signup-paperFormat input[name='PaperScore'][value='1']").attr("checked", true);
    }
    else if (quesSetData.nt_show_defen == "不显示") {
        $("#signup-paperFormat input[name='PaperScore'][value='2']").attr("checked", true);
    }
    if (quesSetData.nt_file_kind == "Word") {
        $("#signup-paperFormat input[name='PaperFormat'][value='1']").attr("checked", true);
    }
    else if (quesSetData.nt_file_kind == "Pdf") {
        $("#signup-paperFormat input[name='PaperFormat'][value='2']").attr("checked", true);
    }
    if (quesSetData.nt_page_size == "A3") {
        $("#signup-paperFormat input[name='PaperSize'][value='1']").attr("checked", true);
    }
    else if (quesSetData.nt_page_size == "A4") {
        $("#signup-paperFormat input[name='PaperSize'][value='2']").attr("checked", true);
    }
}

function returnUpdatePaperFormat(returnVal, paperId) {
    if (returnVal == "成功") {
        $(".modal_close").trigger("click");
//        改为不刷新 直接在组卷中心 触发下载按钮
//        if (location.href.toLowerCase().indexOf("mylook") > 0) {
//            v_jsLayer.tipForTime('设置试卷格式成功,立即下载吧！', 1000);
//            location.href = location.href;
//        }
        if (location.href.toLowerCase().indexOf("mypaperlist") > 0) {
            //alert(location.href);
            //alert(paperId);
            $("#down" + paperId).trigger("click");
        }
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
    }
}



