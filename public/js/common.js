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