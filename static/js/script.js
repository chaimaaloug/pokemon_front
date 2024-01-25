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
        // Récupérer les détails des pokémons depuis backend
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

async function getPokemonDetailsAndUpdateUI(pokemonName, detailsContainerId, pokemonContainerId) {
    try {
        const details = await getPokemonDetails(pokemonName);

        if (details) {
            const detailsContainer = document.getElementById(detailsContainerId);
            const pokemonContainer = document.getElementById(pokemonContainerId);

            if (detailsContainer && pokemonContainer) {
                const imageUrl = details.imageUrl || '';
                const type2 = details.Type2 && details.Type2 ? ` / ${details.Type2}` : "";

                let detailsHTML = `
                    <div class="card pt-4" style="padding-right:0px;padding-left:0px;">
                        <div class="d-flex mx-4 my-2 mb-2">
                            <div class="mr-3">
                                <img src="${imageUrl}">
                            </div>
                            <div class="text-left">
                                <h5>
                                    <span class="badge badge-primary text-capitalize" style="font-size: 18px">${details.Name}</span>
                                </h5>
                                <h6 class="text-dark">${details.Description}</h6>
                            </div>
                        </div>
                        <div class="row mx-4 my-2 py-3" style="background-color: #30a7d7; border-radius: 5px;">
                            <div class="col-8">
                                <span class="text-white d-block font-weight-bold" style="font-size: 18px;">Capacités:</span>
                                <span class="text-dark d-block text-capitalize font-italic">${details.Abilities}</span>
                                <span class="text-white d-block font-weight-bold" style="font-size: 18px;">Type:</span>
                                <span class="text-dark d-block text-capitalize font-italic">${details.Type1}${type2}</span>
                            </div>
                            <div class="col-4">
                                <span class="text-white d-block font-weight-bold" style="font-size: 18px;">Taille: </span>
                                <span class="text-dark d-block font-italic">${(details.Height) / 10} m</span>
                                <span class="text-white d-block font-weight-bold" style="font-size: 18px;">Poids: </span>
                                <span class="text-dark d-block font-italic">${(details.Weight / 10)} kg</span>
                            </div>
                        </div>
                        <div class="">
                            <img src="http://localhost:8000/get_stats_chart/${details.Name}" class="img-fluid">
                        </div>
                    </div>`;
                detailsContainer.innerHTML = detailsHTML;
                pokemonContainer.appendChild(detailsContainer);
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
