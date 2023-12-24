let background = document.getElementById('bg');
let body = document.querySelector('body');
let h1 = document.querySelector('h1');
let bookmarks = document.querySelector('#bookmarks');
let para = document.getElementById('title');
let list = document.querySelector('ul');
const numbers = "0123456789";
let interval = null;
var provider;

let previousImageUrl = '';
h1.style.opacity = 1;

function bookmarkTitle() {
    //display bookmark title on hover from data-title onto the para
    list.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('link')) {
            para.style.scale = 1;
            para.innerHTML = e.target.dataset.title;
            background.style.backdropFilter = 'blur(0px) brightness(0.2)';
            // background.style.scale = 1.1;
            // background.style.rotate = '2deg';
        }
    });
    list.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('link')) {
            para.style.scale = 0;
            background.style.backdropFilter = 'blur(1px) brightness(0.5)';
            // background.style.scale = 1;
            // background.style.rotate = '0deg';
        }
    });
    }

    function textanimate (word) {
        let iterations = 0;
        const duration = 500 / word.length;

        //if the new word is the same as the old one, do nothing
        // if (text.innerText === word) return;

        clearInterval(interval);

        interval = setInterval(() => {
            h1.innerText = h1.innerText
            .split("")
            .map((_,index) => {
            if(index < iterations){
                return word[index];
            }

            let final = numbers[Math.floor(Math.random() * 10)];

            return final;

        })
        .join("");
        iterations += 1;
        // console.log('textanimate()');
        if(h1.innerText === word){
            //stop the function
            clearInterval(interval);
        }
    } , duration);
}

function getImg(provider) {
    console.log('got provider :' + provider)
    //get image from provider
    if (provider === 'unsplash') {
        unsplash();
    } else if (provider === 'pexels') {
        pexels();
    } else {
        // unsplash();
    }
}

function unsplash() {
    console.log('Using unsplash api');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.unsplash.com/photos/random?client_id=fcx0TMO2LYjLO2oAWgMfp4l2w1d6IXSNVW9ORaamji0');
    xhr.onload = function() {
    if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var image = response.urls.regular;
            //save image to local storage
            chrome.storage.local.set({'image': image}, function() {
                // console.log('saved image', image);
            });
        } 
    };
    xhr.send();
}

function pexels() {
    console.log('Using pexels api');
    let api = 'INB1uHU6THskPr6OnPO7sqW7Yaf9QPFecSDsc8AHf0KT7Tp9zmWuK6uW';
    let url = `https://api.pexels.com/v1/curated?per_page=1&page=${Math.floor(Math.random() * 10) + 1}`;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', api);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            let imageUrl = response.photos[0].src.original;
            //save image to local storage
            chrome.storage.local.set({'image': imageUrl}, function() {
                // console.log('saved image', imageUrl);
            });
        }
    };
    xhr.send();
}


function randomWallpaper() {
    console.log('randomWallpaper() got provider :' + provider);
    //get image from local storage

    chrome.storage.local.get('image', function(data) {
        let imageUrl = data.image;
        background.style.backgroundImage = `url(${imageUrl})`;
    });
    background.style.backdropFilter = 'blur(30px) brightness(0)';
    getImg(provider);
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
    let icons = [];
    //get bookmarks
    // chrome.bookmarks.getTree(function(bookmark3) {
    //     // process_bookmark(bookmark3);
    //     console.log(bookmark3);
    // });
    chrome.bookmarks.getSubTree('1', function(bookmarks) {
        // console.log(bookmarks);
        icons = fetchBookmarkIcons(bookmarks);
        process_bookmark(bookmarks,icons);
    });
    //bookmarks apears animated
    bookmarks.style.scale = 1;
    bookmarks.style.opacity = 1;
}


function fetchBookmarkIcons(bookmarks) {
    //fetch icons for bookmarks
    let icons = [];
    bookmarks[0].children.forEach(bookmark => {
        try {
            icons.push('https://s2.googleusercontent.com/s2/favicons?domain_url=' + bookmark.url + '&sz=256');
        } catch (error) {
            icons[bookmarks[0].children.indexOf(bookmark)] = 'https://images.vexels.com/media/users/3/223055/isolated/lists/eb3fcec56c95c2eb7ded9201e51550a2-bookmark-icon-flat.png';
        }
    });
    // console.log(icons);
    return icons;
}


function process_bookmark(bookmarks,icons) {
    list.innerHTML = bookmarks[0].children.map(bookmark => {
        return `<li data-title="${bookmark.title}"><a href="${bookmark.url}" data-title="${bookmark.title}" class="link"><img src="${icons[bookmarks[0].children.indexOf(bookmark)]}" class="link" data-title="${bookmark.title}"></a></li>`;
    }
    ).join('');
}

function addBrightness() {
    bookmarks.style.scale = 1;
    background.style.transition = 'all 1s ease-in-out';
    background.style.filter = 'blur(0px) brightness(0.5)';
    // background.style.backdropFilter = 'blur(0px) brightness(0.8)';
}

function updateTime() {
    //update time once 5 seconds
    // textanimate('00:00');
    h1.innerHTML = time();
}

function getProvider() {
    let providerGot = prompt('Enter provider (Default: unsplash)');
    console.log(providerGot);
    if (providerGot === 'unsplash') {
        chrome.storage.local.set({'provider': providerGot}, function() {
            console.log('saved provider', providerGot);
        });
    } else if (providerGot === 'pexels') {
        chrome.storage.local.set({'provider': providerGot}, function() {
            console.log('saved provider', providerGot);
        });
    } else {
        chrome.storage.local.set({'provider': 'unsplash'}, function() {
            console.log('saved default provider', 'unsplash');
        });
    }
    return providerGot;
}

function gridSize() {
    //ask user for grid size
    let gridSizeX = prompt('Enter grid size in columns (Default: 8)');
    list.style.gridTemplateColumns = `repeat(${gridSizeX}, 1fr)`;
    //save grid size to local storage
    chrome.storage.local.set({'gridSizeX': gridSizeX}, function() {
        // console.log('saved gridSizeX', gridSizeX);
    });
    getProvider();
}

//listen for middle mouse click on background
background.addEventListener('auxclick', (e) => {
    if (e.button === 1) {
        // console.log('middle mouse click');
        gridSize();
    }    
});

//start the script after the page loads
document.addEventListener('DOMContentLoaded', function() {
    //try to read grid size from local storage or ask user for input
    try {
        chrome.storage.local.get('gridSizeX', function(data) {
            console.log('grid size : ',data.gridSizeX);
            let gridSizeX = data.gridSizeX;
            list.style.gridTemplateColumns = `repeat(${gridSizeX}, 1fr)`;
        });
    } catch (error) {
        gridSize();
    }

    //try to read provider from local storage or ask user for input
    try {
        chrome.storage.local.get('provider', function(data) {
            console.log('provider from storage : ',data.provider);
            provider = data.provider;
        });
    } catch (error) {
        provider = getProvider();
    }

    bookmarkList();
    setTimeout(
        randomWallpaper,
        1000
    )
    setTimeout(addBrightness, 500);
    
    // console.log('randomWallpaper()');
    //update time once 5 seconds
    // textanimate('00:00');
    textanimate(time());
    setInterval(updateTime , 5000);
    
    bookmarkTitle();

});
