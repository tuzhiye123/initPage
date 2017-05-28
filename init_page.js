//pageshow 初始化jpush
$(document).on("pageshow", "#init-page", initPageShowEvent);
function initPageShowEvent(event) {
    console.log("---init-page-initPageShowEvent----");
    InitFunctions.initPageInitJpush();
}

//如果关闭程序,此时有推送通知,则回change到init-page或者login-page,此时需要关闭原先的通知popup,否则打不开下次的通知popup
$(document).on("pagehide", "#init-page", initPageHideEvent);
function initPageHideEvent(event) {
    console.log("---init-page-initPageHideEvent----");
    var oldPopupDiv = $("#init-page").find("#notification_popup_div");
    if(oldPopupDiv){
        //先把上次打开的popup close
        oldPopupDiv.popup("close");
        //再移除
        oldPopupDiv.remove();
    }
}

var InitFunctions = {

    initPageInitJpush:function(){

        window.setTimeout(function(){
            //初始化jpush
            window.plugins.jPushPlugin.init();
        }, 200);

        //收到推送信息触发事件
        document.addEventListener("jpush.receiveNotification", function (event) {

            var alertContent;
            if(device.platform == "Android") {
                alertContent = event.alert;
            } else {
                alertContent = event.aps.alert;
            }
            alert("receiveNotification:" + alertContent);

            //创建popup
            InitFunctions.createNotificationPopup();
            InitFunctions.showPopupBtnWithText("2","您有代办消息");
            //设置popup
            InitFunctions.setNotificationPopup();

        }, false);

        //后台收到推送通知 for ios
        document.addEventListener("jpush.backgroundNotification", function(event){

            var alertContent;
            alertContent = event.aps.alert;
            alert("open Notificaiton:" + alertContent);
        }, false);

        //打开推送消息触发事件
        document.addEventListener("jpush.openNotification", function (event) {

            var alertContent;
            if(device.platform == "Android") {
                alertContent = event.alert;
            } else {
                alertContent = event.aps.alert;
            }
            alert("open Notificaiton:" + alertContent);

        }, false);
    },

    createNotificationPopup:function(){

        //add the data-dismissible="false" attribute to the popup to prevent the click-outside-to-close behavior so people need to interact with popup buttons to close it.
        var popupDiv = '<div data-role="popup" data-dismissible="false" data-overlay-theme="b" id="notification_popup_div" data-theme="a" style="min-width: 240px;">'+
            '<h4 style="text-align: center;">推送通知</h4>'+
            '<h4  id="noti_popup_content"style="font-weight: normal;text-align: center;white-space: normal;word-break: break-all;"></h4>'+
            '<table width="100%" cellspacing="0" style="border-top: 1px solid #e8e8e8;">'+
            '<tr class="noti_tr1" style="display: none;">'+
            '<td colspan="2" style="text-align: center;"><div id="noti_ok" style="color: #38c;padding: 10px;font-size: 16px;font-weight: 800;">OK</div></td>'+
            '</tr>'+
            '<tr class="noti_tr2">'+
            '<td width="50%" style="text-align: center;border-right: 1px solid #e8e8e8;"><div id="noti_cancel" style="color: #38c;padding: 10px;font-size: 16px;font-weight: 800;">稍后</div></td>'+
            '<td width="50%" style="text-align: center;"><div id="noti_confirm" style="color: #38c;padding: 10px;font-size: 16px;font-weight: 800;">去查看</div></td>'+
            '</tr>'+
            '</table>'+
            '</div>';

        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");

        var oldPopupDiv = $(activePage).find("#notification_popup_div");
        if(oldPopupDiv){
            //先把上次打开的popup close
            oldPopupDiv.popup("close");
            //再移除
            oldPopupDiv.remove();
        }
        //dynamiclly add popup to activePage
        $(popupDiv).appendTo(activePage).popup();
    },

    setNotificationPopup:function(){

        //append popup id string
        var notiPopupIdString = "#notification_popup_div";

        //这里需要setTimeout,不然不能打开popup,估计是jquery mobile里面的机制问题,有一定的延时才可以打开,在其他情况也是一样,不能close popup,马上再打开popup,有一定延时
        window.setTimeout(function(){
            $(notiPopupIdString).popup("open");
            //set max-width
            $(notiPopupIdString).parent().css("max-width","80%");
            //get screen width
            var screenWidth = window.screen.width;//不含"px"
            var popupWidthP = $(notiPopupIdString).parent().css("width");//含"px"
            var popupWidthPNum = popupWidthP.replace("px","");
            var left = (parseFloat(screenWidth)/2 - parseFloat(popupWidthPNum)/2) + 'px';
            //设置left
            $(notiPopupIdString).parent().css("left",left);
            //修改popup的遮罩层的bottom,会有1px的bottom
            $(".ui-popup-screen").css("bottom","0");
        },200);

        //bindEvent
        $("#noti_confirm").off().on("click",function(){
            //关闭
            $(notiPopupIdString).popup("close");
            //移除popup
            $(notiPopupIdString).remove();
        });

        $("#noti_cancel").off().on("click",function(){
            $(notiPopupIdString).popup("close");
            //移除popup
            $(notiPopupIdString).remove();
        });

        $("#noti_ok").off().on("click",function(){
            $(notiPopupIdString).popup("close");
            //移除popup
            $(notiPopupIdString).remove();
        });
    },

    //显示popup的btn数量和content text
    showPopupBtnWithText:function(btnNum,text){

        if(btnNum == "1"){
            $(".noti_tr1").show();
            $(".noti_tr2").hide();

        }else{
            $(".noti_tr1").hide();
            $(".noti_tr2").show();
        }
        $("#noti_popup_content").text(text);
    }
};







