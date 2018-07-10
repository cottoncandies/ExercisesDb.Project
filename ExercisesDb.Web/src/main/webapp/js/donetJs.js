///获取远程文件列表
var ajax = new Ajax();

function donet_listRemoatFileById(v_id) {
    v_jsLayer.showJSLayer();
    //ajax.remoatCall('/Beike/listRemoatFile', 'filePath=' + v_path, js_listRemoatFile);
    ajax.remoatCall('/Beike/listRemoatFileById', 'fileCode=' + v_id, js_listRemoatFile);
}


function donet_openFile(v_json) {
    v_jsLayer.showJSLayer();
    if (v_json.fileCode.startWith("D_")) {//打开文件夹
        donet_listRemoatFileById(v_json.fileCode);
    } else if (v_json.fileCode.startWith("F_")) {//下载文件
        if (v_json.cost > 0) {//扣费后下载
            /*if (confirm("下载该资源需要扣除 " + v_json.cost + " 点贝壳，是否继续下载？")) {
                ajax.remoatCall('/Beike/dealCost', 'fileCode=' + v_json.fileCode, function (v_retMes) {
                    v_retMes = eval("(" + v_retMes + ")");
                    if (v_retMes.code == "1") {
                        donet_downHttpFile(v_json.remoatKey,v_json.fileName);
                    } else {
                        v_jsLayer.tipForTime(v_retMes.message, 1200);
                    }
                });
            } else {
                v_jsLayer.dropJSLayer();
            }*/

            v_jsLayer.dropJSLayer();
            SimplePop.confirm('下载该资源需要扣除 ' + v_json.cost + ' 点贝壳，是否继续下载？', {
                type: "confirm",
                confirm: function () {
                    v_jsLayer.showJSLayer();
                    ajax.remoatCall('/Beike/dealCost', 'fileCode=' + v_json.fileCode, function (v_retMes) {
                        v_retMes = eval("(" + v_retMes + ")");
                        if (v_retMes.code == "1") {
                            donet_downHttpFile(v_json.remoatKey, v_json.fileName);
                        } else {
                            v_jsLayer.tipForTime(v_retMes.message, 1200);
                        }
                    });
                }
            });

        } else {
            donet_downFile(v_json);
        }
    }
}

//下载文件入口
function donet_downFile(v_json) {
    if (v_json.fileType == "0") {
        v_jsLayer.tipForTime("文件夹不支持下载！", 1200);
        return;
    }
    if (v_json.remoatKey.startWith("tiantibeike:")) {//阿里云下载
        donet_downAliFile(v_json);
    } else {//直接http下载
        donet_downHttpFile(v_json.remoatKey, v_json.fileName);
    }
}

//下载文件入口
function donet_downFileCost(v_json) {
    if (v_json.fileType == "0") {
        v_jsLayer.tipForTime("文件夹不支持下载！", 1200);
        return;
    }
    if (v_json.cost > 0) {//扣费后下载
        v_jsLayer.dropJSLayer();
        SimplePop.confirm('下载该资源需要扣除 ' + v_json.cost + ' 点贝壳，是否继续下载？', {
            type: "confirm",
            confirm: function () {
                v_jsLayer.showJSLayer();
                ajax.remoatCall('/Beike/dealCost', 'fileCode=' + v_json.fileCode, function (v_retMes) {
                    v_retMes = eval("(" + v_retMes + ")");
                    if (v_retMes.code == "1") {
                        donet_downHttpFile(v_json.remoatKey, v_json.fileName);
                    } else {
                        v_jsLayer.tipForTime(v_retMes.message, 1200);
                    }
                });
            }
        });

    } else {
        donet_downFile(v_json);
    }
}

//下载阿里云文件
function donet_downAliFile(v_json) {
    ajax.remoatCall('/Beike/downAliFile', 'fileCode=' + v_json.fileCode,
        function (v_retMes) {
            v_retMes = eval("(" + v_retMes + ")");
            if (v_retMes.code == "1") {
                //donet_downHttpFile(v_retMes.httpPath, v_json.fileName);
                document.location.href = "DownFile?http=" + v_retMes.httpPath + "&fileName=" + v_json.fileName;
                v_jsLayer.dropJSLayer();
            } else {
                v_jsLayer.tipForTime(v_retMes.httpPath, 1200);
            }
        });
}

