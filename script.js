const searchBox = document.getElementById('searchBox');
const resourceCards = document.querySelectorAll('.resource-card');

searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    resourceCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.classList.remove('hidden');
            if (searchTerm.length > 0) {
                card.classList.add('highlight');
            } else {
                card.classList.remove('highlight');
            }
        } else {
            card.classList.add('hidden');
        }
    });
});