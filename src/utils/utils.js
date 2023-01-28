const axios = require('axios');
const { Pokemon, Type } = require('../db');
const { Sequelize } = require('sequelize');
const db = require('../db');
const Op = Sequelize.Op;

async function getPokemonsApi() {

    let arrayPokemonsApi = [];

      // carga de pokeAPI -----------------------------------------
      await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=40')// asks 40 pokemon (de 0 a 40)
      .then(async (response) => {
          let arrayResultApi = response.data.results;   // array de Objets{ name, url}
          var arrayPromises = [];
          arrayResultApi.map((p) => arrayPromises.push(axios.get(p.url))); // asks detail of 40 pokemon
          // the data of the pokemons is obtained one by one               (push in the array)
        
          await Promise.all(arrayPromises) // wait for end the promise
          .then((pokemons) => {     // obtained array with detail pokemoms
              arrayPokemonsApi = pokemons.map((p) => { // map for each elements for extrac 
                
                let typeGroup = [];  // search the types
                    p.data.types?.map(t => {    
                        let typ = t.type.name
                        typeGroup.push(typ) // and created types array
                    })

                return {                             // only the desired data 
                      id: p.data.id,
                      name: p.data.name,
                      image: p.data.sprites.other['official-artwork'].front_default,  // url image
                      hp: p.data.stats[0].base_stat,
                      attack: p.data.stats[1].base_stat,
                      defense: p.data.stats[2].base_stat,
                      speed: p.data.stats[5].base_stat,
                      height: p.data.height,
                      weight: p.data.weight,
                      createdDb: false,
                      types: typeGroup
                  };  // return 
              }); // map
          }) 
          .catch((error) => {   // catch error of 2º promesa
              return error;
          });

      })
      .catch((error) => {   // catch error of 1º promesa
          return error;
      });
        // ------------------- end - carga de poke API
    return arrayPokemonsApi;
};


async function getPokemonsDb()  {  // search the pokemon en BD 

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
        'createdDb' ],
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
  
            resolveDB?.map((e) => {  //map each pokemon in DB 
                
                let types = e["types"];// shearch the types
                let formated = [];
                types.map((e) => formated.push(e["name"]));   // create the types array
        
                let obj = {  // create the object pokemon
                    id: e.id,
                    name: e.name,
                    image: e.image,
                    hp: e.hp,
                    attack: e.attack,
                    defense: e.defense,
                    speed: e.speed,
                    height: e.height,
                    weight: e.weight,
                    createdDb: e.createdDb,
                    types: formated,       
                }

                dbFormat.push(obj);

            })
        
        }

        return dbFormat

    } catch(error){
        return error;
    }
    // ------------- end - pokemon charge in DB
}


async function getAllPokemon() {    // search all pokemon
    try {
        let apiPokemons = await getPokemonsApi();
        let dbPokemons = await getPokemonsDb();

        if(dbPokemons.length === 0)  {   // if have not in DB...
            return apiPokemons }    // only send in API

        return apiPokemons.concat(dbPokemons);  // sen in API and DB

    } catch (error) {
        return error;
    }
};


async function getPokemonApiById(idSearch) {    // search for ID in API
    try{
        const searchPokemonsApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idSearch}`);

        if (searchPokemonsApi) {
            
            let p = searchPokemonsApi;

            let typeGroup = [];
            p.data.types.map((t) => { // shearch the types
                let typ = t.type.name
                typeGroup.push(typ) // and create the types array
            })

            return {
                id: p.data.id,
                name: p.data.name,
                image: p.data.sprites.other['official-artwork'].front_default,  // url image
                hp: p.data.stats[0].base_stat,
                attack: p.data.stats[1].base_stat,
                defense: p.data.stats[2].base_stat,
                speed: p.data.stats[5].base_stat,
                height: p.data.height,
                weight: p.data.weight,
                createdDb: false,
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
            return res.json({ msg: "Error search for ID in DB" });
  
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
            createdDb: dbResult["createdDb"],
            types: formated,
        };
  
        return obj;

    } catch(error){
        return null;
    }
}

async function getPokemonApiByName(nameSearch) {    // busca for Name in API
    try{
        const searchPokemonsApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameSearch}`);        

        if (searchPokemonsApi) {

            let p = searchPokemonsApi;

            let typeGroup = [];
            p.data.types.map((t) => { // Search the types
                let typ = t.type.name
                typeGroup.push(typ) // y armo el array con los tipos
            })

            return {
                id: p.data.id,
                name: p.data.name,
                image: p.data.sprites.other['official-artwork'].front_default,  // url imagen
                //image: p.data.sprites.versions["generation-v"]["black-white"].animated.back_default, // url imagen
                hp: p.data.stats[0].base_stat,
                attack: p.data.stats[1].base_stat,
                defense: p.data.stats[2].base_stat,
                speed: p.data.stats[5].base_stat,
                height: p.data.height,
                weight: p.data.weight,
                createdDb: false,
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
            let types = e["types"];     // Search all the types
            let formated = [];
            types.map((d) => formated.push(d["name"]));  // and create the types array

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
                createdDb: e["createdDb"],
                types: formated,
            };
            dbFormated.push(obj);
          });

          return dbFormated;

    } catch(error){
        return ({msg:`Not found Pokemon: ${nameSearch}`});
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