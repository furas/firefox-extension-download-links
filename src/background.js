
//---------------------------------------------------------------------
// generate current date as 'YYYY.MM.DD'
//---------------------------------------------------------------------

function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    return [year, (month>9?'':'0') + month, (day>9?'':'0') + day].join('.');
}

//---------------------------------------------------------------------

var count = 0; // count
var date = formatDate(new Date());

//---------------------------------------------------------------------

function onStartedDownload(id) {
  //console.log(`Started downloading: ${id}`);
}

//---------------------------------------------------------------------

function onFailedDownload(error) {
  //console.log(`Download failed: ${error}`);
}

//---------------------------------------------------------------------
// download from remote `url` to local `filename`
//---------------------------------------------------------------------

function download(downloadUrl, dowloadFilename) {
    console.log(`${dowloadFilename} : ${downloadUrl}`);

    var downloading = browser.downloads.download({
        url : downloadUrl,
        filename : dowloadFilename,
        saveAs: false
    });

    downloading.then(onStartedDownload, onFailedDownload);
}

//---------------------------------------------------------------------
// send system notification with number of files to download
//---------------------------------------------------------------------

function notify(message) {
  console.log("background script received message");
  //var title = browser.i18n.getMessage("notificationTitle");
  //var content = browser.i18n.getMessage("notificationContent", message.url);

  browser.notifications.create({
    "type": "basic",
//    "iconUrl": browser.extension.getURL("icons/link-48.png"),
    "title": 'Download',
    "message": message
  });
}

//---------------------------------------------------------------------


function filter(items, re) {
    var result = [];

    for(let i = 0 ; i < items.length ; i++) {

        var item = items[i];

        if(re.test(item)) {
            console.log('re: ' + item);
            result.push(item);
        }

    }

    return result;
}

//---------------------------------------------------------------------

function handleResponse(message, sender, sendResponse) {
    //console.log('message.links:')
    //console.log(message.links);

    var current_date = formatDate(new Date());

    if(date !== current_date) {
        count = 0; // count
        date = current_date;
    }

    count += 1;

    items = filter(message.links, /\.(jpg|png|wmv|mpg|mpeg|mp4)($|\?)/);

    if(items.length == 0) {
        notify('No items to download');
        return;
    }

    notify(`[${date}/${count}] Items to download: ${items.length}`);

    //browser.downloads.showDefaultFolder();

    for(let i = 0 ; i < items.length ; i++) {

        var item = items[i];

        var filename = item.split('?')[0].split('/').pop();
        download(item, `xxx/${date}/${count}/${filename}`);

    }
};

//---------------------------------------------------------------------

browser.browserAction.onClicked.addListener((tab) => {
    //console.log('title: ' + tab.title);
    //console.log('url: ' + tab.url);
    //console.log(tab);

    var message = browser.tabs.sendMessage(tab.id, {command: "links"});
    message.then(handleResponse)

    //var message = browser.tabs.sendMessage(tab.id, {command: "images"});
    //message.then(handleResponse)
});
