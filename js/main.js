import { fetchEvents, fetchEventDetails } from "./api.js";
import { filterEvents, getCategories } from "./events.js";
import { renderCategories, displayEvents, displayEventDetails } from "./funciones.js";

// Main para paginas Home, Upcoming, Past, las constantes de la data
document.addEventListener("DOMContentLoaded", () => {
  const categoryContainer = document.getElementById("category-container"); //las categorias
  const searchInput = document.getElementById("search-input"); //barra de busqueda
  const eventContainer = document.getElementById("contenedor");
  const pageType = document.body.dataset.pageType; //inf para el filtro de las paginas
  const currentDate = new Date("2023-03-10"); // Fecha currentDate de base

  if (categoryContainer && searchInput && eventContainer) {
    fetchEvents()
      .then((events) => {
        let filteredEvents = [];

        // Filtrar los eventos según la página en la que esta ubicado
        if (pageType === "upcoming") {
          filteredEvents = events.filter(
            (event) => new Date(event.date) >= currentDate
          );
        } else if (pageType === "past") {
          filteredEvents = events.filter(
            (event) => new Date(event.date) < currentDate
          );
        } else {
          filteredEvents = events;
        }

        // Función para manejar el filtrado por búsqueda y categoría
        function handleFilterAndDisplay() {
          const searchText = searchInput.value.toLowerCase().trim();
          const selectedCategories = Array.from(
            categoryContainer.querySelectorAll("input[type=checkbox]:checked")
          ).map((checkbox) => checkbox.value);

          // Filtrar los eventos de la página actual usando la búsqueda y las categorías seleccionadas
          const filteredPageEvents = filterEvents(
            filteredEvents,
            searchText,
            selectedCategories
          );
          displayEvents(filteredPageEvents, eventContainer);
        }

        // Renderizar categorías y configurar los event listeners
        const categories = getCategories(filteredEvents);
        renderCategories(categories, categoryContainer);
        searchInput.addEventListener("input", handleFilterAndDisplay);
        categoryContainer.addEventListener("change", handleFilterAndDisplay);

        // Mostrar inicialmente los eventos filtrados según la página actual
        displayEvents(filteredEvents, eventContainer);
      })
      .catch((error) => {
        console.error("Error al obtener y filtrar los eventos:", error);
      });
  } else {
    console.error(
      "No se encontraron algunos elementos necesarios en el DOM para la funcionalidad principal."
    );
  }
});

// Main para mostrar las tarjetas en la página de Detalles
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("eventId");
  const eventDetailsContainer = document.getElementById("event-details");

  if (eventDetailsContainer && eventId) {
    fetchEventDetails(eventId)
      .then((event) => {
        displayEventDetails(event, eventDetailsContainer);
      })
      .catch((error) => {
        console.error("Error al obtener los detalles del evento:", error);
      });
  } else {
    console.error(
      "El contenedor de detalles del evento no existe en el DOM o no se proporcionó un ID de evento."
    );
  }
});

// Main para filtrar las tarjetas Upcoming y Past events segun su fecha
document.addEventListener("DOMContentLoaded", () => {
  const eventContainer = document.getElementById("contenedor");
  const pageType = document.body.dataset.pageType;
  const currentDate = new Date("2023-03-10"); // Fecha específica para comparar

  if (eventContainer) {
    fetchEvents()
      .then((events) => {
        let filteredEvents = [];

        if (pageType === "upcoming") {
          // Filtrar eventos con fecha mayor o igual "currentDate"
          filteredEvents = events.filter(
            (event) => new Date(event.date) >= currentDate
          );
        } else if (pageType === "past") {
          // Filtrar eventos con fecha menor  "currentDate"
          filteredEvents = events.filter(
            (event) => new Date(event.date) < currentDate
          );
        } else {
          // En caso de que no se cumpla, mensaje amigable
          filteredEvents = events;
        }

        displayEvents(filteredEvents, eventContainer);
      })
      .catch((error) => {
        console.error("Error al filtrar y mostrar los eventos:", error);
      });
  } else {
    console.error("El contenedor de eventos no existe en el DOM.");
  }
});

