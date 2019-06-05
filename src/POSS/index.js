const {
  Builder,
} = require('selenium-webdriver');
const selectors = require("./selectors");
const common = require("../Common");
const chrome = require("selenium-webdriver/chrome");

const mainLink = "https://www40.polyu.edu.hk/starspossfbstud/secure/ui_make_book/make_book.do";

let SeleniumDriver;

const BuildDriver = headless => new Promise(async resolve => {
  if (headless) SeleniumDriver = await new Builder().forBrowser("chrome").setChromeOptions(new chrome.Options().headless()).build();
  else SeleniumDriver = await new Builder().forBrowser("chrome").build();

  return resolve();
})

const GetCSRFToken = (username, password) => new Promise(async (resolve, reject) => {
  if (SeleniumDriver == null) return reject("Selenium Driver Not Found.");

  await SeleniumDriver.get(mainLink);
  await common.waitUntilWebsiteReady(SeleniumDriver, 5);

  if (!await common.isElementExists(SeleniumDriver, selectors.logoutButton)) { //If the logout button not exists.
    //Login
    await SeleniumDriver.findElement(selectors.loginUsernameInput).sendKeys(username);
    await SeleniumDriver.findElement(selectors.loginPasswordInput).sendKeys(password);
    await SeleniumDriver.findElement(selectors.loginButton).click();
    await SeleniumDriver.get(mainLink);
    await common.waitUntilWebsiteReady(SeleniumDriver, 5);
  }

  if (!await common.isElementExists(SeleniumDriver, selectors.csrfInput)) return resolve(null); //If the csrf input not exists.

  console.log(await SeleniumDriver.findElement(selectors.csrfInput).getAttribute("value"));

  return resolve(await SeleniumDriver.findElement(selectors.csrfInput).getAttribute("value"));
});

module.exports = {
  BuildDriver,
  GetCSRFToken
}