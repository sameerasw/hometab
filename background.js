// Description: background script for the extension
//request a random image from unsplash with provided api key and save it to local storage



// //request image from unsplash
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://api.unsplash.com/photos/random?client_id=fcx0TMO2LYjLO2oAWgMfp4l2w1d6IXSNVW9ORaamji0');
// xhr.onload = function() {
//     if (xhr.status === 200) {
//         var response = JSON.parse(xhr.responseText);
//         var image = response.urls.regular;
//         //save image to local storage
//         chrome.storage.local.set({'image': image}, function() {
//             console.log('saved image', image);
//         });
//     }
// };
// xhr.send();

// //listen for new tab page to request image
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log('received request');
//     if (request === 'image') {
//         console.log('request === image');
//         chrome.storage.local.get('image', function(data) {
//             sendResponse(data.image);
//             console.log('sent image', data.image);
//         });
//     }
// });
