
$(document).ready(function () {
    getUserName();
    $("#logoutButton").live("click", function myfunction() {
        eoWebBrowser.extInvoke("logout");
    });
});

function getUserName() {
    eoWebBrowser.extInvoke("getUserName");
}

function returnGetUserName(telePhone) {
    $("#myTelePhone").text(telePhone);
}

function setUserLoginOut() {
    eoWebBrowser.extInvoke("logout");
}
