function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

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
movesDisplay.style.maxHeight = '90vh';
movesDisplay.style.maxWidth = '350px';
movesDisplay.style.overflowY = 'auto';
movesDisplay.style.fontFamily = 'Arial, sans-serif';
movesDisplay.style.fontSize = '15px';
movesDisplay.textContent = 'Moves will appear here...';
document.body.appendChild(movesDisplay);

const fetchMoves = debounce((moves) => {
    fetch(`http://localhost:3000/send-data?moves=${encodeURIComponent(moves)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let formattedResponse = `
                <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Move</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Score</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.forEach(([move, score]) => {
                formattedResponse += `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${move}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${score}</td>
                    </tr>
                `;
            });

            formattedResponse += `
                    </tbody>
                </table>
            `;

            document.querySelector('#moves-display').innerHTML = `
                <strong style="display: block; margin-bottom: 5px;">Server Response:</strong>
                ${formattedResponse}
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('#moves-display').textContent = `Error: Play the 1st move(probably hh) or launch the server!`;
        });
}, 500);


const observer = new MutationObserver(() => {
    const htmlContent = document.querySelector('wc-simple-move-list');
    if (htmlContent) {
        const moves = extractChessMoves(htmlContent.innerHTML);
        fetchMoves(moves); 
    }
});

const targetNode = document.querySelector('wc-simple-move-list') || document.body;
observer.observe(targetNode, { childList: true, subtree: true });
