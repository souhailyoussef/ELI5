chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'selection') {
        console.log('Received from content script:', message.text);
    }
});