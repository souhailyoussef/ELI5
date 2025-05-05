chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'selection') {
        console.log(message);
        updateSelectionContent(message.text);
    }
})

function updateSelectionContent(content) {
    if (!content || content.trim() === '') return;
    document.getElementById("selection").textContent = content;
}