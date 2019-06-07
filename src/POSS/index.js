const {
  Builder,
} = require('selenium-webdriver');
const selectors = require("./selectors");
const tbb = require("./timetable");
const common = require("../Common");
const chrome = require("selenium-webdriver/chrome");

const mainLink = "https://www40.polyu.edu.hk/starspossfbstud/secure/ui_make_book/make_book.do";

const navToBookingPage = (driver, username, password) => new Promise(async (resolve, reject) => {
  if (driver == null) return reject("Selenium Driver Not Found.");
  if(username == null || password == null) return reject("Username or Password Not Found.");

  if(await common.isElementExists(driver, selectors.searchTBBForm)){
    return resolve();
  }

  await driver.get(mainLink);
  await common.waitUntilWebsiteReady(driver, 5);

  if (!await common.isElementExists(driver, selectors.logoutButton)) { //If the logout button not exists.
    //Check Captcha
    if(await common.isElementExists(driver, selectors.captcha)) return reject("Captcha Found.")
    //Login
    await driver.findElement(selectors.loginUsernameInput).sendKeys(username);
    await driver.findElement(selectors.loginPasswordInput).sendKeys(password);
    await driver.findElement(selectors.loginButton).click();
    await driver.get(mainLink);
    await common.waitUntilWebsiteReady(driver, 5);
  }

  await common.waitUntilWebsiteReady(driver, 5);

  if(await common.isElementExists(driver, selectors.sportsFacilityButton)){
    await driver.findElement(selectors.sportsFacilityButton).click();
    await common.waitSync(3);
  }

  return resolve();
})

class POSS {
  
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.driver = null;
    this.userid = null;
    this.csrftoken = null;
  }

  BuildDriver(headless) {
    return new Promise(async resolve => {
      if (headless) {
        this.driver = await new Builder().forBrowser("chrome").setChromeOptions(new chrome.Options().headless()).build();
      } else {
        this.driver = await new Builder().forBrowser("chrome").build();
      }
      return resolve();
    })
  }

  GetCookie(){
    return new Promise(async (resolve, reject) => {
      this.cookie = await common.getWebsiteCookie(this.driver);
      return resolve(this.cookie);
    })
  }

  GetCSRFToken(){
    return new Promise(async (resolve, reject) => {

      try{
        await navToBookingPage(this.driver, this.username, this.password);
      }catch(e){ return reject(e) }
      

      if (!await common.isElementExists(this.driver, selectors.csrfInput)) return resolve(null); //If the csrf input not exists.

      this.csrftoken = await this.driver.findElement(selectors.csrfInput).getAttribute("value")

      return resolve(this.csrftoken);
    })
  }

  GetUserID(){
    return new Promise(async (resolve, reject) => {

      try{
        await navToBookingPage(this.driver, this.username, this.password);
      }catch(e){ return reject(e) }

      if (!await common.isElementExists(this.driver, selectors.userIDInput)) return resolve(null); //If the csrf input not exists.

      this.userid = await this.driver.findElement(selectors.userIDInput).getAttribute("value")

      return resolve(this.userid);
    })
  }

  GetTimetable(){
    return new Promise(async (resolve, reject) => {
      try{
        await navToBookingPage(this.driver, this.username, this.password);
        const result = await this.driver.executeAsyncScript(tbb.getTimetableScript(this.csrftoken, this.userid));
        this.timetable = result;
        return resolve(result);
      }catch(e){ 
        return reject(e) 
      }
    })
  }
}

module.exports = POSS