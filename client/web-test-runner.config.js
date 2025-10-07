// import { chromeLauncher } from "@web/test-runner-chrome";
// import { puppeteerLauncher } from "@web/test-runner-puppeteer";
import { seleniumLauncher } from "@web/test-runner-selenium";
import { Builder } from "selenium-webdriver";
import { Options } from "selenium-webdriver/firefox.js";

export default {
  // TODO all config values
  files: "test/*.test.js",
  nodeResolve: true,
  // browsers: [chromeLauncher({ launchOptions: { browser: "firefox" } })],
  // browsers: [puppeteerLauncher({ launchOptions: { browser: "firefox" } })],
  browsers: [
    seleniumLauncher({
      driverBuilder:
        new Builder().forBrowser("firefox")
          .setFirefoxOptions(new Options().addArguments("--headless")),
    }),
  ],
};
