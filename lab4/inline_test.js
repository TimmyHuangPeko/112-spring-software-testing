const puppeteer = require('puppeteer');

(async () => {    
    const go_time = new Date("2024-04-05T24:00:00");
    
    /* for testing */
    // const go_time = Date.now();

    /* launch new browser */
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    
    /*
     * wait until given time - 0.3 sec
     * because launching browser and open a new page takes around 0.4-0.6 sec 
     */
    //console.log((go_time - Date.now())/1000);
    while ((go_time - Date.now())/1000 >= 1.5) {
        ;
    }

    /* go to given url */
    await page.goto('https://inline.app/booking/-MeNcbDasiIykiow2Hfb:inline-live-2/-N3JQxh1vIZe9tECk0Pg');
    
    /* for testing */
    //await page.goto('https://inline.app/booking/-MeNcbDasiIykiow2Hfb:inline-live-2/-N04NZLqRzkSAM-EjB-5');
    
    /* scroll down so that the element(button) can be loaded */
    //await autoScroll(page);

    //await page.setViewport({width: 1920, height: 1080});


    /* 
     * if waiting time is too short
     * it'll throw error
     * because the button would be clicked by this program before it is loaded
     * and clicking a unclickable element throws an error
     * scroll down manually to let the button be loaded
     */
    //await delay(500).then(() => console.log('wait a second'));

    /* select the intended adult number */
    await page.waitForSelector('#adult-picker');
    await page.select('#adult-picker', '1');
    console.log('aduit-picker');

    await page.waitForSelector('#date-picker');
    await page.click('#date-picker');
    console.log('date-picker');

    const dateSelector = 'div[data-date="2024-04-12"]';
    await page.evaluate(dateSelector => {
        const element = document.querySelector(dateSelector);
        if(element) {
            element.scrollIntoView();
        }
    }, dateSelector);
    //const div = await page.$x('//div[data-date="2024-04-04"]');
    await page.waitForSelector(dateSelector);
    await page.click(dateSelector);
    console.log(dateSelector);

    /* choose the intended reservation time */
    const timeSelector = 'button[data-cy="book-now-time-slot-box-13-00"]';
    await page.evaluate(timeSelector => {
        const element = document.querySelector(timeSelector);
        if(element) {
            element.scrollIntoView();
        }
    }, timeSelector);
    await page.waitForSelector(timeSelector);
    await page.click(timeSelector);
    console.log(timeSelector);

    /**
     * click the submit button
     * note that the button should be loaded first
     * or it would throw error
     */
    await autoScroll(page);
    const bookSelector = 'button[data-cy="book-now-action-button"]';
    /*await page.evaluate(bookSelector => {
        const element = document.querySelector(bookSelector);
        if(element) {
            element.scrollIntoView();
        }
    }, bookSelector);*/
    await page.waitForSelector(bookSelector);
    /*
    while (true) {
        const isDisabled = await page.$eval('button[data-cy="book-now-action-button"]', button => button.disabled);
        if (!isDisabled) {
            break;
        }
        await page.waitForTimeout(100);
    }
    */
    await page.click(bookSelector);
    console.log(bookSelector);

    /**
     * wait for the name slot to be loaded
     * type your name and phone number
     * then submit
     */
    await page.waitForSelector('#name');
    await page.type('#name', '吳育瑄');
    //await page.type('#name', '黃建廷');
    await page.type('#phone', '905391523');
    //await page.type('#phone', '963910112');
    await page.click('button[data-cy="submit"]');
})();

/** scroll down automatically */
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 1000;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}