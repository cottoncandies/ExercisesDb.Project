var paperScore = null;//试卷点数
var paperId = 0;
var v_jsLayer; //弹出层页面必须定义

$(document).ready(function () {
    v_jsLayer = new JSLayer();
    v_jsLayer.showJSLayer("数据加载中...");
    setTimeout(function () {
        myLoadSJYLFun();
    }, 50);
});

function myLoadSJYLFun() {
    //初始化试卷中心
    // lookWord();
    loadMyQuestionBasket(); //加载试题篮方法
    //注册下载点击事件
    regDownLoadClick();
    v_jsLayer.dropJSLayer();//关闭弹出层
}

function getPaperScore(paperId) {
    $.ajax({
        type: "get",
        url: "/MyPaperList/getDownLoadData",
        data: {pId: paperId},
        async: false,
        success: function (data) {
            if (data == "试卷没有试题") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else {
                returnPaperScore(data.returnValue, data.mScore, data.pScore, data.prompt, data.paperFormat);
            }
        },
        error: function (data) {
            v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
        }
    });
}

function regDownLoadClick() {

    $("#showPaperSetPage").on("click", function myfunction() {
        //先不下载 先设置试卷格式 打开设置时间格式层
        $.ajax({
            type: "get",
            url: "/MyPaperList/getPaperSetting",
            data: {paperId: paperId},
            async: false,
            success: function (data) {
                if (data.result == 0) {
                    $("input[name='PaperTitle'][value='" + data.data.title + "']").attr("checked", true);
                    $("input[name='PaperInfo'][value='" + data.data.paperInfo + "']").attr("checked", true);
                    $("input[name='ExamineeInput'][value='" + data.data.inputInfo + "']").attr("checked", true);
                    $("input[name='StatisticalScore'][value='" + data.data.tongfen + "']").attr("checked", true);
                    $("input[name='MarkScore'][value='" + data.data.pingfen + "']").attr("checked", true);
                    $("input[name='AnswerAnalysis'][value='" + data.data.answer + "']").attr("checked", true);
                    $("input[name='PaperScore'][value='" + data.data.defen + "']").attr("checked", true);
                    $("input[name='PaperFormat'][value='" + data.data.fileKind + "']").attr("checked", true);
                    $("input[name='PaperSize'][value='" + data.data.pageSize + "']").attr("checked", true);
                } else if (data.result == -1) {
                    v_jsLayer.tipForTime(data.reason, 1000);
                }
            },
            error: function (data) {
                v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
            }
        });
        $("#aOpen").trigger("click");
    });

    $("#yulan").on("click", function myfunction() {
        v_jsLayer.showJSLayer("下载中...");
        $.ajax({
            type: "get",
            url: "/MyPaperList/findLocalPaper",
            data: {pId: paperId},
            success: function (data) {
                if (data.result == -1) {
                    genWord(myPaperId, "试卷");
                } else {
                    downLoadFile(paperId, "/MyPaperList/DownLoadPaper");
                    v_jsLayer.tipForTime("试卷下载成功", 1000);
                }
            }
        });
        // downloadWord(myPaperId, "试卷");
    });

    $("#submitPaperSetInfo").on("click", function myfunction() {
        deleteQuestionsAndQuestionType()

        v_jsLayer.showJSLayer("提交设置中...");
        var questionType = getQuesSetClass();
        $("form").serializeArray();
        var quesSet = JSON.stringify(questionType);

        if (myPaperId > 0 && quesSet.length > 0) {
            $.ajax({
                type: "post",
                url: "/MyPaperList/setWordPaperFormatServer",
                data: {"pId": myPaperId, "paperFormat": quesSet},
                async: false,
                success: function (data) {
                    if (data.result == -1) {
                        v_jsLayer.dropJSLayer();
                        v_jsLayer.tipForTime(data.reason, 1000);
                    }
                    else if (data.result == 0) {
                        $(".modal_close").trigger("click");
                        if (!isBas) {
                            myLoadZJZXFun();
                            genPaper(myPaperId);
                        } else {
                            // genPaper(myPaperId);
                            change_paper_type();
                        }
                    }
                },
                error: function (data) {
                    v_jsLayer.tipForTime("未获取到数据，请添加后再访问！", 1000);
                }
            });
        }
    });
}

function genWord(paperId, type) {
    $.ajax({
        type: "get",
        url: "/MyPaperList/getDownLoadPaper",
        data: {pId: paperId},
        success: function (data) {
            if (data.result == -1) {
                v_jsLayer.dropJSLayer();
                v_jsLayer.tipForTime("试卷下载失败！", 1000);
            } else if (data.result == 0) {
                downLoadFile(paperId, "/MyPaperList/DownLoadPaper");
                v_jsLayer.dropJSLayer();
                v_jsLayer.tipForTime("试卷下载成功！", 1000);
            }
        },
        error: function (data) {
            v_jsLayer.dropJSLayer();
            v_jsLayer.tipForTime("下载失败！", 1000);
        }
    });
}

function genPaper(paperId) {
    $.ajax({
        type: "get",
        url: "/MyPaperList/getDownLoadPaper",
        data: {pId: paperId},
        success: function (data) {
            if (data.result == -1) {
                v_jsLayer.dropJSLayer();
                v_jsLayer.tipForTime("设置成功！", 1000);
            } else if (data.result == 0) {
                v_jsLayer.dropJSLayer();
                v_jsLayer.tipForTime("设置成功！", 1000);
            }
        },
        error: function (data) {
            v_jsLayer.dropJSLayer();
            v_jsLayer.tipForTime("设置成功！", 1000);
        }
    });
}

function downLoadFile(pId, filePath) {
    var form = $('#downLoadForm');
    if (form.length <= 0) {//没有form  才创建
        form = $("<form>");
        form.attr('id', 'downLoadForm');
        form.attr('style', 'display:none');
        //form.attr('target', '');
        form.attr('method', 'post');
        $('body').append(form);
    }
    form = $('#downLoadForm');
    form.attr('action', filePath);
    form.empty();
    // //创建参数的 hidden 值
    // if (datas && typeof (datas) == 'object') {
    //     for (var item in datas) {
    //         var $_input = $('<input>');
    //         $_input.attr('type', 'hidden');
    //         $_input.attr('name', item);
    //         $_input.val(datas[item]);
    //         $_input.appendTo(form);
    //     }
    // }
    var $_inputUrl = $('<input>');
    $_inputUrl.attr('type', 'hidden');
    $_inputUrl.attr('name', "pId");
    $_inputUrl.val(pId);
    $_inputUrl.appendTo(form);
    var $_inputName = $('<input>');
    $_inputName.attr('type', 'hidden');
    $_inputName.attr('name', "fileName");
    $_inputName.val();
    $_inputName.appendTo(form);
    form.submit();
    var downTime = $("#" + pId + "").find("td:eq(3)").text();
    $("#" + pId + "").find("td:eq(3)").text(parseInt(downTime) + 1);

    // var form = $("<form>"); //定义一个form表单
    // form.attr("style", "display:none");
    // form.attr("target", "");
    // form.attr("method", "post");
    // form.attr("action", "DownFile");
    // var input1 = $("<input>");
    // input1.attr("type", "hidden");
    // input1.attr("name", "exportData");
    // input1.attr("value", (new Date()).getMilliseconds());
    // $("body").append(form); //将表单放置在web中
    // form.append(input1);
    // form.submit(); //表单提交

}