///下载http文件
function donet_downHttpFile(v_http, v_name) {
    v_jsLayer.dropJSLayer();
    //window.open(v_http);

    /*var v_a = document.getElementById("downA");
    v_a.href = v_http;
    if (v_name == null || v_name == undefined) {
        v_name = "未命名";
    }
    v_a.download = v_name;
    v_a.click(); return;*/
    //ajax.remoatCall('http://localhost:12345/Beike/DownFile', 'http=' + v_http + "&fileName=" + v_name, function (v_json) { alert("xiazaiwenjian:" + v_json); });
    document.location.href = v_http + "&fn=" + v_name;
    //window.open("http://localhost:12345/Beike/DownFile?http=http://school.e12.com.cn/wyxUpload/20150626/20150626635709263296788006.ppt&fileName=121212.ppt");
    //document.location.href = "/Beike/DownFile?http="+v_http+"&fileName="+v_name;
    //document.getElementsByName("http")[0].value = v_http;
    //document.getElementsByName("fileName")[0].value = v_name; alert(1);
    //document.getElementById("downForm").submit();
    //v_http = v_http.replace("//", "/download.aspx?d=");
    //v_http += "&fn=" + v_name;
    //document.location.href = v_http;
    // alert(v_http+"<><>"+v_name);
    //v_jsLayer.tipForTime(v_http+"<><>"+v_name,3000);
}

//
function donet_createFile(v_arr) {
    v_jsLayer.showJSLayer();
    ajax.remoatCall('/Beike/createFolderOrFile', 'fileName=' + v_arr[1] + "&fileType=" + v_arr[2] + "&docType=" + v_arr[3] + "&folderPath=" + v_arr[4] + "&folderId=" + v_arr[5], js_createFile);
}

//批量删除文件
function donet_deleteFile(v_arr) {
    v_jsLayer.showJSLayer();
    if (v_arr != null && v_arr.length > 0) {
        /*if (confirm("删除后，对应文件的分享也会被取消，是否继续？")) {
            var v_fileCodes = "";
            for (var i = 0; i < v_arr.length; i++) {
                v_fileCodes += ("|" + v_arr[i]);
            }
            v_fileCodes = v_fileCodes.substring(1);
            ajax.remoatCall('/Beike/deleteFiles', 'fileCodes=' + v_fileCodes, js_deleteFileCodeArr);
        } else {
            v_jsLayer.dropJSLayer();
        }*/

        v_jsLayer.dropJSLayer();
        SimplePop.confirm('删除后，对应文件的分享也会被取消，是否继续？', {
            type: "confirm",
            confirm: function () {
                v_jsLayer.showJSLayer();
                var v_fileCodes = "";
                for (var i = 0; i < v_arr.length; i++) {
                    v_fileCodes += ("|" + v_arr[i]);
                }
                v_fileCodes = v_fileCodes.substring(1);
                ajax.remoatCall('/Beike/deleteFiles', 'fileCodes=' + v_fileCodes, js_deleteFileCodeArr);
            }
        });

    } else {
        v_jsLayer.tipForTime("请选择需要删除的文件", 1000);
    }
}

//批量分享
function donet_shareFile(v_arr) {
    if (v_arr != null && v_arr.length > 0) {
        var v_fileCodes = "";
        for (var i = 0; i < v_arr.length; i++) {
            v_fileCodes += ("|" + v_arr[i]);
        }
        v_fileCodes = v_fileCodes.substring(1);
        ajax.remoatCall('/Beike/shareFiles', 'fileCodes=' + v_fileCodes, function (v_retMes) {
            v_retMes = eval("(" + v_retMes + ")");
            v_jsLayer.tipForTime(v_retMes.msg, 2000);
        });
    } else {
        v_jsLayer.tipForTime("请选择需要分享的文件", 20000);
    }
}

//批量取消分享
function donet_cancelShare(v_arr) {
    if (v_arr != null && v_arr.length > 0) {
        var v_fileCodes = "";
        for (var i = 0; i < v_arr.length; i++) {
            v_fileCodes += ("|" + v_arr[i]);
        }
        v_fileCodes = v_fileCodes.substring(1);
        ajax.remoatCall('/Beike/cancelShare', 'fileCodes=' + v_fileCodes, js_deleteFileCodeArr);
    } else {
        v_jsLayer.tipForTime("请选择需要分享的文件", 1000);
    }
}

//学案、教案...列表
function donet_getFileByType(v_type) {
    v_jsLayer.showJSLayer();
    ajax.remoatCall('/Beike/getFileByType', 'typeCode=' + v_type, function (v_retMes) {
        v_retMes = eval("(" + v_retMes + ")");
        if (v_retMes.code == "1") {
            js_listRemoatFile(v_retMes.data);
        } else {
            v_jsLayer.tipForTime(v_retMes.msg, 1200);
        }
        v_jsLayer.dropJSLayer();
    });
}

