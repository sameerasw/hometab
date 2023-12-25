let background = document.getElementById('bg');
let body = document.querySelector('body');
let h1 = document.querySelector('h1');
let bookmarks = document.querySelector('#bookmarks');
let para = document.getElementById('title');
let list = document.querySelector('ul');
let container = document.querySelector('.container');
let form = document.querySelector('form');
let folderFieldset = document.querySelector('#folderField');
const numbers = "0123456789";
let interval = null;
var provider;
var backgroundPaused;
var previousImage;
var unsplashAPI;
var pexelsAPI;

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
    // console.log('got provider :' + provider);
    //get image from provider
    if (provider === 'unsplash') {
        unsplash();
    } else if (provider === 'pexels') {
        pexels();
    } else {
        bing();
    }
}

function bing() {
    //get daily image from bing
    console.log('Using bing api');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US');
    xhr.onload = function() {
    if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var image = 'https://www.bing.com' + response.images[0].url;
            //save image to local storage
            chrome.storage.local.set({'image': image}, function() {
                // console.log('saved image', image);
            });
        } 
    }
}

function unsplash() {
    console.log('Using unsplash api');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.unsplash.com/photos/random?client_id=' + unsplashAPI);
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
    let api = pexelsAPI;
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
    // console.log('randomWallpaper() got provider :' + provider);
    //get image from local storage
    chrome.storage.local.get('image', function(data) {
        let imageUrl = data.image;
        //save it as previous image to local storage
        chrome.storage.local.set({'previousImage': imageUrl}, function() {
            // console.log('saved previousImage', imageUrl);
        } );
        //set background image to the image from local storage(use previous image if paused)
        if (backgroundPaused) {
            background.style.backgroundImage = data.image;
        } else {
            background.style.backgroundImage = `url(${imageUrl})`;
        }
    });
    background.style.backdropFilter = 'blur(30px) brightness(0)';
    //get img from provider if background is not paused
    if (!backgroundPaused) {
        getImg(provider);
    }
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
    chrome.bookmarks.getSubTree(bookmarksFolderId, function(bookmarks) {
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
    // console.log(providerGot);
    if (providerGot === 'unsplash') {
        chrome.storage.local.set({'provider': providerGot}, function() {
        });
    } else if (providerGot === 'pexels') {
        chrome.storage.local.set({'provider': providerGot}, function() {
        });
    } else {
        chrome.storage.local.set({'provider': 'bing'}, function() {
        });
    }
    console.log('saved provider', providerGot);
    return providerGot;
}

function timeRequest() {
    //update time and assignment
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
        });
    } else if (providerGot === 'pexels') {
        chrome.storage.local.set({'provider': providerGot}, function() {
        });
    } else {
        chrome.storage.local.set({'provider': 'bing'}, function() {
        });
    }
    console.log('saved provider', providerGot);
    //read and set bookmarks folder
    let bookmarksFolderId = form.elements.folder.value;
    chrome.storage.local.set({'bookmarksFolderId': bookmarksFolderId}, function() {
        console.log('saved bookmarksFolderId', bookmarksFolderId);
    });
    //get and update unsplash api key
    if (form.elements.unsplashKey.value) {
        unsplashAPI = form.elements.unsplashKey.value;
        chrome.storage.local.set({'unsplashAPI': unsplashAPI}, function() {
            // console.log('saved unsplashAPI', unsplashAPI);
        });
    } else {
        //clear api key if empty
        unsplashAPI = '';
        chrome.storage.local.set({'unsplashAPI': unsplashAPI}, function() {
            // console.log('saved unsplashAPI', unsplashAPI);
        });
    }
    //get and update pexels api key
    if (form.elements.pexelsKey.value) {
        pexelsAPI = form.elements.pexelsKey.value;
        chrome.storage.local.set({'pexelsAPI': pexelsAPI}, function() {
            // console.log('saved pexelsAPI', pexelsAPI);
        });
    } else {
        //clear api key if empty
        pexelsAPI = '';
        chrome.storage.local.set({'pexelsAPI': pexelsAPI}, function() {
            // console.log('saved pexelsAPI', pexelsAPI);
        });
    }
    //exit edit mode
    editMode();
});

form.addEventListener('reset', (e) => {
    //pause wallpaper updating
    pauseWallpaper();
});

