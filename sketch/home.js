let body = document.querySelector('body');
let h1 = document.querySelector('h1');
let bookmarks = document.querySelector('#bookmarks');
const numbers = "0123456789";
let interval = null;

let previousImageUrl = '';
h1.style.opacity = 1;

function textanimate (word) {
    let iterations = 0;
    const duration = 500 / word.length;

    //if the new word is the same as the old one, do nothing
    // if (text.innerText === word) return;

    clearInterval(interval);

    interval = setInterval(() => {
        h1.innerText = h1.innerText
        .split("")
        .map((number,index) => {
            if(index < iterations){
                return word[index];
            }

            let final = numbers[Math.floor(Math.random() * 10)];

            return final;

        })
        .join("");
        iterations += 1;
        console.log('textanimate()');
        if(h1.innerText === word){
            //stop the function
            clearInterval(interval);
        }
    } , duration);
}

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
    body.style.backdropFilter = 'blur(30px) brightness(0)';
    getImg();
}

function time() {
    //get and display time in 12 hour format
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    // let seconds = date.getSeconds();
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    hours = hours < 10 ? '0'+ hours : hours;
    let time = `${hours}:${minutes}`;
    return time;
}

function bookmarkList() {
    //get bookmarks
    chrome.bookmarks.getTree(function(bookmarks) {
        process_bookmark(bookmarks);
    });
}


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

function addBrightness() {
    body.style.transition = 'all 1s ease-in-out';
    body.style.backdropFilter = 'blur(0px) brightness(0.5)';
    // body.style.backdropFilter = 'blur(0px) brightness(0.8)';
}

function updateTime() {
    //update time once 5 seconds
    // textanimate('00:00');
    h1.innerHTML = time();
}

// bookmarkList();

//wait for page to load
randomWallpaper();
setTimeout(addBrightness, 500);

console.log('randomWallpaper()');
//update time once 5 seconds
// textanimate('00:00');
textanimate(time());
setInterval(updateTime , 5000);