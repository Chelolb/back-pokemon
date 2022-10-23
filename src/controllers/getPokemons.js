const router = require("express").Router();
const Sequelize = require("sequelize");
const { Type } =require('../db');
const axios = require('axios');
const { json } = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const { getAllPokemon, getPokemonApiById, getPokemonApiByName, 
        getPokemonDbByName, getPokemonDbById } = require('../utils/utils');


const getAllPokemons = async (req, res, next) => {// obtiene todos los pokemons

    let apiResult = await getAllPokemon() 

    let typeGroup = [];
    apiResult?.map(p => {   // crea el grupo distintos tipos
            typeGroup.push(p.types)
    })
    let Types =[...new Set(typeGroup.flat())] //  Elimina duplicados
        
    // Agrega Tipos aun no registrados en la tabla
    Types.map(async (e) => {
        await Type.findOrCreate({ where: { name: e } });
    })

    res.status(200).send(apiResult);

};

const getPokemonById = async (req, res, next) => {  // obtiene pokemon por ID

    let { id } = req.params;
    
    if (!id || id.match(/[$%&/()=+@=,.?¿'¡!"]/)) {
    //if (!id) {

        return res.status(200).send(
            {msg:`No se indicó el parámetro id, o se incluyeron caracteres inválidos`}
            );

    } 
    else
    {
            
        if (                      //Las Recetas en BD tiene ID en formato UUIDV4??...
        id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        )
        ) 
        
        { // ID tiene formato UUID, busca en bd

            let apiResult = await getPokemonDbById(id) 

            res.status(200).send(apiResult);
        }

        else

        { // sino, busca en la API

            let apiResult = await getPokemonApiById(id) 

            res.status(200).send(apiResult);
        
        }
    }

}

const getPokemonByName = async (req, res, next) => {  // obtiene pokemon por Nombre

    let { name } = req.params;
    
    if (!name || name.match(/[$%&/() =+-@=,.?¿'¡!"]/)) {

        return res.status(200).send(
            {msg:`No se indicó el parámetro name, o se incluyeron caracteres inválidos`}
            );

    } 
    else
    {

        let apiResult = await getPokemonApiByName(name) 

        if(!apiResult.msg) {    // si encuentra en API, lo muestra
            return res.status(200).send(apiResult);
        }
        
        apiResult = await getPokemonDbByName(name)

        if(apiResult.length !== 0) {    // si encuentra en DB, lo muestra
            return res.status(200).send(apiResult);
        }

        return res.status(200).send({msg:`No se encontró el Pokemon: ${name}`});

    }
}

module.exports = { 
    getAllPokemons,
    getPokemonById,
    getPokemonByName,
};