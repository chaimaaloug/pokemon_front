async function getPokemonTypes() {
    try {
        const response = await axios.get('http://localhost:8000/get_pokemon_types');
        let types = response.data.pokemon_types;
        addOptionsToDropdown(types, 'pokemonType1');
        addOptionsToDropdown(types, 'pokemonType2');
    } catch (error) {
        console.error('Erreur lors de la récupération des types de Pokémon', error);
    }
}

async function getPokemonNames() {
    try {
        const response = await axios.get('http://localhost:8000/get_pokemon_names');
        let types = response.data.pokemon_names;
        addOptionsToDropdown(types, 'pokemonType1');
        addOptionsToDropdown(types, 'pokemonType2');
    } catch (error) {
        console.error('Erreur lors de la récupération des types de Pokémon', error);
    }
}

function addOptionsToDropdown(options, dropdownId) {
    let dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '';

    let placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.text = '--- Sélectionnez un type ---';
    dropdown.appendChild(placeholderOption);

    for (let option of options) {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    }
}

async function validerPokemon() {
    try {
        let selectedType1 = document.getElementById('pokemonType1').value;
        let selectedType2 = document.getElementById('pokemonType2').value;

        const response = await axios.post('http://localhost:8000/send_selected_pokemons', {
            type1: selectedType1,
            type2: selectedType2
        });
        console.log('Selected values:', selectedType1, selectedType2);
        console.log('Réponse du backend:', response.data);
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données au backend', error);
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

getPokemonTypes();
getPokemonNames();
