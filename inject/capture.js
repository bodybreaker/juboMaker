var start = {};
var end = {};
var isSelecting = false;

document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend",
    `<style>
#selection {
    position: absolute;
    z-index: 99999999999999;
    background: #e0eaf1;
    border: 1px solid #0c65a5;
}

#selection.complete {
    z-index: 99999999999999;
    background: #E0F1E4;
    border-color: #0CA50E;
}</style>`);


var div = document.createElement('div');
div.setAttribute("id", "selection")
document.getElementsByTagName('body')[0].appendChild(div)



function mouseDownEvt(event) {
        // Update our state
        isSelecting = true;
        div.classList.remove('complete');
        start.x = event.pageX;
        start.y = event.pageY;
    
        // Display data in UI
        //$('#start').text('(' + start.x + ',' + start.y + ')');
    
        // Add selection to screen
    
        // $('#selection').css({
        //     left: start.x,
        //     top: start.y
        // });
        console.log(start.x);
        document.getElementById('selection').style.left = start.x+"px"
        document.getElementById('selection').style.top = start.y+"px"
}

function mouseMoveEvt(event) {
    if (!isSelecting) { return; }

    end.x = event.pageX;
    end.y = event.pageY;
    //$('#selection').css({
        //         left: start.x < end.x ? start.x : end.x,
        //         top: start.y < end.y ? start.y : end.y,
        //         width: Math.abs(start.x - end.x),
        //         height: Math.abs(start.y - end.y)
        //     });
    document.getElementById('selection').style.left = start.x < end.x ? start.x : end.x+"px"
    document.getElementById('selection').style.top = start.y < end.y ? start.y : end.y+"px"
    document.getElementById('selection').style.width = Math.abs(start.x - end.x)+"px"
    document.getElementById('selection').style.height = Math.abs(start.y - end.y)+"px"
    
}

function mouseUpEvt(event) {
    isSelecting = false;

    div.classList.add('complete')

    console.log(end.x + ":" + end.y);

    document.getElementById('selection').style.left = start.x < end.x ? start.x : end.x+"px"
    document.getElementById('selection').style.top = start.y < end.y ? start.y : end.y+"px"
    document.getElementById('selection').style.width = Math.abs(start.x - end.x)+"px"
    document.getElementById('selection').style.height = Math.abs(start.y - end.y)+"px"
    

    // localStorage.tempLogoImg   (캡쳐된 이미지)
    
    img = new Image();
    img.src = localStorage.tempLogoImg; 

    img.onload = function() {
        console.log(img);
    
        console.log("원본 이미지 크기 >> width "+ img.width + " : height >> "+img.height);
    
    
        var startX = start.x;
        var startY = start.y;
        var capWidth = Math.abs(start.x - end.x)
        var capHeight = Math.abs(start.y - end.y);
     
        console.log("start X > "+startX);     
        console.log("start Y > "+startY);
        console.log("capWidth  > "+capWidth);
        console.log("capHeight > "+capHeight);
    
    
        var can = document.createElement("canvas")
        can.width = capWidth; 
        can.height = capHeight;
        ctx = can.getContext('2d');
        ctx.drawImage(img,startX,startY,capWidth,capHeight,0,0,capWidth,capHeight);
        
        croppedImage = can.toDataURL();
    
        console.log(croppedImage);

        deleteAllEventListener();
        div.style.display='none';


        //popup.js 에게 메세지보냄(데이터세팅)

        data = {
            "type":"captureData",
            "data":croppedImage

        };     
        document.getElementById("mySidebar").contentWindow.postMessage(data,'*');
        
    };
}

window.addEventListener('mousedown',mouseDownEvt)
window.addEventListener('mousemove',mouseMoveEvt)
window.addEventListener('mouseup', mouseUpEvt)

function deleteAllEventListener(){
    console.log("캡쳐끝");
    window.removeEventListener('mousedown',mouseDownEvt)
    window.removeEventListener('mousemove',mouseMoveEvt)
    window.removeEventListener('mouseup', mouseUpEvt)
}
