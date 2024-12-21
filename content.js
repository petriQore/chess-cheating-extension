function extractChessMoves(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const moveSpans = doc.querySelectorAll('.node-highlight-content');
    
    const moves = [];
    
    moveSpans.forEach(span => {
        let move = '';

        const figurineSpan = span.querySelector('[data-figurine]');
        if (figurineSpan) {
            move += figurineSpan.getAttribute('data-figurine');
        }

        move += span.textContent.trim();

        moves.push(move);
    });
    
    return moves.join(' ');
}

const movesDisplay = document.createElement('div');
movesDisplay.id = 'moves-display';
movesDisplay.style.position = 'fixed';
movesDisplay.style.bottom = '10px';
movesDisplay.style.right = '10px';
movesDisplay.style.padding = '10px';
movesDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
movesDisplay.style.color = 'white';
movesDisplay.style.border = '1px solid white';
movesDisplay.style.borderRadius = '5px';
movesDisplay.style.zIndex = '10000';
movesDisplay.textContent = 'Moves will appear here...';
document.body.appendChild(movesDisplay);

const observer = new MutationObserver(() => {
    const htmlContent = document.querySelector('wc-simple-move-list');
    if (htmlContent) {
        const moves = extractChessMoves(htmlContent.innerHTML);
        movesDisplay.textContent = moves;
    }
});

observer.observe(document.body, { childList: true, subtree: true });
