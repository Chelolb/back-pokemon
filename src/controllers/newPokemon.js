const router = require('express').Router();
const Sequelize = require('sequelize');
const { Pokemon, Type } = require('../db');
const Op = Sequelize.Op;


const createPokemon = async (req, res, next) => {   // crea nuevo Pokemon

    try{

        let { name, image, hp, attack, defense, speed, height, weight, types } = req.body;

                                                // guarda pokemon en DB
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

        let formated = types;   // chequea Tipos

        const matchingTypes = await Type.findAll({  // identifica los tipos
            where: {                                // de la tabla Tipos
                name: {
                    [Op.in] : formated
                }
            }
        })

        await nPokemon.setTypes(matchingTypes)   // los asocia al pokemon

        res.status(201).json(nPokemon)

    } catch(error){
        return error;
    }

};

module.exports = { createPokemon };