
function getPokemonTypes() {
    axios.get('http://localhost:8000/get_pokemon_types')
        .then(function (response) {
            let types = response.data.pokemon_types;
            addOptionsToDropdown(types, 'pokemonType1');
            addOptionsToDropdown(types, 'pokemonType2');
        })
        .catch(function (error) {
            console.error('Erreur lors de la récupération des types de Pokémon', error);
        });
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

function validerPokemon() {
    let selectedType1 = document.getElementById('pokemonType1').value;
    let selectedType2 = document.getElementById('pokemonType2').value;

    console.log('Type de Pokémon 1:', selectedType1);
    console.log('Type de Pokémon 2:', selectedType2);
}

getPokemonTypes();