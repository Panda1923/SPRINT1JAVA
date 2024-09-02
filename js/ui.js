export function renderCategories(categories, categoryContainer) {
    categories.forEach(category => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = category;
        checkbox.id = `category-${category}`;
        checkbox.classList.add("form-check-input");

        const label = document.createElement("label");
        label.htmlFor = `category-${category}`;
        label.textContent = category;
        label.classList.add("form-check-label");

        const div = document.createElement("div");
        div.classList.add("form-check");

        div.appendChild(checkbox);
        div.appendChild(label);
        categoryContainer.appendChild(div);
    });
}

export function displayEvents(events, eventContainer) {
    eventContainer.innerHTML = "";

    if (events.length === 0) {
        eventContainer.innerHTML = "<p>No encontramos eventos según tu búsqueda.</p>";
        return;
    }

    events.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("card", "col-4", "p-2");

        card.innerHTML = `
            <img src="${event.image}" class="card-img-top rounded-4 img-fluid" alt="${event.name}">
            <div class="card-body">
                <h5 class="card-title">${event.name}</h5>
                <p class="card-text">${event.description}</p>
                <p>Price: $${event.price}</p>
                <a href="/assets/details.html?eventId=${event._id}" class="btn btn-primary">Details</a>
            </div>
        `;
        
        eventContainer.appendChild(card);
    });
}

export function displayEventDetails(event, eventDetailsContainer) {
    if (event) {
        eventDetailsContainer.innerHTML = `
            <div class="card">
                <img src="${event.image}" class="card-img-top rounded-4 img-fluid" alt="${event.name}">
                <div class="card-body">
                    <h5 class="card-title">${event.name}</h5>
                    <p class="card-text">${event.description}</p>
                    <p>Date: ${event.date}</p>
                    <p>Place: ${event.place}</p>
                    <p>Price: $${event.price}</p>
                    ${event.assistance ? `<p>Assistance: ${event.assistance}</p>` : ''}
                    ${event.estimate ? `<p>Estimate: ${event.estimate}</p>` : ''}
                </div>
            </div>
        `;
    } else {
        eventDetailsContainer.innerHTML = "<p>Evento no encontrado.</p>";
    }
}