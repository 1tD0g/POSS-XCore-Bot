require("dotenv").config();
const poss = require("./src/POSS");

(async function() {

    if(!process.env.username || !process.env.password){
        console.log("Username or Password not found in .env file.");
        process.exit(1);
    }
    
    await poss.BuildDriver(false);
    await poss.GetCSRFToken(process.env.username, process.env.password);
})();