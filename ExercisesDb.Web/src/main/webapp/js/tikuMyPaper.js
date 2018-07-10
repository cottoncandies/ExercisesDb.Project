var documentWidth = 1022;
var paperId = 0;
var strSection;
var strSubject;
var ss;

var v_jsLayer; //弹出层页面必须定义

$(document).ready(function () {
    v_jsLayer = new JSLayer();
    v_jsLayer.showJSLayer("数据加载中...");
    documentWidth = $(document).width();
    myLoadWDZJFun();
    //}
});
var userId;

function myLoadWDZJFun() {
    userId = $('#userId').val();
//加载第一页数据
    $.ajax({
        type: "post",
        url: "/MyPaperList/findAllMyPaper",
        data: {"pageNum": 1, "userId": userId},
        success: function (data) {
            if (data == "获取数据失败") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else if (data == "暂无数据") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else {
                strSection = data.strSection;
                strSubject = data.strSubject;
                ss = strSection + strSubject;
                setViewSectionAndSubject(strSection, strSubject);
                getMyPaperPaging(data.returnVal, data.pageContent, data.strPageHTML, data.stCount);
            }
        },
        error: function (data) {
            $("#paperCount").html(0);
            v_jsLayer.tipForTime("未获取到数据，请添加后再访问！", 1000);
        }
    });
    loadMyQuestionBasket(); //加载试题篮方法

}

function getMyPaperPaging(returnVal, pageContent, strPageHTML, stCount) {
    //alert(pageContent + " | " + strPageHTML + " | " + stCount);
    if (returnVal == "成功") {
        var html = [];
        if (stCount > 0) {
            html.push("<table width=\"98%\" border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" class=\"table_1\">");
            html.push("<tr>");
            html.push("<th width=\"30%\">试卷标题</th>");
            html.push("<th width=\"7%\">学段</th>");
            html.push("<th width=\"7%\">学科</th>");
            html.push("<th width=\"7%\">下载次数</th>");
            html.push("<th width=\"15%\">完成日期</th>");
            html.push("<th width=\"30%\">操作</th>");
            html.push("</tr>");
            var dataValue = pageContent;
            //alert(typeof(dataValue));
            if (dataValue != null && dataValue.length > 0) {
                $.each(dataValue, function (i, data) {
                    html.push("<tr id=" + data.ng_id + ">");
                    var paperTitleSub = data.sz_caption;
                    //                    if (documentWidth > 1100) {
                    //                        if (paperTitleSub.length > 40) {
                    //                            paperTitleSub = paperTitleSub.substring(0, 40) + "...";
                    //                        }
                    //                    }
                    //                    else {
                    //                        if (paperTitleSub.length > 20) {
                    //                            paperTitleSub = paperTitleSub.substring(0, 20) + "...";
                    //                        }
                    //                    }
                    html.push("<td><a href=\"myLook.html?type=2&paperId=" + data.ng_id + "\" title=\"" + data.sz_caption + "\" >" + paperTitleSub + "</a></td>");
                    if (data.nt_section == 1) {
                        html.push("<td>小学</td>");
                    }
                    else if (data.nt_section == 2) {
                        html.push("<td>初中</td>");
                    }
                    else if (data.nt_section == 3) {
                        html.push("<td>高中</td>");
                    } else {
                        html.push("<td>" + data.nt_section + "</td>");
                    }

                    html.push("<td>" + data.subjectName + "</td>");
                    html.push("<td>" + data.nt_download_times + "</td>");
                    //alert(data.SAVE_TIME);
                    //var mydate = new Date(data.PAPER_SAVETIME); // 默认原始数据时间格式
                    //var mydate = data.PAPER_SAVETIME; // 默认原始数据时间格式
                    //var date = dt.formatDateTime("yyyy-MM-dd hh:mm:ss"); // 默认中国标准时间    12小时制
                    //var date = mydate.pattern("yyyy-MM-dd hh:mm:ss"); // 国际标准时间   24小时制
                    // var date = data.PAPER_SAVETIME.replace("T", " ");
                    // if (date.indexOf(".") > 0) {
                    //     date = date.substring(0, date.indexOf("."));
                    // }
                    html.push("<td>" + data.ts_finished + "</td>");
                    html.push("<td>");
                    html.push("<a href=\"#\" class=\"buto ar\" style='display: none'>AR试卷</a>");
                    html.push("<a href=\"myLook.html?type=2&paperId=" + data.ng_id + "&section=" + ss + "\" class=\"buto yulan\">编辑</a> ");
                    html.push("<a href=\"javascript:;\" id=\"down" + data.ng_id + "\" class=\"buto xizai\" onclick=\"downloadWord(" + data.ng_id + ");\">下载</a> ");
                    //html.push(" <a style='display: none' href=\""+data.ng_id+"\" class=\"buto\" ><button  id=\"downloadPaper" + data.ng_id + "\"></button></a> ");
                    //html.push(" <a href=\"/MyPaperList/DownLoadKey/"+data.ng_id+"\" id=\"downKey" + data.ng_id + "\" class=\"buto xizai\" onclick='returnDownLoadWord("+ data.ng_id +",'答案')'>下载答案</a> ");
                    html.push("<a href=\"javascript:;\" id=\"downKey" + data.ng_id + "\" style='display: none' class=\"buto xizai\">下载答案</a> ");
                    html.push("<a href=\"javascript:deleteWord(" + data.ng_id + ");\" class=\"buto\">删除</a> ");
                    html.push("</td>");
                    html.push("</tr>");
                });
            }
            html.push("</table>");
        }
        $("#paperListContent").empty().html(html.join(""));
        //$(".pagebox").html(strPageHTML);
        $("#pageingNum").html(strPageHTML);
        $("#paperCount").html(stCount);
    }
    else {
        v_jsLayer.tipForTime(returnVal, 1000);
        //alert('出现此提示是未联网或程序出错\n如确认已联网，请联系客服解决！');
    }
    v_jsLayer.dropJSLayer(); //关闭弹出层
}

