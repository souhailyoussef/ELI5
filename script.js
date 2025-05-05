console.warn('extension started!');




document.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const text = selection.toString().trim();
    if (!text) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const DIV_ID = 'iconDiv';

    const previousIcon = document.getElementById(DIV_ID);
    if (previousIcon && previousIcon.parentElement) {
        previousIcon.parentElement.removeChild(previousIcon);
    }

    const iconDiv = document.createElement('div');
    iconDiv.id = DIV_ID;
    iconDiv.textContent = '🔍';
    iconDiv.style.position = 'absolute';
    iconDiv.style.left = `${window.scrollX + rect.right + 5}px`;
    iconDiv.style.top = `${window.scrollY + rect.top}px`;
    iconDiv.style.zIndex = 9999;
    iconDiv.style.cursor = 'pointer';
    iconDiv.style.background = 'white';
    iconDiv.style.padding = '2px 4px';
    iconDiv.style.borderRadius = '4px';
    iconDiv.style.boxShadow = '0 0 4px rgba(0,0,0,0.2)';

    iconDiv.onclick = () => {
        chrome.runtime.sendMessage({type: 'selection', text})
    };

    document.body.appendChild(iconDiv);
});
