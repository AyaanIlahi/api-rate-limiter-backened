import {getData,setData} from '../databaseCalls/userData.js';

export const rateLimitPokemon = async(req, res, next) => {
    const userID = req.userID;  //Unique user ID from token
    const userKey = `user:${userID}`;

    let userData=await getData(`user:${userID}`);
    if (userData===null) {
        userData={
            pokeCount: 0,
            unsplCount: 0,
        };
    }
    if (userData.pokeCount >= 4) {  //Pokémon API limit: 4 requests per day
        return res.status(403).json({ message: 'Pokémon API rate limit exceeded. Try again tomorrow!' });
    }
    userData.pokeCount++;
    await setData(userKey,userData);
    next();
};
