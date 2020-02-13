function moveTo(path, isFile) {
    if (isFile) Cookies.set(cookieName, encodeURIComponent(path));
    Cookies.set('filter', encodeURIComponent($('#txtFilter').val()))
    window.location.href = path;
}


function copyToClip(path, ele) {
    var fullPath = window.location.origin + path;
    var t = document.createElement("input");
    t.style.opacity = 0;
    document.body.appendChild(t);
    t.value = fullPath;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);

    $(ele).addClass('copied')
}


function deleteFile(path, fileName) {
    var isDelete = confirm(fileName + '을 삭제하시겠습니까?');
    if(isDelete){
        $.ajax({
            url: '/__file/delete',
            data: { 
                fileName: fileName,
                path: path,
            },
            method: 'POST',
            success: function (data) {
                if(data.errorMsg){
                    alert(data.errorMsg);
                }else{
                    window.location.reload();
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
}

function changeName(path, fileName) {
    var newFileName = prompt("변경할 파일 이름을 입력해주세요", fileName);
    console.log(newFileName);
    $.ajax({
        url: '/__file/rename',
        data: { 
            fileName: fileName,
            path: path,
            newFileName: newFileName,
        },
        method: 'POST',
        success: function (data) {
            if(data.errorMsg){
                alert(data.errorMsg);
            }else{
                window.location.reload();
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

}
