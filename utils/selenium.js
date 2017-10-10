const fs = require('fs');

async function scrollToBottom(driver, times, waitingInterval) {
	for(let i=0; i<times; i++) {
		await driver.executeScript('scrollTo(0, document.body.scrollHeight)');
		await driver.sleep(waitingInterval)
	}
}

function takeScreenShot(driver, filename) {
	driver.takeScreenshot().then(base64png => {
		fs.writeFileSync(`${filename}.png`, new Buffer(base64png, 'base64'));
	});
} 

module.exports = {
	scrollToBottom,
	takeScreenShot,
}