//设置分页代码
function stPaging(pageNum) {
    //alert(pageNum);
    //只有点击分页时才给页码赋值
    v_jsLayer.showJSLayer("数据加载中..."); //显示弹出层
    setTimeout(function () {
        setMyPaperToPaging(pageNum);
    }, 50);
}

//再次加载分页页面
function setMyPaperToPaging(pageNum) {
    $.ajax({
        type: "get",
        url: "/MyPaperList/findAllMyPaper",
        data: {"pageNum": pageNum, "userId": userId},
        async: false,
        success: function (data) {
            //alert(data);
            if (data == "获取数据失败") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else if (data == "暂无数据") {
                v_jsLayer.tipForTime(data, 1000);
            }
            else {
                var jData = eval(data);
                //alert(jData);
                getMyPaperPaging(data.returnVal, data.pageContent, data.strPageHTML, data.stCount);
            }
        },
        error: function (data) {
            $("#paperCount").html(0);
            v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
        }
    });
}

function downloadWord(paperId) {
    downloadPaper(paperId);
}

function downloadPaper(paperId) {
    v_jsLayer.showJSLayer("下载中...");
    $.ajax({
        type: "get",
        url: "/MyPaperList/findLocalPaper",
        data: {pId: paperId},
        success: function (data) {
            if (data.result == -1) {
                generatePaper(paperId);
            } else {
                downLoadFile(paperId, "/MyPaperList/DownLoadPaper");
                v_jsLayer.tipForTime("试卷下载成功", 1000);
            }
        }
    });
}

function generatePaper(paperId) {
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

function deleteWord(paperId) {
    SimplePop.confirm("确定要删除这份试卷吗？", {
        type: "confirm",
        confirm: function () {
            $.ajax({
                type: "get",
                url: "/MyPaperList/delMyPaper",
                data: {pId: paperId},
                async: false,
                success: function (data) {
                    if (data.result == -1) {
                        v_jsLayer.tipForTime(data.reason, 1000);
                    }
                    else {
                        returnDeleteWord(data.result);
                    }
                },
                error: function (data) {
                    v_jsLayer.tipForTime("未获取到数据，请稍候再访问！", 1000);
                }
            });
        },
        cancel: function () {

        }
    });
}

//接收删除试卷返回值
function returnDeleteWord(returnValue) {
    if (returnValue == 0) {
        v_jsLayer.tipForTime("删除试卷成功", 1000);
        myLoadWDZJFun();
    }
    else {
        v_jsLayer.tipForTime("删除试卷失败", 1000);
    }
}

function downLoadFile(pId, filePath) {
    //alert(fileUrl + " | " + fileName);
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
    //        //创建参数的 hidden 值
    //        if (datas && typeof (datas) == 'object') {
    //            for (var item in datas) {
    //                var $_input = $('<input>');
    //                $_input.attr('type', 'hidden');
    //                $_input.attr('name', item);
    //                $_input.val(datas[item]);
    //                $_input.appendTo(form);
    //            }
    //        }
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

    //    var form = $("<form>"); //定义一个form表单
    //    form.attr("style", "display:none");
    //    form.attr("target", "");
    //    form.attr("method", "post");
    //    form.attr("action", "DownFile");
    //    var input1 = $("<input>");
    //    input1.attr("type", "hidden");
    //    input1.attr("name", "exportData");
    //    input1.attr("value", (new Date()).getMilliseconds());
    //    $("body").append(form); //将表单放置在web中
    //    form.append(input1);
    //    form.submit(); //表单提交 

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
