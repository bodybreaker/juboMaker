var btn = $('#startBtn');

console.log("localStorage.start >> " +localStorage.start)

if(localStorage.start == undefined){
    localStorage.start = false;
}


if(localStorage.jubo == undefined){
    var jubo ={
        "articles":[]
    };
    
    localStorage.jubo = JSON.stringify(jubo);
}

console.log("localStorage.jubo >> " +localStorage.jubo)


if(localStorage.start == "true"){
    btn.html("기사 스크랩 종료");
    btn.attr('class','btn btn-danger btn-block');
}else if(localStorage.start == "false"){
    btn.html("기사 스크랩 시작");
    btn.attr('class','btn btn-success btn-block');
}


btn.on("click", function () {
    if (localStorage.start == "false") {

        // 기사 한개 추가
        j = JSON.parse(localStorage.jubo)
        j.articles.push({
            "list":[]
        });
        localStorage.jubo = JSON.stringify(j);

        var date = prompt('기사 일자 입력', '02.08'); 
        alert(date);
        
        console.log("기사 일자 >> " + date);

        $("#articleDate").css("display", "none");
        btn.html("기사 스크랩 종료");
        btn.attr('class','btn btn-danger btn-block');
        localStorage.start = true;

    } else if (localStorage.start == "true") {

        btn.html("기사 스크랩 시작");
        btn.attr('class','btn btn-success btn-block');
        localStorage.start = false;
    }
});

$('tbody').sortable();

// 백그라운드 서비스에서 메세지 받을때
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        alert('test');
        if(request["isImageLogo"]==true){
            alert('이미지 로고');
        }
        
        
        console.log("from backgroud >> "+JSON.stringify(request));
        
        j = JSON.parse(localStorage.jubo)
        j.articles[j.articles.length-1].list.push(request);
        localStorage.jubo = JSON.stringify(j);
        
        sendResponse("");
    }
);





