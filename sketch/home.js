let background = document.getElementById('bg');
let body = document.querySelector('body');
let h1 = document.querySelector('h1');
let bookmarks = document.querySelector('#bookmarks');
let para = document.getElementById('title');
let list = document.querySelector('ul');
let container = document.querySelector('.container');
let form = document.querySelector('form');
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
            background.style.scale = 1.1;
            background.style.rotate = '2deg';
        }
    });
    list.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('link')) {
            para.style.scale = 0;
            background.style.backdropFilter = 'blur(1px) brightness(0.5)';
            background.style.scale = 1;
            background.style.rotate = '0deg';
        }
    });
    }

function textanimate (word) {
    let iterations = 0;
    const duration = 250 / word.length;

    //if the new word is the same as the old one, do nothing
    // if (text.innerText === word) return;

    clearInterval(interval);

    interval = setInterval(() => {
        h1.innerText = h1.innerText
        .split("")
        .map((_,index) => {
        if(index < iterations){
            return word[index];
        } else if (index === 2){
            return ':';
        }

        let final = numbers[Math.floor(Math.random() * 10)];

        return final;

        })
        .join("");
        iterations += 0.25;
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
        unsplash();
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
    //replace '1' with your prefered bookmark folder id
    chrome.bookmarks.getSubTree('1', function(bookmarks) {
        // console.log(bookmarks);
        icons = fetchBookmarkIcons(bookmarks);
        process_bookmark(bookmarks,icons);
    });
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
            //fallback icon (broken atm)
            icons[bookmarks[0].children.indexOf(bookmark)] = 'https://images.vexels.com/media/users/3/223055/isolated/lists/eb3fcec56c95c2eb7ded9201e51550a2-bookmark-icon-flat.png';
        }
    });
    return icons;
}

function process_bookmark(bookmarks,icons) {
    //process bookmarks and display them inside html
    list.innerHTML = bookmarks[0].children.map(bookmark => {
        return `<li data-title="${bookmark.title}"><a href="${bookmark.url}" data-title="${bookmark.title}" class="link"><img src="${icons[bookmarks[0].children.indexOf(bookmark)]}" class="link" data-title="${bookmark.title}"></a></li>`;
    }
    ).join('');

}

function welcomeAnimation() {
    //welcome animation
    bookmarks.style.bottom = '0px';
    background.style.transition = 'all 1s ease-in-out';
    background.style.filter = 'blur(0px) brightness(0.5)';
}

function getProvider() {
    //ask user for provider (unsplash or pexels) or use default (unsplash)
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

function timeRequest() {
    //update time
    h1.innerText = time();
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log('form submitted');
    //read and set grid size
    let gridSizeX = form.elements.gridSize.value;
    list.style.gridTemplateColumns = `repeat(${gridSizeX}, 1fr)`;
    chrome.storage.local.set({'gridSizeX': gridSizeX}, function() {
    });
    //read and set provider
    let providerGot = form.elements.provider.value;
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
    //exit edit mode
    editMode();
});


function editMode() {
    //edit mode
    // body.style.classList.add('edit');
    //add or remove "edit" class to the body to toggle edit mode
    if (container.classList.contains('edit')) {
        container.classList.remove('edit');
        background.classList.remove('edit');
        h1.classList.remove('edit');
    } else {
        container.classList.add('edit');
        background.classList.add('edit');
        h1.classList.add('edit');
        //set form grid size input to current grid size
        chrome.storage.local.get('gridSizeX', function(data) {
            form.elements.gridSize.value = data.gridSizeX;
        });
        //set form provider input to current provider
        chrome.storage.local.get('provider', function(data) {
            form.elements.provider.value = data.provider;
        });

    }
}

//enter edit mode when pressing 'e'
document.addEventListener('keydown', (e) => {
    if (e.key === 'e') {
        editMode();
    }
} );

//

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
    setTimeout(welcomeAnimation, 500);
    
    // console.log('randomWallpaper()');
    //update time once 5 seconds
    // textanimate('00:00');
    textanimate(time());
    setInterval(timeRequest, 5000);
    
    bookmarkTitle();

});
