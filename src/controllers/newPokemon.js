const router = require('express').Router();
const Sequelize = require('sequelize');
const { Pokemon, Type } = require('../db');
const Op = Sequelize.Op;


const createPokemon = async (req, res, next) => {   // create new Pokemon

    let { name, image, hp, attack, defense, speed, height, weight, types } = req.body;
    
    let msgErrors = null    // Validation data send

    if (!name || name.match(/[$%&/() =+-@=,.?¿'¡!"]/)) msgErrors = 'name no es válido';
    else if (!image)  msgErrors = 'No se indicó image';
    else if (hp < 1 || hp > 100 || isNaN(hp)) msgErrors = 'Hp no tiene el valor esperado';
    else if (attack < 1 || attack > 100 || isNaN(attack)) msgErrors = 'attack no tiene el valor esperado';
    else if (defense < 1 || defense > 100 || isNaN(defense)) msgErrors = 'defense no tiene el valor esperado';
    else if (speed < 1 || speed > 100 || isNaN(speed)) msgErrors = 'speed no tiene el valor esperado';
    else if (height < 1 || height > 100 || isNaN(height)) msgErrors = 'height no tiene el valor esperado';
    else if (weight < 1 || weight > 100 || isNaN(weight)) msgErrors = 'weight no tiene el valor esperado';
    else if (!Array.isArray(types) || types.length < 1) msgErrors = 'Types no es un array o está vacío';

    if (msgErrors) {        // if error, not save and send msg
        return res.status(200).send(
            {msg:`${msgErrors}, Data error, not save pokemon`}
            );
    }
    

    try{                                                // save pokemon in DB
        let nPokemon = await Pokemon.create({ 
            name, 
            image, 
            hp, 
            attack, 
            defense, 
            speed, 
            height, 
            weight,
        })

        let formated = types;   // check Types

        const matchingTypes = await Type.findAll({  // search the types
            where: {                                // in the Types table
                name: {
                    [Op.in] : formated
                }
            }
        })

        await nPokemon.setTypes(matchingTypes)   // join to pokemon

        return res.status(201).json(nPokemon)

    } catch(error){
        return error;
    }

};

module.exports = { createPokemon };