function editMode() {
    //edit mode
    if (container.classList.contains('edit')) {
        container.classList.remove('edit');
        background.classList.remove('edit');
        h1.classList.remove('edit');
        //update everything
        bookmarkList();
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
        //load paused state
        if (backgroundPaused) {
            document.querySelector('#pause').value = '▶ Resume';
        } else {
            document.querySelector('#pause').value = '⏸ Pause';
        }
        //list bookmarks folder options
        chrome.bookmarks.getTree(function(bookmarks) {
            // console.log(bookmarks);
            let options = bookmarks[0].children.map(bookmark => {
                return `<option value="${bookmark.id}">${bookmark.title} , ${bookmark.id}</option>`;
            }
            ).join('');
            folderFieldset.innerHTML = `<label for="folder">Bookmarks folder</label><select name="folder" id="folder">${options}</select>`;
            form.elements.folder.value = bookmarksFolderId;
            // console.log('bookmarksFolderId : ', bookmarksFolderId);
        });
        //get and set unsplash api key
        chrome.storage.local.get('unsplashAPI', function(data) {
            if (data.unsplashAPI) {
                form.elements.unsplashKey.value = data.unsplashAPI;
            }
        });
        //get and set pexels api key
        chrome.storage.local.get('pexelsAPI', function(data) {
            if (data.pexelsAPI) {
                form.elements.pexelsKey.value = data.pexelsAPI;
            }
        });
    }
}

function pauseWallpaper() {
    //pause background
    if (backgroundPaused) {
        backgroundPaused = false;
        //save value to local storage
        chrome.storage.local.set({'backgroundPaused': backgroundPaused}, function() {
            // console.log('saved backgroundPaused', backgroundPaused);
        });
        document.querySelector('#pause').value = 'pause';
        //changeimage
        randomWallpaper();
    } else {
        backgroundPaused = true;
        //save value to local storage
        chrome.storage.local.set({'backgroundPaused': backgroundPaused}, function() {
            // console.log('saved backgroundPaused', backgroundPaused);
        });
        document.querySelector('#pause').value = 'play';
        //save the current background of the page to local storage
        chrome.storage.local.set({'image': background.style.backgroundImage}, function() {
            // console.log('saved image', background.style.backgroundImage);
        } );
    }
}

//enter edit mode with e key
document.addEventListener('keydown', function(e) {
    if (e.key === 'e') {
        editMode();
    }
});

//refreshbookmarks with r key
document.addEventListener('keydown', function(e) {
    if (e.key === 'r') {
        bookmarkList();
    }
});


//start the script after the page loads
document.addEventListener('DOMContentLoaded', function() {
    //try to read grid size from local storage or ask user for input
    try {
        chrome.storage.local.get('gridSizeX', function(data) {
            // console.log('grid size : ',data.gridSizeX);
            let gridSizeX = data.gridSizeX;
            list.style.gridTemplateColumns = `repeat(${gridSizeX}, 1fr)`;
        });
    } catch (error) {
        gridSize();
    }

    //try to read provider from local storage or ask user for input
    try {
        chrome.storage.local.get('provider', function(data) {
            // console.log('provider from storage : ',data.provider);
            provider = data.provider;
        });
    } catch (error) {
        provider = getProvider();
    }

    //try to read backgroundPaused from local storage or set to false
    try {
        chrome.storage.local.get('backgroundPaused', function(data) {
            // console.log('backgroundPaused from storage : ',data.backgroundPaused);
            backgroundPaused = data.backgroundPaused;
        });
    } catch (error) {
        backgroundPaused = false;
    }

    //try to read bookmarksFolderId from local storage or set to '1'
    chrome.storage.local.get('bookmarksFolderId', function(data) {
        // console.log('bookmarksFolderId from storage : ',data.bookmarksFolderId);
        if (data.bookmarksFolderId) {
            bookmarksFolderId = data.bookmarksFolderId;
        } else {
            bookmarksFolderId = '1';
        }
        // console.log('bookmarksFolderId : ', bookmarksFolderId);
    });

    //try to read unsplashAPI from local storage or set to ''
    chrome.storage.local.get('unsplashAPI', function(data) {
        // console.log('unsplashAPI from storage : ',data.unsplashAPI);
        if (data.unsplashAPI) {
            unsplashAPI = data.unsplashAPI;
        } else {
            unsplashAPI = '';
        }
        // console.log('unsplashAPI : ', unsplashAPI);
    });

    //try to read pexelsAPI from local storage or set to ''
    chrome.storage.local.get('pexelsAPI', function(data) {
        // console.log('pexelsAPI from storage : ',data.pexelsAPI);
        if (data.pexelsAPI) {
            pexelsAPI = data.pexelsAPI;
        } else {
            pexelsAPI = '';
        }
        // console.log('pexelsAPI : ', pexelsAPI);
    });

    setTimeout(
        bookmarkList,
        500
    )
    setTimeout(
        randomWallpaper,
        1000
    )
    setTimeout(welcomeAnimation, 500);
    
    //update time once 5 seconds
    textanimate(time());
    setInterval(timeRequest, 5000);
    
    bookmarkTitle();

});
