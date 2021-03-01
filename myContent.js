function injectJs(srcFile) {
    console.log(srcFile);
    var scr = document.createElement('iframe');
    scr.setAttribute("id", "mySidebar")
    var style = `position: fixed;
    right: 0;
    top: 0 !important;
    height: 0% !important;
    width: 0px;
    z-index: 2147483647 !important;
    border: none !important;
    opacity: 1.0 !important;
    left: auto;
    display: none !important;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 10px 0px !important;
    `

    scr.setAttribute("style",style)
    scr.src = srcFile;
    document.getElementsByTagName('body')[0].appendChild(scr);
}

$(document).ready(
    function () {
        //inject!!
        // console.log("이미지 로고! @#W@A");


        //     style = `
        //     selection {
        //         position: absolute;
        //         z-index: 99999999999999;
        //         background: #e0eaf1;
        //         border: 1px solid #0c65a5;
        //     }
            
        //     selection.complete {
        //             z-index: 99999999999999;
        //         background: #E0F1E4;
        //         border-color: #0CA50E;
        //     }`

        //     document.getElementsByTagName('body')[0].setAttribute("style",style)

            
            

        //     var scr = document.createElement('script');
        //     scr.src =chrome.runtime.getURL('inject/capture.js')
        //     document.getElementsByTagName('body')[0].appendChild(scr);


            //return;
        injectJs(chrome.runtime.getURL('inject/popup.html'));
    }
);
// 백그라운드 서비스에서 메세지 받을때
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        
        if (request["isImageLogo"] == true) {
            console.log("이미지 로고! @#W@A");


            style = `
            selection {
                position: absolute;
                z-index: 99999999999999;
                background: #e0eaf1;
                border: 1px solid #0c65a5;
            }
            
            selection.complete {
                    z-index: 99999999999999;
                background: #E0F1E4;
                border-color: #0CA50E;
            }`

            document.getElementsByTagName('body')[0].setAttribute("style",style)

            
            

            var scr = document.createElement('script');
            scr.src =chrome.runtime.getURL('inject/capture.js')
            document.getElementsByTagName('body')[0].appendChild(scr);


            return;
        }
        sendResponse("");
    }
);





