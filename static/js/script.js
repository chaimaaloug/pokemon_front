async function getPokemonNames() {
    try {
        const response = await axios.get('http://localhost:8000/get_pokemon_names');
        let types = response.data.pokemon_names;
        addOptionsToDropdown(types, 'pokemonType1', 'pokemonDetailsContainer');
        addOptionsToDropdown(types, 'pokemonType2', 'pokemonDetailsContainer');

    } catch (error) {
        console.error('Erreur lors de la récupération des types de Pokémon', error);
    }
}

function validateForm() {
    let selectedType1 = document.getElementById('pokemonType1').value;
    let selectedType2 = document.getElementById('pokemonType2').value;

    if (!selectedType1 || !selectedType2) {
        alert('Veuillez sélectionner les deux types de Pokémon avant de valider.');
        return false;
    }
    return true;
}

async function getPokemonDetails(pokemonName) {
    try {
        // Récupérer les détails des pokémons depuis votre backend
        const response = await axios.get(`http://localhost:8000/get_pokemon_details/${pokemonName}`);

        if (response.status === 200) {
            const pokemonDetails = response.data.pokemon_details;

            // Récupérer l'URL de l'image du Pokémon depuis PokeAPI
            const pokeApiResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            if (pokeApiResponse.status === 200) {
                const imageUrl = pokeApiResponse.data.sprites.front_default;
                pokemonDetails.imageUrl = imageUrl;
            } else {
                console.error('Erreur lors de la récupération de l\'image du Pokémon', pokeApiResponse.status);
            }

            return pokemonDetails;
        } else {
            console.error('Erreur lors de la récupération des détails du Pokémon', response.status);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du Pokémon', error);
    }
}

function addOptionsToDropdown(options, dropdownId, detailsContainerId) {
    let dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.innerHTML = '';

        let placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.text = '--- Sélectionnez un pokémon ---';
        dropdown.appendChild(placeholderOption);

        for (let option of options) {
            let optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            optionElement.addEventListener('change', () => getPokemonDetailsAndUpdateUI(option, detailsContainerId));
            dropdown.appendChild(optionElement);
        }
    }
}

function createStatsChart(details, chartId) {
    const statsData = {
        HP: details.HP,
        Attack: details.Attack,
        Defense: details.Defense,
        SpecialAttack: details['Special Attack'],
        SpecialDefense: details['Special Defense'],
        Speed: details.Speed,
    };

    const ctx = document.getElementById(chartId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(statsData),
            datasets: [{
                label: 'Stats',
                data: Object.values(statsData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


async function getPokemonDetailsAndUpdateUI(pokemonName, detailsContainerId, pokemonContainerId) {
    try {
        const details = await getPokemonDetails(pokemonName);

        if (details) {
            const detailsContainer = document.getElementById(detailsContainerId);
            const pokemonContainer = document.getElementById(pokemonContainerId);

            if (detailsContainer && pokemonContainer) {
                const imageUrl = details.imageUrl || '';

                let detailsHTML = `
                    <div class="card">
                        <div class="">
                            <img src="${imageUrl}" class="img-fluid">
                        </div>
                        <div class="text-left p-2">
                            <h5>
                                <span class="badge badge-primary">${details.Name.charAt(0).toUpperCase() + details.Name.slice(1)}</span>
                            </h5>
                            <p class="my-4">${details.Description}</p>
                        </div>
                        <div class="col-md-12 mb-3">
                            <canvas id="pokemonStatsChart" width="400" height="200"></canvas>
                        </div>
                    </div>`;

                detailsContainer.innerHTML = detailsHTML;
                pokemonContainer.appendChild(detailsContainer);

                // Appeler la fonction pour créer le graphique
                createStatsChart(details, 'pokemonStatsChart');
            }
        } else {
            console.error('Erreur lors de la récupération des détails du Pokémon');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du Pokémon', error);
    }
}


document.getElementById('pokemonType1').addEventListener('change', (event) => {
    getPokemonDetailsAndUpdateUI(event.target.value, 'pokemonDetails');
});

document.getElementById('pokemonType2').addEventListener('change', (event) => {
    getPokemonDetailsAndUpdateUI(event.target.value, 'pokemonDetails');
});

async function validerPokemon(event) {
    try {
        event.preventDefault();

        if (!validateForm()) {
            return false;
        }

        let selectedType1 = document.getElementById('pokemonType1').value;
        let selectedType2 = document.getElementById('pokemonType2').value;

        const detailsType1 = await getPokemonDetails(selectedType1);
        const detailsType2 = await getPokemonDetails(selectedType2);

        if (detailsType1 && detailsType2) {
            const response = await axios.post('http://localhost:8000/send_prediction_result', {
                type1: selectedType1,
                type2: selectedType2
            });

            if (response.status === 200) {
                const predictionResult = response.data.result;

                let detailsHTML = `<p>${predictionResult}</p>`;
                const detailsContainer = document.getElementById('predictionResult');
                detailsContainer.innerHTML = detailsHTML;
                detailsContainer.appendChild(detailsContainer);
            }
        } else {
            console.error('Erreur lors de la récupération des détails');
        }
    } catch (error) {
        console.error('Erreur backend', error);
        return false;
    }
}

getPokemonNames();
