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

$('#foo-tbody').on('dblclick', 'tr', function () {
    var rowData = table.row(this).data();
    window.open(rowData[2]);//로고 , 제목 , url
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
    
    $.ajax({
        type: 'POST',
        url:"http://localhost:3000/up",
        data: JSON.stringify(textData),
        xhr:function(){// Seems like the only way to get access to the xhr object
            var xhr = new XMLHttpRequest();
            xhr.responseType= 'blob'
            return xhr;
        },
        contentType: "application/json",
        success: function(data, textStatus, xhr) {

            var binaryData = [];
            binaryData.push(data);
            console.log(data);
            
            var element = document.createElement('a');
            //element.href=window.URL.createObjectURL(binaryData);
            element.href=window.URL.createObjectURL(new Blob(binaryData,{ type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }))

            element.setAttribute('download', "out.docx");
            //element.setAttribute('download');
            element.style.display = 'none';


            document.body.appendChild(element);
            
            element.click();
            
            document.body.removeChild(element);
         }
    });




    // var element = document.createElement('a');
    // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(textData)));
    // element.setAttribute('download', "data.json");
    
    // element.style.display = 'none';
    // document.body.appendChild(element);
    
    // element.click();
    
    // document.body.removeChild(element);
      
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
        

        var date = prompt('기사 일자 입력', '02.08');
        alert(date);
        var publisher = prompt('신문사명', '');
        alert(publisher);

        console.log("기사 일자 >> " + date);

        j.articles[j.articles.length - 1].list.push(
            {"publisher" : publisher}
        );
        j.articles[j.articles.length - 1].list.push(
            {"date" : date}
        );

        localStorage.jubo = JSON.stringify(j);

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

        articleArr = j.articles[j.articles.length-1].list;
        articleArr.push(request);

        console.log("request ★★★★★★★★★★ ");

        console.log(JSON.stringify(request));


        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            currentURL = tabs[0].url;
            console.log("현재 탭 URL >>" + currentURL);

            var hasURL = articleArr.findIndex(function(el){
                return el.url;
            });

            if(hasURL == -1){
                articleArr.push({
                    "url":currentURL
                });
            }
            console.log(hasURL);
            localStorage.jubo = JSON.stringify(j);
        });

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
        url = "";


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
            if (el.url != "undefined" && el.url != undefined) {
                console.log("신문사로고>>" + el.url);
                url = el.url;
            }            
        })

        imgsrc = "<img src='" + logo + "'width='100'/>";
        
        table.row.add([
            imgsrc, title,url
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



/**
 * 서버에 요청하여 파일을 다운로드 한다. (Chrome, Firefox, IE11 테스트 완료)
 * @param reqObj 요청정보 -  {
 *     url: 'url',          (required)
 *     method: 'GET|POST',  (optional - default:post)
 *     data: {              (optional)
 *         key1: value,
 *         key2: value
 *     }
 * }
 */
 function requestDownloadFile(reqObj) {
    if (!reqObj || !reqObj.url) {
        return;
    }
 
    var isGetMethod = reqObj.method && reqObj.method.toUpperCase() === 'GET';
    $.ajax({
        url: reqObj.url,
        method: isGetMethod ? 'GET' : 'POST',
        xhrFields: {
            responseType: 'arraybuffer'
        },
        data: $.param(reqObj.data) // a=1&b=2&c=3 방식
        // data: JSON.stringify(reqObj.data) // {a:1, b:2, c:3} JSON 방식
 
    }).done(function(data, textStatus, jqXhr) {
        if (!data) {
            return;
        }
        try {
            var blob = new Blob([data], { type: jqXhr.getResponseHeader('content-type') });
            var fileName = getFileName(jqXhr.getResponseHeader('content-disposition'));
            fileName = decodeURI(fileName);
 
            if (window.navigator.msSaveOrOpenBlob) { // IE 10+
                window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else { // not IE
                var link = document.createElement('a');
                var url = window.URL.createObjectURL(blob);
                link.href = url;
                link.target = '_self';
                if (fileName) link.download = fileName;
                document.body.append(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (e) {
            console.error(e)
        }
    });
}
function getFileName (contentDisposition) {
    var fileName = contentDisposition
        .split(';')
        .filter(function(ele) {
            return ele.indexOf('filename') > -1
        })
        .map(function(ele) {
            return ele
                .replace(/"/g, '')
                .split('=')[1]
        });
    return fileName[0] ? fileName[0] : null
}
