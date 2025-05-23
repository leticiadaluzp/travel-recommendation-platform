document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.querySelector(".search-btn");
    const resetBtn = document.querySelector(".reset-btn");
    const input = document.getElementById("search-input");
    const recommendationsDiv = document.querySelector(".recommendations");
    const recommendationCard = document.querySelector(".recommendation-card");

    recommendationsDiv.style.display = "none";

    let travelData = null;

    fetch("travel_recommendation_api.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Data fetched successfully:", data);
            travelData = data;
            
        })
        .catch (error => {
            console.error("There was a problem with the fetch operation:", error);
            recommendationsDiv.textContent = "Failed to load travel recommendations.";
    });

    searchBtn.addEventListener("click", () => {
        if (!travelData) return;

        const query = input.value.trim();
        if (!query) return;
        const q = query.toLowerCase();
        let found = false;

        recommendationCard.innerHTML = "";
        recommendationsDiv.style.display = "block";

        if (["beach", "beaches"].includes(q)) {
            travelData.beaches.forEach(item => createCard(item));
            found = true;
        } else if (["temple", "temples"].includes(q)) {
            travelData.temples.forEach(item => createCard(item));
            found = true;
        } else if (["country", "countries"].includes(q)) {
            travelData.countries.forEach(country => {
                country.cities.forEach(city => createCard(city));
            });
            found = true;
        } else {
            // Fallback: search by names and descriptions
            Object.values(travelData).forEach(category => {
                category.forEach(item => {
                    if (item.cities) {
                        // Country object
                        // Match country name
                        if (item.name.toLowerCase().includes(q)) {
                            item.cities.forEach(city => createCard(city));
                            found = true;
                        } else {
                            // Match within each city name/description
                            item.cities.forEach(city => {
                                const text = `${city.name} ${city.description}`.toLowerCase();
                                if (text.includes(q)) {
                                    createCard(city);
                                    found = true;
                                }
                            });
                        }
                    } else {
                        // Temple or beach
                        const text = `${item.name} ${item.description}`.toLowerCase();
                        if (text.includes(q)) {
                            createCard(item);
                            found = true;
                        }
                    }
                });
            });
        }

        // Object.values(travelData).forEach(category => {
        //     category.forEach(item => {
        //         if (item.cities) {
        //             // Si el nombre del país coincide, muestra todas sus ciudades
        //             if (item.name.toLowerCase().includes(query)) {
        //                 item.cities.forEach(city => {
        //                     const card = document.createElement("div");
        //                     card.className = "card";
        //                     card.innerHTML = `
        //                         <img src="${city.imageUrl}" alt="${city.name}">
        //                         <h3>${city.name}</h3>
        //                         <p>${city.description}</p>
        //                         <button>Visit</button>
        //                     `;
        //                     recommendationCard.appendChild(card);
        //                     found = true;
        //                 });
        //             } else {
        //                 // Si el nombre de la ciudad coincide, muestra solo esa ciudad
        //                 item.cities.forEach(city => {
        //                     const combinedText = `${city.name} ${city.description}`.toLowerCase();
        //                     if (combinedText.includes(query)) {
        //                         const card = document.createElement("div");
        //                         card.className = "card";
        //                         card.innerHTML = `
        //                             <img src="${city.imageUrl}" alt="${city.name}">
        //                             <h3>${city.name}</h3>
        //                             <p>${city.description}</p>
        //                             <button>Visit</button>
        //                         `;
        //                         recommendationCard.appendChild(card);
        //                         found = true;
        //                     }
        //                 });

        //         // const combinedText = `${item.name} ${item.description}`.toLowerCase();
        //         // if (combinedText.includes(query)) {
        //         //     const card = document.createElement("div");
        //         //     card.className = "card";
        //         //     card.innerHTML = `
        //         //         <img src="${item.imageUrl}" alt="${item.name}">
        //         //         <h3>${item.name}</h3>
        //         //         <p>${item.description}</p>
        //         //         <button>Visit</button>
        //         //     `;
        //         //     recommendationCard.appendChild(card);
        //         //     found = true;
        //         // }
            
        //           }
        //         } else if (item.imageUrl && item.description) {
        //             // Para items normales (templos, playas, etc)
        //             const combinedText = `${item.name} ${item.description}`.toLowerCase();
        //             if (combinedText.includes(query)) {
        //                 const card = document.createElement("div");
        //                 card.className = "card";
        //                 card.innerHTML = `
        //                     <img src="${item.imageUrl}" alt="${item.name}">
        //                     <h3>${item.name}</h3>
        //                     <p>${item.description}</p>
        //                     <button>Visit</button>
        //                 `;
        //                 recommendationCard.appendChild(card);
        //                 found = true;
        //             }
        //         }
        //     });
        // });

        recommendationsDiv.style.display = found ? "block" : "none";

    });

    resetBtn.addEventListener("click", () => {
        recommendationsDiv.style.display = "none";
        recommendationCard.innerHTML = "";
        input.value = "";
    });

    function createCard(item) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" />
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <button>Visit</button>
        `;
        recommendationCard.appendChild(card);
    }

})