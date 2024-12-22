chrome.runtime.onMessage.addListener((message) => {
    const contentDiv = document.getElementById('content');
    contentDiv.textContent = message.text || 'No content found.';
});
//??