const searchBox = document.getElementById('searchBox');
const resourceCards = Array.from(document.querySelectorAll('.resource-card'));
const categories = Array.from(document.querySelectorAll('.category'));
const subcategories = Array.from(document.querySelectorAll('.subcategory'));

if (searchBox && resourceCards.length > 0) {
    indexResourceMetadata();
    updateSubcategoryVisibility(false);
    updateCategoryVisibility(false);

    searchBox.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        let visibleCount = 0;

        resourceCards.forEach((card) => {
            const searchIndex = card.dataset.searchIndex || '';
            const isMatch = searchIndex.includes(searchTerm);

            card.classList.toggle('hidden', !isMatch);
            card.classList.toggle('highlight', searchTerm.length > 0 && isMatch);
            card.setAttribute('aria-hidden', String(!isMatch));

            if (isMatch) {
                visibleCount++;
            }
        });

        updateSubcategoryVisibility(searchTerm.length > 0);
        updateCategoryVisibility(searchTerm.length > 0);
        updateSearchAnnouncement(searchTerm, visibleCount);
    });
}

function indexResourceMetadata() {
    resourceCards.forEach((card) => {
        const metadataSection = document.createElement('section');
        const category = card.closest('.category');
        const categoryTitle = normalizeText(
            category?.querySelector('.category-title')?.textContent || ''
        );
        const categoryKey = normalizeText(
            category?.dataset.category?.replace(/-/g, ' ') || ''
        );
        const title = normalizeText(
            card.querySelector('[itemprop="name"]')?.textContent || ''
        );
        const link = card.querySelector('.resource-link');
        const actionLabel = normalizeText(link?.textContent || '');
        const href = link?.getAttribute('href') || '';
        const resourceType = normalizeResourceType(title);
        const accessLabel = link?.classList.contains('locked')
            ? 'login required restricted account gated locked'
            : 'open access public';
        const locationLabel = href
            ? href.startsWith('http')
                ? 'external resource'
                : 'internal resource'
            : 'placeholder coming soon todo';
        const domainLabel = getDomainLabel(href);
        const spellingVariants = getSpellingVariants(categoryTitle, categoryKey, title);

        const metadataParts = [
            categoryTitle && `Category: ${categoryTitle}`,
            categoryKey && categoryKey !== categoryTitle.toLowerCase() && `Category key: ${categoryKey}`,
            resourceType && `Type: ${resourceType}`,
            accessLabel && `Access: ${accessLabel}`,
            actionLabel && `Action: ${actionLabel}`,
            locationLabel && `Status: ${locationLabel}`,
            domainLabel && `Source site: ${domainLabel}`,
            spellingVariants && `Aliases: ${spellingVariants}`,
        ].filter(Boolean);

        metadataSection.className = 'resource-metadata sr-only';
        metadataSection.setAttribute('aria-label', 'Search metadata');
        metadataSection.textContent = metadataParts.join('. ');

        card.appendChild(metadataSection);
        card.dataset.searchIndex = normalizeText(card.textContent).toLowerCase();
    });
}

function normalizeText(value) {
    return value.replace(/\s+/g, ' ').trim();
}

function normalizeResourceType(title) {
    const [type] = title.split(' - ');

    if (!type || type === title) {
        return '';
    }

    const normalizedType = type.toLowerCase();
    const typeAliases = {
        book: 'book textbook reference',
        guideline: 'guideline guide recommendation',
        guidelines: 'guideline guide recommendation',
        law: 'law legislation statute policy',
        tool: 'tool calculator clinical aid',
        tools: 'tool calculator clinical aid',
    };

    return typeAliases[normalizedType] || normalizedType;
}

function getDomainLabel(href) {
    if (!href || !href.startsWith('http')) {
        return '';
    }

    try {
        const hostname = new URL(href).hostname.replace(/^www\./, '');
        return hostname.replace(/[.-]/g, ' ');
    } catch {
        return '';
    }
}

function getSpellingVariants(categoryTitle, categoryKey, title) {
    const variants = [];
    const searchableText = `${categoryTitle} ${categoryKey} ${title}`.toLowerCase();

    if (searchableText.includes('pediatric')) {
        variants.push('paediatric child children youth infant');
    }

    if (searchableText.includes('incarceration')) {
        variants.push('corrections correctional prison jail detention custody');
    }

    if (searchableText.includes('newborn') || searchableText.includes('neonatal')) {
        variants.push('neonate neonates newborn infant');
    }

    return variants.join(' ');
}

function updateCategoryVisibility(isFiltering) {
    categories.forEach((category) => {
        const visibleCards = category.querySelectorAll('.resource-card:not(.hidden)').length;
        const shouldHide = isFiltering && visibleCards === 0;

        category.classList.toggle('hidden', shouldHide);
        category.setAttribute('aria-hidden', String(shouldHide));
    });
}

function updateSubcategoryVisibility(isFiltering) {
    subcategories.forEach((subcategory) => {
        const visibleCards = subcategory.querySelectorAll('.resource-card:not(.hidden)').length;
        const shouldHide = isFiltering && visibleCards === 0;

        subcategory.classList.toggle('hidden', shouldHide);
        subcategory.setAttribute('aria-hidden', String(shouldHide));
    });
}

function updateSearchAnnouncement(searchTerm, visibleCount) {
    const ariaLive = document.querySelector('[aria-live="polite"]') || createAriaLiveRegion();

    if (searchTerm.length > 0) {
        ariaLive.textContent = `Found ${visibleCount} resource${visibleCount !== 1 ? 's' : ''} matching "${searchTerm}"`;
        return;
    }

    ariaLive.textContent = '';
}

function createAriaLiveRegion() {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('class', 'sr-only');
    document.body.appendChild(region);
    return region;
}
