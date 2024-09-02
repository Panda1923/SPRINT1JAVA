//funcion 
export function fetchEvents() {
    return fetch('https://aulamindhub.github.io/amazing-api/events.json')
        .then(response => response.json())
        .then(data => data.events)
        .catch(error => {
            console.error('Error fetching events:', error);
            return [];
        });
}

export function fetchEventDetails(eventId) {
    return fetch('https://aulamindhub.github.io/amazing-api/events.json')
        .then(response => response.json())
        .then(data => data.events.find(event => event._id == eventId))
        .catch(error => {
            console.error('Error fetching event details:', error);
            return null;
        });
} 

