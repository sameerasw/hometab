let body = document.querySelector('body');
let h1 = document.querySelector('h1');

let previousImageUrl = '';

function getImg() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.unsplash.com/photos/random?client_id=fcx0TMO2LYjLO2oAWgMfp4l2w1d6IXSNVW9ORaamji0');
    xhr.onload = function() {
    if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var image = response.urls.regular;
            //save image to local storage
            chrome.storage.local.set({'image': image}, function() {
                console.log('saved image', image);
            });
        } 
    };
    xhr.send();
}


function randomWallpaper() {
    //get image from local storage
    chrome.storage.local.get('image', function(data) {
        let imageUrl = data.image;
        body.style.backgroundImage = `url(${imageUrl})`;
    });
    getImg();
}

function time() {
    //get and display time in 12 hour format
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    hours = hours < 10 ? '0'+ hours : hours;
    let time = `${hours}:${minutes}`;
    h1.innerHTML = time;
}

randomWallpaper();
setInterval(time, 3000);
console.log('randomWallpaper()');

function process_bookmark(bookmarks) {

    for (var i =0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.url) {
            console.log("bookmark: "+ bookmark.title + " ~  " + bookmark.url);
        }

        if (bookmark.children) {
            process_bookmark(bookmark.children);
        }
    }
}

// chrome.browserAction.onClicked.addListener(function(tab) {
//   console.log("listing bookmarks: " );
//   chrome.bookmarks.getTree( process_bookmark );
// });