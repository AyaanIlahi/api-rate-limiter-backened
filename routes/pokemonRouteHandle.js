import express from 'express';
import axios from 'axios';
import { validateUser } from '../middlewares/validate.js';
import { rateLimitPokemon } from '../middlewares/rateLimitPokemon.js';

const router = express.Router(); // Create Router
// GET Pokémon by name
router.get("/:name", validateUser, rateLimitPokemon, async (req, res) => {
  try {
    const { name } = req.params;

    // Fetch Pokémon data
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);

    // Fetch abilities with effects
    const abilities = await Promise.all(
      response.data.abilities.map(async (ability) => {
        const abilityResponse = await axios.get(ability.ability.url);
        return {
          name: ability.ability.name,
          effect: abilityResponse.data.effect_entries.find(entry => entry.language.name === "en")?.effect || "No effect description available."
        };
      })
    );
    // Final response
    const data = {
      name: response.data.name,
      id: response.data.id,
      type: response.data.types.map(t => t.type.name),
      image: response.data.sprites.front_default,
      abilities: abilities,
      totalRequests: res.totalRequests,
    };
    console.log("Successfull in PokemonAPI call");
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Pokémon not found!" });
  }
});

export default router;