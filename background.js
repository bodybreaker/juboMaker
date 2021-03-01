
var imgLogoData;


chrome.action.onClicked.addListener(function (tab) {
    console.log(tab);

    var c = `if(document.getElementById("mySidebar").style.display=="none"){document.getElementById("mySidebar").setAttribute("style","position: fixed;right: 0;top: 0 !important;height: 100% !important;width: 400px;z-index: 2147483647 !important;border: 0 !important;opacity: 1.0 !important;left: auto;display: block !important;box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 10px 0px !important;")}else if(document.getElementById("mySidebar").style.display=="block"){document.getElementById('mySidebar').setAttribute("style","position: fixed; right: 0; top: 0 !important; height: 0% !important; width: 0px; z-index: 2147483647 !important; border: none !important; opacity: 1.0 !important; left: auto; display: none !important; box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 10px 0px !important;")}`;

    chrome.tabs.executeScript(tab.id,{
        code: c
    });

});


var titleMenu =
{
    id: "title",
    title: "제목",
    contexts: ["selection"]
}

var subtitleMenu =
{
    id: "subtitle",
    title: "부제목",
    contexts: ["selection"]
}

var imageLogo =
{
    id: "imageLogo",
    title: "로고",
    contexts: ["image"]
}

var imageMenu =
{
    id: "image",
    title: "이미지",
    contexts: ["image"]
}
var imageDescMenu =
{
    id: "imageDesc",
    title: "이미지설명",
    contexts: ["selection"]
}

var contentMenu =
{
    id: "content",
    title: "내용",
    contexts: ["selection"]
}

chrome.contextMenus.create(titleMenu);
chrome.contextMenus.create(subtitleMenu);
chrome.contextMenus.create(imageMenu);
chrome.contextMenus.create(imageLogo);
chrome.contextMenus.create(imageDescMenu);
chrome.contextMenus.create(contentMenu);

chrome.contextMenus.onClicked.addListener(function (info, tab) {

    console.log(info);
    
    chrome.storage.sync.get(['start'], function(result) {

        if(result.start){
            menuID = info.menuItemId;

            data = {};
            if (info.menuItemId == "image") {
                data[menuID] = info.srcUrl;

            }else if(info.menuItemId == "imageLogo"){
                // 메인화면에 셀렉트 요청 메세지
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {"isImageLogo":true}, function(response) {
                      console.log(response);
                    });
                });

                console.log("[이미지로고] 탭 정보 >> "+tab);
                chrome.tabs.captureVisibleTab(function(image){
                    imgLogoData = image;
                    console.log(image);
                    

                    c = 'localStorage.tempLogoImg="'+imgLogoData+'"';
                    chrome.tabs.executeScript(tab.id,{
                        code: c
                    });
                });

                return;
            }
            else{
                data[menuID] = info.selectionText;
            }
            // active tab에만 보냄
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
                  console.log(response);
                });
            });
        
            // chrome.runtime.sendMessage(data, function(response) {
            //     console.log(response);
            // }); 

        }else{

            chrome.tabs.executeScript(tab.id,{
                code: "alert('시작후 선택')"
            });

        }

    });

   

});


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        
        console.log("background.js >> onMessage");
        // if(request.isCapture == true){
        //     console.log("캡쳐합니다ㅓ!!!");
        //     chrome.tabs.query( {
        //         // gets the window the user can currently see
        //         active: true, 
        //         currentWindow: true 
        //       },
        //       function (tabs) {
        //         chrome.tabs.captureVisibleTab( 
        //           chrome.windows.WINDOW_ID_CURRENT,
        //           function (src) {
        //             // displays a link to the image. Can be replaced by an alert() to 
        //             // verify the result is 'undefined'
        //             $('body').append("<a href='" + src + "'>" + tabs[0].url + "</a>");
        //           }
        //         ); 
        //       }
        //     );
        //     return;
        // }


        chrome.storage.sync.set(request, function() {
            console.log('Value is set to ' + JSON.stringify(request));
         });

        console.log("from front >> " + JSON.stringify(request));
        sendResponse("");
    }
);

