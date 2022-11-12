const axios = require('axios');
const { Pokemon, Type } = require('../db');
const { Sequelize } = require('sequelize');
const db = require('../db');
const Op = Sequelize.Op;

async function getPokemonsApi() {

    let arrayPokemonsApi = [];

      // carga de pokeAPI -----------------------------------------
      await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=40')// solicita 40 pokemon (de 0 a 40)
      .then(async (response) => {
          let arrayResultApi = response.data.results;   // array de Ob{ name, url}
          var arrayPromises = [];
          arrayResultApi.map((p) => arrayPromises.push(axios.get(p.url))); // solicita detalles de 40 pokemon
          // se obtiene uno por uno los datos de cada pokemon               (los pushea en el array)
        
          await Promise.all(arrayPromises) // espera que se cumplan las promesas
          .then((pokemons) => {     // obtiene array con todos los detalles
              arrayPokemonsApi = pokemons.map((p) => { // mapea a cada elemento para extraer 
                
                let typeGroup = [];  // Buscamos los tipos
                    p.data.types?.map(t => {    
                        let typ = t.type.name
                        typeGroup.push(typ) // y armo el array con los tipos
                    })

                return {                             // solo los datos creados
                      id: p.data.id,
                      name: p.data.name,
                      image: p.data.sprites.other.['official-artwork'].front_default,  // url imagen
                      hp: p.data.stats[0].base_stat,
                      attack: p.data.stats[1].base_stat,
                      defense: p.data.stats[2].base_stat,
                      speed: p.data.stats[3].base_stat,
                      height: p.data.height,
                      weight: p.data.weight,
                      createdDB: false,
                      types: typeGroup
                  };  // return 
              }); // map
          }) 
          .catch((error) => {   // catch error de la 2º promesa
              return error;
          });

      })
      .catch((error) => {   // catch error de la 1º promesa
          return error;
      });
        // ------------------------------- end - carga de poke API
    return arrayPokemonsApi;
};


async function getPokemonsDb()  {  // busca los pokemon en BD 

    try{
        let resolveDB = await Pokemon.findAll({attributes: [ 
        'id', 
        'name', 
        'image', 
        'hp', 
        'attack', 
        'defense', 
        'speed', 
        'height', 
        'weight', 
        'createdDB' ],
            include:{
                model: Type,
                attributes: ["name"],
                through: {
                attributes: [],
                },
            }
        });

        let dbFormat = [];  
  
        if (resolveDB.length){
  
            resolveDB?.map((e) => {  //Barre cada pokemon en DB 
                
                let types = e["types"];// Buscamos los tipos
                let formated = [];
                types.map((e) => formated.push(e["name"]));   // creo el array tipos
        
                let obj = {  // crea el objeto pokemon
                    id: e.id,
                    name: e.name,
                    image: e.image,
                    hp: e.hp,
                    attack: e.attack,
                    defense: e.defense,
                    speed: e.speed,
                    height: e.height,
                    weight: e.weight,
                    createdDB: e.createdDB,
                    types: formated,       
                }

                dbFormat.push(obj);

            })
        
        }

        return dbFormat

    } catch(error){
        return error;
    }
    // ------------------------------- end - carga de poke DB
}


async function getAllPokemon() {    // busca Todos los pokemon
    try {
        let apiPokemons = await getPokemonsApi();
        let dbPokemons = await getPokemonsDb();

        if(dbPokemons.length === 0)  {   // Si no hay en DB...
            return apiPokemons }    // solo envia los de API

        return apiPokemons.concat(dbPokemons);  // envia API y DB

    } catch (error) {
        return error;
    }
};


async function getPokemonApiById(idSearch) {    // busca por ID en API
    try{
        const searchPokemonsApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idSearch}`);

        if (searchPokemonsApi) {
            
            let p = searchPokemonsApi;

            let typeGroup = [];
            p.data.types.map((t) => { // Buscamos los tipos
                let typ = t.type.name
                typeGroup.push(typ) // y armo el array con los tipos
            })

            return {
                id: p.data.id,
                name: p.data.name,
                image: p.data.sprites.other.['official-artwork'].front_default,  // url imagen
                hp: p.data.stats[0].base_stat,
                attack: p.data.stats[1].base_stat,
                defense: p.data.stats[2].base_stat,
                speed: p.data.stats[3].base_stat,
                height: p.data.height,
                weight: p.data.weight,
                createdDB: false,
                types: typeGroup,
            };  // return

        }else {
            return null;
        }
    } catch(error){
        return null;
    }

}

async function getPokemonDbById(idSearch) {
    try{
        let dbResult = await Pokemon.findOne({
            where: { id: idSearch },
            include: [
            { model: Type, attributes: ["name"], through: { attributes: [] } },
            ],
        });

        if (dbResult === null)
            return res.json({ msg: "Error buscando por id in DB" });
  
        let formated = [];
        dbResult.types.map((e) => formated.push(e["name"]));
  
        let obj = {
            id: dbResult["id"],
            name: dbResult["name"],
            image: dbResult["image"],
            hp: dbResult["hp"],
            attack: dbResult["attack"],
            defense: dbResult["defense"],
            speed: dbResult["speed"],
            height: dbResult["height"],
            weight: dbResult["weight"],
            types: formated,
        };
  
        return obj;

    } catch(error){
        return null;
    }
}

async function getPokemonApiByName(nameSearch) {    // busca por nombre en API
    try{
        const searchPokemonsApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameSearch}`);        

        if (searchPokemonsApi) {

            let p = searchPokemonsApi;

            let typeGroup = [];
            p.data.types.map((t) => { // Buscamos los tipos
                let typ = t.type.name
                typeGroup.push(typ) // y armo el array con los tipos
            })

            return {
                id: p.data.id,
                name: p.data.name,
                image: p.data.sprites.other.['official-artwork'].front_default,  // url imagen
                hp: p.data.stats[0].base_stat,
                attack: p.data.stats[1].base_stat,
                defense: p.data.stats[2].base_stat,
                speed: p.data.stats[3].base_stat,
                height: p.data.height,
                weight: p.data.weight,
                createdDB: false,
                types: typeGroup,
            };  // return

        }else {
            return null;
        }
    } catch(error){
        return ({msg:`No se encontró el Pokemon: ${nameSearch}`});
        
    }
}


async function getPokemonDbByName(nameSearch){ 
    try{
        let dbResult = await Pokemon.findAll({
            where: { name: { [Op.like]: `%${nameSearch}%` } },
            include: [
              { model: Type, attributes: ["name"], through: { attributes: [] } },
            ],
          });

          let dbFormated = [];
      
          dbResult.map((e) => {
            let types = e["types"];     // Buscamos los tipos
            let formated = [];
            types.map((d) => formated.push(d["name"]));  // y armo el array con los tipos

            let obj = {
                id: e["id"],
                name: e["name"],
                image: e["image"],
                hp: e["hp"],
                attack: e["attack"],
                defense: e["defense"],
                speed: e["speed"],
                height: e["height"],
                weight: e["weight"],
                types: formated,
            };
            dbFormated.push(obj);
          });

          return dbFormated;

    } catch(error){
        return ({msg:`No se encontró el Pokemon: ${nameSearch}`});
    }
}


module.exports ={
        getPokemonsApi,
        getPokemonsDb,
        getAllPokemon,
        getPokemonApiById,
        getPokemonDbById,
        getPokemonApiByName,
        getPokemonDbByName
    };