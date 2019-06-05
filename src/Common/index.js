function isElementExists(driver, element) {
    return new Promise(async resolve => {
        try {
            await driver.findElement(element);
            return resolve(true);
        } catch (e) {
            return resolve(false);
        }
    })
}

function isWebsiteReady(driver) {
    return new Promise(async resolve => resolve(await driver.executeScript("return document.readyState") == "complete"))
}

function waitUntilWebsiteReady(driver, timeoutInSec) {
    return new Promise(resolve => {

        const loop = setInterval(async () => {
            if(await isWebsiteReady(driver)){
                clearInterval(loop);
                return resolve(true);
            }
        }, 100);

        if(timeoutInSec){
            setTimeout(() => {
                clearInterval(loop);
                return resolve(false);
            }, timeoutInSec * 1000)
        }

    })
}

module.exports = {
    isElementExists,
    waitUntilWebsiteReady
}