// pagina stats
//campo Events Statistics
document.addEventListener("DOMContentLoaded", () => {
    const upcomingStatsBody = document.getElementById("upcoming-stats-body");
  
    if (upcomingStatsBody) {
      fetchEvents()
        .then((events) => {
          const currentDate = new Date("2023-03-10");
  
          // Filtrar eventos futuros
          const upcomingEvents = events.filter(
            (event) => new Date(event.date) >= currentDate
          );
  
          if (upcomingEvents.length > 0) {
            // Agrupar eventos por categoría
            const categoryStats = upcomingEvents.reduce((acc, event) => {
              if (!acc[event.category]) {
                acc[event.category] = {
                  revenue: 0,
                  totalCapacity: 0,
                  totalEstimate: 0,
                };
              }
  
              acc[event.category].revenue += event.price * (event.estimate || 0);
              acc[event.category].totalCapacity += event.capacity;
              acc[event.category].totalEstimate += event.estimate || 0;
  
              return acc;
            }, {});
  
            // porcentaje de asistencia estimada por categoría y organizar de mayor a menor
            const sortedCategoryStats = Object.entries(categoryStats)
              .map(([category, stats]) => {
                const percentageOfEstimate =
                  (stats.totalEstimate / stats.totalCapacity) * 100;
                return {
                  category,
                  revenue: stats.revenue,
                  percentageOfEstimate: percentageOfEstimate.toFixed(2),
                };
              })
              .sort(
                (a, b) => b.percentageOfEstimate - a.percentageOfEstimate
              );
  
            // Actualizar la tabla con los resultados
            upcomingStatsBody.innerHTML = sortedCategoryStats
              .map(
                (stat) => `
                      <tr>
                          <td>${stat.category}</td>
                          <td>$${stat.revenue.toFixed(2)}</td>
                          <td>${stat.percentageOfEstimate}%</td>
                      </tr>
                  `
              )
              .join("");
          }
        })
        .catch((error) => {
          console.error(
            "Error al calcular las estadísticas por categoría:",
            error
          );
        });
    }
  });
  

// campo Past events 
document.addEventListener("DOMContentLoaded", () => {
  const pastStatsBody = document.getElementById("past-stats-body");

  if (pastStatsBody) {
    fetchEvents()
      .then((events) => {
        const currentDate = new Date("2023-03-10");

        // Filtrar eventos pasados
        const pastEvents = events.filter(
          (event) => new Date(event.date) < currentDate
        );

        if (pastEvents.length > 0) {
          // Agrupar eventos por categoría
          const categoryStats = pastEvents.reduce((acc, event) => {
            if (!acc[event.category]) {
              acc[event.category] = {
                revenue: 0,
                totalCapacity: 0,
                totalAssistance: 0,
              };
            }

            acc[event.category].revenue +=
              event.price * (event.assistance || 0);
            acc[event.category].totalCapacity += event.capacity;
            acc[event.category].totalAssistance += event.assistance || 0;

            return acc;
          }, {});

          // Calcular el porcentaje de asistencia por categoría y organizar de mayor a menor
          const sortedCategoryStats = Object.entries(categoryStats)
            .map(([category, stats]) => {
              const percentageOfAssistance =
                (stats.totalAssistance / stats.totalCapacity) * 100;
              return {
                category,
                revenue: stats.revenue,
                percentageOfAssistance: percentageOfAssistance.toFixed(2),
              };
            })
            .sort(
              (a, b) => b.percentageOfAssistance - a.percentageOfAssistance
            );

          // Actualizar la tabla con los resultados
          pastStatsBody.innerHTML = sortedCategoryStats
            .map(
              (stat) => `
                    <tr>
                        <td>${stat.category}</td>
                        <td>$${stat.revenue.toFixed(2)}</td>
                        <td>${stat.percentageOfAssistance}%</td>
                    </tr>
                `
            )
            .join("");
        }
      })
      .catch((error) => {
        console.error(
          "Error al calcular las estadísticas por categoría:",
          error
        );
      });
  }
});
