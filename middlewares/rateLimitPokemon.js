import {getData,setData} from '../databaseCalls/userData.js';

export const rateLimitPokemon = async(req, res, next) => {
    const userID = req.userID;  //Unique user ID from token
    const userKey = `user:${userID}`;
    const currentTime=Date.now();

    let userData=await getData(`user:${userID}`);
    if (userData===null) {
        userData={
            pokemon: {count:0, expireTime:currentTime+60*1000},
            unsplCount: 0,
        };
    }
    const { count, expireTime } = userData.pokemon;
    const timeLeft = Math.max(0, Math.ceil((expireTime - currentTime) / 1000)); // Time left in seconds
    if (currentTime > expireTime) {
        userData.pokemon.count = 1; 
        userData.pokemon.expireTime = currentTime + 60 * 1000; 
    } else {
        if (count >= 5) {  
            return res.status(403).json({ 
                message: 'Too many requests. Please try again later.',
                resetIn: `${timeLeft} seconds`
             });
        }
        userData.pokemon.count++; 
    }
    await setData(userKey,userData);
    res.totalRequests = userData.pokemon.count; 
    next();
};
