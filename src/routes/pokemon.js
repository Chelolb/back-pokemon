const pokemonRouter = require('express').Router();
// const { authOK } = require('../controllers/login');

const { 
    getAllPokemons, 
    getPokemonByName,
    getPokemonById,
} = require('../controllers/getPokemons');
const { createPokemon } = require('../controllers/newPokemon')

pokemonRouter.get('/getAll', getAllPokemons);
pokemonRouter.get('/search/:name', getPokemonByName);
pokemonRouter.get('/detail/:id', getPokemonById);
pokemonRouter.post('/create', createPokemon);

module.exports = pokemonRouter;