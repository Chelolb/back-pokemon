const router = require("express").Router();
const Sequelize = require("sequelize");
const { Type } =require('../db');
const axios = require('axios');
const { json } = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const { getAllPokemon, getPokemonApiById, getPokemonApiByName, 
        getPokemonDbByName, getPokemonDbById } = require('../utils/utils');


const getAllPokemons = async (req, res, next) => {// search all Pokemons

    let apiResult = await getAllPokemon() 

    let typeGroup = [];
    apiResult?.map(p => {   // create the Type groupe
            typeGroup.push(p.types)
    })
    let Types =[...new Set(typeGroup.flat())] //  Erase duplicate
        
    // Create Types not found in in table
    Types.map(async (e) => {
        await Type.findOrCreate({ where: { name: e } });
    })

    res.status(200).send(apiResult);

};

const getPokemonById = async (req, res, next) => {  // search pokemon for ID

    let { id } = req.params;
    
    if (!id || id.match(/[$%&/()=+@ ,.?¿'¡!"]/)) {

        return res.status(200).send(
            {msg:`Not send ID params or includes invalid characters`}
            );

    } 
    else
    {
            
        if (                      //The Pokemon have UUIDV4 format??...
        id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        )
        ) 
        
        { // ID have UUID format, search in bd

            let apiResult = await getPokemonDbById(id) 

            res.status(200).send(apiResult);
        }

        else

        { // else, search in API

            let apiResult = await getPokemonApiById(id) 

            res.status(200).send(apiResult);
        
        }
    }

}

const getPokemonByName = async (req, res, next) => {  // search pokemon for Name

    let { name } = req.params;
    
    if (!name || name.match(/[$%&/() =+-@,.?¿'¡!"]/)) {

        return res.status(200).send(
            {msg:`Not send NAME params o includes invalid characters`}
            );

    } 
    else
    {

        let apiResult = await getPokemonApiByName(name) 

        if(!apiResult.msg) {    // if found in API, show
            let arrResult = []
            arrResult.push(apiResult)
            return res.status(200).send(arrResult);
        }
        
        arrResult = await getPokemonDbByName(name)

        if(arrResult.length !== 0) {    // if found in DB, show
            return res.status(200).send(arrResult);
        }

        return res.status(200).send({msg:`Not found Pokemon: ${name}`});

    }
}

module.exports = { 
    getAllPokemons,
    getPokemonById,
    getPokemonByName,
};