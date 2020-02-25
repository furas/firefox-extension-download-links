//---------------------------------------------------------------------
// This code has access to HTML on page but not to function `download`
// and to function assigned to button on toolbar.
// It uses `onMessage.addListener` to get message from `background.js`
// and execute `getLinks()` or `getImages()` which get links from HTML,
// and send these links back to `background.js` (`sendResponse()`)
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// get `href` from all `a` on page
//---------------------------------------------------------------------

function getLinks() {
    var result = [];
    
    var items = document.getElementsByTagName('a');

    for(let i = 0 ; i < items.length ; i++) {
        result.push(items[i].href);
    }
    
    return result;
}
    
//---------------------------------------------------------------------
// get `src` from all `img` on page
//---------------------------------------------------------------------

function getImages() {
    var result = [];
    
    var items = document.getElementsByTagName('img');

    for(let i = 0 ; i < items.length ; i++) {
        result.push(items[i].src);
    }
    
    return result;
}

//---------------------------------------------------------------------
// more universal version 
//---------------------------------------------------------------------

function get_attrib(tag, attrib) {
    var result = [];
    
    var items = document.getElementsByTagName(tag);

    for(let i = 0 ; i < items.length ; i++) {
        //result.push(items[i][attrib]);
        result.push(items[i].getAttribute(attrib)); // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
    }
    
    return result;  
}

//function getImages() { return get_attrib("img", "src"); }
// function getLinks() { return get_attrib("a", "href"); }

//---------------------------------------------------------------------
// get command from background.js and send back urls 
//---------------------------------------------------------------------

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //console.log('message.command: ' + message.command);
    if (message.command === "links") {
        sendResponse({links: getLinks()});
    }
    else if (message.command === "images") {
        sendResponse({links: getImages()});
    }
});

