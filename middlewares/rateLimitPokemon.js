const pokemonRequests = {}; 
export const rateLimitPokemon = (req, res, next) => {
    const userID = req.userID;  // ✅ Unique user ID from token

    if (!pokemonRequests[userID]) {
        pokemonRequests[userID] = { requestCount: 0};
    }

    const userData = pokemonRequests[userID];

    if (userData.requestCount >= 4) {  // ✅ Pokémon API limit: 4 requests per day
        return res.status(403).json({ message: 'Pokémon API rate limit exceeded. Try again tomorrow!' });
    }
    userData.requestCount += 1;
    next();

};
