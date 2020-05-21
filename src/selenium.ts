import { Builder, By } from 'selenium-webdriver';
import {Cycle} from "./cycle";

export class Selenium {
    private driver;
    private refreshButton;

    private constructor() { }

    static async create() {
        const selenium =  new Selenium();
        selenium.driver = await new Builder().forBrowser('chrome').build();
        await selenium.driver.get('http://localhost:4200');
        selenium.refreshButton = await selenium.driver.findElement(By.id('refresh'));
        return selenium;
    }

    async run (cycle: Cycle) {
        await this.refreshButton.click();
        cycle.start();
        await new Promise((resolve) => cycle.onComplete(resolve));
    }

    async stop() {
        await this.driver.quit();
    }
}
