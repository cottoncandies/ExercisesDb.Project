document.oncontextmenu = new Function("event.returnValue=false");
document.onselectstart = new Function("event.returnValue=false");

var editorContent = "";
var oCKeditor_st;

(function () {
    //让指定标签显示编辑器内容
    oCKeditor_st = CKEDITOR.replace('TextArea_st');
})();

$(document).ready(function () {
    //alert('编辑器加载完毕，调用浏览器方法！');
    var questionId = getQueryString("tId");
    var qTypeValue = getQueryString("qType");
    var select = getQueryString("select");
    var title = getQueryString("title");

    $(".topnavh a").each(function () {
        if (select == $(this).attr("id")) {
            $(this).attr("class", "tips");
        }
        else {
            $(this).attr("class", "");
        }
    });

    $("#btnSure").val("修改" + title);
    loadData(questionId, qTypeValue);
});

function loadData(questionId, qTypeValue) {
    //alert(questionId + " | " + qTypeValue);
    $.ajax({
        type: "get",
        url: "/zujuan/loadQuestionToEditor",
        data: { tId: questionId, qType: qTypeValue },
        async: false,
        success: function (data) {
            if (data == "参数错误") {
                SimplePop.alert(data);
            }
            else if (data == "暂无数据") {
                SimplePop.alert(data);
            }
            else {
                //alert(data);
                setQuestionInfoToEdit(data);
            }
        },
        error: function (data) {
            SimplePop.alert("未获取到数据，请稍候再访问！");
        }
    });
}

function setQuestionInfoToEdit(stData) {
    //alert(typeof (stData) + " | " + stData);
    //var questionId = getQueryString("tId");
    if (typeof (stData) == "string") {
        editorContent = stData;
    }
    else {
        editorContent = eval(stData);
    }
    oCKeditor_st.setData(editorContent);
}

function getQuestionInfoForEdit() {
    var title = getQueryString("title");
    var questionId = getQueryString("tId");
    var qTypeValue = getQueryString("qType");
    var newStData = oCKeditor_st.getData();
    //alert(questionId + " | " + qTypeValue + " | " + newStData);
    if (title == "试题内容" && newStData.length == 0) {
        SimplePop.alert("试题内容不能为空！");
    }
    else {
        if (editorContent != newStData) {
            $.ajax({
                type: "post",
                url: "/zujuan/updateQuestionForEditor",
                data: { tId: questionId, qType: qTypeValue, content: newStData },
                async: false,
                success: function (data) {
                    SimplePop.alert(data);
                },
                error: function (data) {
                    SimplePop.alert("未获取到数据，请稍候再访问！");
                }
            });
        }
        else {
            SimplePop.alert("没有编辑内容");
        }
    } 
}

function setEditorContent(qType, select, title) {
    //根据aId 设置 a标签样式
    var questionId = getQueryString("tId");
    var localHref = window.location.href.toString().substring(0, window.location.href.toString().lastIndexOf("/"));
    location.href = "editorPage?tId=" + questionId + "&qType=" + qType + "&select=" + select + "&title=" + escape(title) + "";
}

function setEditorAttribute() {
    var questionId = getQueryString("tId");
    var localHref = window.location.href.toString().substring(0, window.location.href.toString().lastIndexOf("/"));
    location.href = localHref + "/attrPage?tId=" + questionId;
}
