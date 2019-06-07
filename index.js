require("dotenv").config();
const poss = require("./src/POSS");
const util = require("util");

(async function () {

    if (!process.env.username || !process.env.password) {
        console.log("Username or Password not found in .env file.");
        process.exit(1);
    }

    const POSS = new poss(process.env.username, process.env.password);

    await POSS.BuildDriver(false);
    await POSS.GetCSRFToken();
    await POSS.GetUserID();
    await POSS.GetCookie();
    const result = await POSS.GetTimetable();
    console.log(util.inspect(result, true, null, true))
})();