//分享列表
function donet_ShareList(v_folderCode) {
    v_jsLayer.showJSLayer();
    ajax.remoatCall('/Beike/shareList', 'folderCode=' + v_folderCode, js_listRemoatFile);
}

//回收站列表
function donet_RecycleList(v_arr) {
    v_jsLayer.showJSLayer();
    ajax.remoatCall('/Beike/recycleList', '', js_listRemoatFile);
}

//恢复文件
function donet_recoverFile(v_arr) {
    v_jsLayer.showJSLayer();
    if (v_arr != null && v_arr.length > 0) {
        var v_fileCodes = "";
        for (var i = 0; i < v_arr.length; i++) {
            v_fileCodes += ("|" + v_arr[i]);
        }
        v_fileCodes = v_fileCodes.substring(1);
        ajax.remoatCall('/Beike/recoverFile', 'fileCodes=' + v_fileCodes, js_deleteFileCodeArr);
    } else {
        v_jsLayer.tipForTime("请选择需要还原的文件", 1200);
    }
}

//彻底文件
function donet_destroyFile(v_arr) {
    v_jsLayer.showJSLayer();
    if (v_arr != null && v_arr.length > 0) {
        var v_fileCodes = "";
        for (var i = 0; i < v_arr.length; i++) {
            v_fileCodes += ("|" + v_arr[i]);
        }
        v_fileCodes = v_fileCodes.substring(1);
        ajax.remoatCall('/Beike/destroyFile', 'fileCodes=' + v_fileCodes, js_deleteFileCodeArr);
    } else {
        v_jsLayer.tipForTime("请选择需要还原的文件", 1200);
    }
}

//文件/文件夹重命名
function donet_renameFile(v_json, v_arr) {
    v_jsLayer.showJSLayer();
    ajax.remoatCall('/Beike/renameFile', 'fileCode=' + v_arr[0] + "&fileName=" + v_arr[1], function (v_retMes) {
        v_retMes = eval("(" + v_retMes + ")");
        if (v_retMes.code == "1") {
            js_createOrModifyFileName(v_retMes.data);
        } else {
            js_createOrModifyFileName(v_json);
        }
        v_jsLayer.tipForTime(v_retMes.msg, 1200);
    });
    //js_createOrModifyFileName(v_json);
}

//修改学科学段
function donet_updateXueKeDuan(v_xueduan, v_xueke, v_xuekeName) {
    v_jsLayer.showJSLayer();
    ajax.remoatCall('/login/setExamVersion', 'section=' + v_xueduan + "&xueke=" + v_xueke + "&subject=" + v_xuekeName, function (v_retMes) {
        v_retMes = eval("(" + v_retMes + ")");
        v_jsLayer.tipForTime(v_retMes.msg, 1200);
        setTimeout(function () {
            location.reload();
        }, 1200);
    });
}

//修改个人信息
function donet_updateInformation(v_realname, v_email, v_mobile) {
    v_jsLayer.showJSLayer();
    ajax.remoatCall('/User/updateInformation', 'realname=' + v_realname + "&email=" + v_email + "&mobile=" + v_mobile, function (v_retMes) {
        v_retMes = eval("(" + v_retMes + ")");
        v_jsLayer.tipForTime(v_retMes.msg, 1200);
    });
}

//更改密码
function donet_updatePassword(v_passwordOld, v_passwordNew) {
    v_jsLayer.showJSLayer();
    ajax.remoatCall('/User/updatePassword', 'passwordOld=' + v_passwordOld + "&passwordNew=" + v_passwordNew, function (v_retMes) {
        v_retMes = eval("(" + v_retMes + ")");
        v_jsLayer.tipForTime(v_retMes.msg, 1200);
        if (v_retMes.code == "1") {
            document.getElementById("addAll").value = "";
            document.getElementById("addAll2").value = "";
            document.getElementById("addAll3").value = "";
        }
    });
}

//提交用户反馈
function donet_saveFankui(v_arr) {
    v_jsLayer.showJSLayer();
    ajax.remoatCall('/User/saveFankui', 'title=' + v_arr[0] + "&desc=" + v_arr[1] + "&mobile=" + v_arr[2] + "&email=" + v_arr[3], function (v_retMes) {
        v_retMes = eval("(" + v_retMes + ")");
        js_saveFankui(v_retMes);
        /*v_jsLayer.tipForTime(v_retMes.msg, 1200);
        if (v_retMes.code == "1") {
            document.getElementById("addAll").value = "";
            document.getElementById("addAll2").value = "";
            document.getElementById("addAll3").value = "";
            document.getElementById("addAll3").value = "";
        }*/
    });
}