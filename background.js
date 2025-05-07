let eliLevel = 5;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'eliLevel') {
        eliLevel = message.eliLevel;
    } else if (message.type === 'getEliLevel') {
        sendResponse({ text: eliLevel });
    }
    

    return true;
});