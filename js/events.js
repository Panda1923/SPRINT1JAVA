export function filterEvents(events, searchText, selectedCategories) {
    return events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchText) ||
            event.description.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
        return matchesSearch && matchesCategory;
    });
}

export function getCategories(events) {
    return [...new Set(events.map(event => event.category))];
}