const searchBox = document.getElementById('searchBox');
const resourceCards = document.querySelectorAll('.resource-card');

searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let visibleCount = 0;

    resourceCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.classList.remove('hidden');
            card.setAttribute('aria-hidden', 'false');
            if (searchTerm.length > 0) {
                card.classList.add('highlight');
            } else {
                card.classList.remove('highlight');
            }
            visibleCount++;
        } else {
            card.classList.add('hidden');
            card.setAttribute('aria-hidden', 'true');
        }
    });

    // Update search results announcement for accessibility
    if (searchTerm.length > 0) {
        const announcement = `Found ${visibleCount} resource${visibleCount !== 1 ? 's' : ''} matching "${searchTerm}"`;
        const ariaLive = document.querySelector('[aria-live="polite"]') || createAriaLiveRegion();
        ariaLive.textContent = announcement;
    }
});

function createAriaLiveRegion() {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('class', 'sr-only');
    region.style.position = 'absolute';
    region.style.left = '-10000px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';
    document.body.appendChild(region);
    return region;
}