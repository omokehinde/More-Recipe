const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Bring in recipe model
let models = require('../models/index.js');

// get all recipes
router.get('/all-recipes', (req, res)=>{
    models.recipe.all().then((recipes)=>{
       if (recipes.length === 0) {
           res.send({message:"Be the first to add a recipe"});
       } else res.send({recipes:recipes});
    });
});

// get a recipe
router.get('/recipe/:recipeId', (req, res)=>{
    models.recipe.findById(req.params.recipeId)
    .then((todo)=>{
        if (!todo) {
            res.status(404).send({message:"Recipe not found"});
        } else res.status(200).send(todo);
    });
    //res.send({message:"Here is your recipe!"});
});

// add a recipe
router.post('/add-recipe', ensureToken, (req, res)=>{
    jwt.verify(req.token, 'mysecret_key', (err, data)=>{
        if (err) {
            res.sendStatus(403);
        } else {
            models.user.findById(data.id)
            .then((user)=>{
                if (user) {
                    const name = req.body.name;
                    const description = req.body.description;
                    const userId = data.id;
                
                    req.checkBody('name', 'Recipe name is required').notEmpty();
                    req.checkBody('description', 'Recipe description is required').notEmpty();
                
                    let errors = req.validationErrors();
                    if (errors) {
                        res.status(412).send({errors:errors});
                    } else{
                        let newRecipe = {
                            name: name,
                            description: description,
                            userId: userId
                        };
                        models.recipe.create(newRecipe).then(()=>{
                            res.status(201).send({message: `Your recipe `+name+` has been added!`, data:data});
                        })
                        .catch((err)=>{
                            res.status(412).send(err);
                        });
                    }
                } else res.send({message: "Invalid token"});
            });
        }
    });
});

// update a recipe
router.put('/recipe', (req, res)=>{
    res.send({message:"Your recipe has been updated!"});
});

// delete a recipe
router.delete('/recipe', (req, res)=>{
    res.send({message:"Your recipe has been deleted!"});
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;