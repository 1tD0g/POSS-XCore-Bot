const { By } = require("selenium-webdriver")

module.exports = {
    loginUsernameInput: By.xpath(`//input[@name="j_username"]`),
    loginPasswordInput: By.xpath(`//input[@name="j_password"]`),
    loginButton: By.xpath(`//button[@value="loginButton"]`),
    logoutButton: By.className("btn btn-xs btn-logout btn-circle logout"),
    csrfInput: By.xpath(`//input[@type="hidden" and @name="CSRFToken"]`),
    userIDInput: By.id("fbUserId"),
    captcha: By.id("captchaCode"),
    sportsFacilityButton: By.xpath(`//a[@href="#" and @data-opt-text="Sports Facility" and @class="btn btn-primary btn-lg"]`),
    searchTBBForm: By.id("makeBookSearchTimetableForm")
}