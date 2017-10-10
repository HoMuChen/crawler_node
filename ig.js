const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const chromedriver = require('chromedriver');

const { scrollToBottom }= require('./utils/selenium');
const { insertToDB }= require('./utils/store');

const chromeCapabilities = webdriver.Capabilities.chrome();
chromeCapabilities.set('chromeOptions', {args: ['--headless']});

const ACCOUNT = 'b98901052@ntu.edu.tw'
const PWD = 'a048225088'

const igCrawlerExpressHandler = (req, res) => {
	const tag = req.params.tag;

	igCrawlByTag(tag, ACCOUNT, PWD);

	res.send(`Start to scrape ig article urls with tag ${tag}`)
}

const igCrawlByTag = async (tag, account, pwd) => {
	const driver = new webdriver.Builder()
		.forBrowser('chrome')
		.withCapabilities(chromeCapabilities)
		.build();

	await driver.get('https://www.instagram.com/accounts/login/?next=/explore');
	try {
		await driver.findElement(By.css("input[type=text]")).sendKeys(account)
		await driver.findElement(By.css("input[type=password]")).sendKeys(pwd)
		await driver.findElement(By.css('button._qv64e._gexxb._4tgw8._njrw0')).click()
		await driver.wait(webdriver.until.elementLocated(By.css('._mck9w._gvoze._f2mse')), 5000)
	} catch(e) {
		console.log(e);
	}

	await driver.get(`https:\/\/www.instagram.com/explore/tags/${tag}`)

	try {
		const moreBtn = await driver.wait(webdriver.until.elementLocated(By.css('a._1cr2e._epyes')), 5000)
		await moreBtn.click();
		await scrollToBottom(driver, 5, 2000);
	} catch(e) {
		console.log(e);
	}

	const items = await driver.findElements(By.css('._mck9w._gvoze._f2mse a'));

	const result = await Promise.all( items.map(item => item.getAttribute('href')) )

	console.log(`Insert ${result.length} ig article urls to db by tag <${tag}>`)

	const docs = result.map(url => {
		const doc = {
			url: url.split('?')[0],
			tag: tag
		}

		return doc;
	})
	insertToDB('ig', 'urls', docs, 'url')
		
	driver.close()
}

module.exports = {
	igCrawlerExpressHandler,
	igCrawlByTag,
}
