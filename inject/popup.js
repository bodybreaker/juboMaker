var table = $("#foo-table").removeAttr('width').DataTable({
    paging: false,
    searching: false,
    fixedColumns: true,
    bInfo: false,
    columnDefs: [
        { "width": "50", "targets": 0 }
    ]
});


$('#foo-tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
    }
    else {
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

$('#button').click(function () {
    var idx = table.row('.selected').index()
    deleteRow(idx);
    table.row('.selected').remove().draw(false);

});


$('#jsonBT').click(function () {

    textData = JSON.parse(localStorage.jubo);

    startDT = $("#startDT").val();
    endDT = $("#endDT").val();
    console.log("시작일자>> "+startDT);
    console.log("종료일자>> "+endDT);


    textData.week_start_date = startDT;
    textData.week_end_date = endDT;


    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(textData)));
    element.setAttribute('download', "data.json");
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
      
});



var btn = $('#startBtn');

console.log("localStorage.start >> " + localStorage.start)

if (localStorage.start == undefined) {
    localStorage.start = false;
}


if (localStorage.jubo == undefined) {
    var jubo = {
        "articles": []
    };

    localStorage.jubo = JSON.stringify(jubo);
}

console.log("localStorage.jubo >> " + localStorage.jubo)



if (localStorage.start == "true") {
    btn.html("기사 스크랩 종료");
    btn.attr('class', 'btn btn-danger');
} else if (localStorage.start == "false") {
    btn.html("기사 스크랩 시작");
    btn.attr('class', 'btn btn-success');
}

settingData();

btn.on("click", function () {
    if (localStorage.start == "false") {

        // 기사 한개 추가
        j = JSON.parse(localStorage.jubo)
        j.articles.push({
            "list": []
        });
        localStorage.jubo = JSON.stringify(j);

        var date = prompt('기사 일자 입력', '02.08');
        alert(date);

        console.log("기사 일자 >> " + date);

        $("#articleDate").css("display", "none");
        btn.html("기사 스크랩 종료");
        btn.attr('class', 'btn btn-danger');
        localStorage.start = true;
        setBackgroundValue({ "start": true });

    } else if (localStorage.start == "true") {


        btn.html("기사 스크랩 시작");
        btn.attr('class', 'btn btn-success');
        localStorage.start = false;
        setBackgroundValue({ "start": false });

        // 종료 하였을때 데이터 세팅
        settingData();
    }
});


// 백그라운드 서비스에서 메세지 받을때
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if(request.isCapture==true){
            return;
        }
        console.log("from backgroud >> " + JSON.stringify(request));

        j = JSON.parse(localStorage.jubo)
        j.articles[j.articles.length - 1].list.push(request);
        localStorage.jubo = JSON.stringify(j);

        sendResponse("");
    }
);


var closeBT = $('#closeBT');

closeBT.on("click", function () {
    document.getElementById("mySidebar").remove();
});



function settingData() {
    table.clear().draw();
    j = JSON.parse(localStorage.jubo);
    articleArr = j.articles;

    console.log(articleArr);

    articleArr.forEach(function (data) {


        logo = "";
        title = "";

        list = data.list;

        list.forEach(function (el) {
            console.log(el);

            //console.log(el.title);

            if (el.title != "undefined" && el.title != undefined) {
                console.log("기사제목 >> " + el.title);
                title = el.title;
            }
            if (el.imageLogo != "undefined" && el.imageLogo != undefined) {
                console.log("신문사로고>>" + el.imageLogo);
                logo = el.imageLogo;

            }
        })

        imgsrc = "<img src='" + logo + "'width='100'/>"

        table.row.add([
            imgsrc, title
        ]).draw(false);
        // if(logo!="" && title!=""){
        //     table.row.add([
        //         imgsrc,title
        //     ]).draw(false);
        // }
    })
}


function deleteRow(index) {
    console.log("삭제 >> " + index);
    if (index != "undefined" && index != undefined) {
        j = JSON.parse(localStorage.jubo);
        articleArr = j.articles;
        articleArr.splice(index, 1)

        j.articles = articleArr;
        localStorage.jubo = JSON.stringify(j);
        console.log(JSON.stringify(j));
    }
}


function setBackgroundValue(data) {
    chrome.runtime.sendMessage(data, function (res) {
        console.log("rcv > " + res);
    });

}

// captuere.js 로 메시지 받기 위함
function receiveMessage(event){
    console.log("capturer.js 로 부터 메시지");

    if(event.data.type=="captureData"){

        imageLogoData = {"imageLogo":event.data.data};

        j = JSON.parse(localStorage.jubo);
        j.articles[j.articles.length - 1].list.push(imageLogoData);
        localStorage.jubo = JSON.stringify(j);
    }
}


// captuere.js 로 메시지 받기 위함
window.addEventListener("message",receiveMessage,false);

