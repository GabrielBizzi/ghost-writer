import puppeteer from "puppeteer";
import qs from "qs";

export default class Yahoo {
  constructor(
    opts = {
      p: "",
      ei: "UTF-8",
    }
  ) {
    let { p, ei } = opts;

    if (p.length <= 0) throw Error("There must be a 'search'");

    this.p = p;
    this.ei = ei;
  }

  async search() {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    const queryString = qs.stringify({ p: this.p, ei: this.ei });
    const url = `https://search.yahoo.com/search?${queryString}`;
    await page.goto(url);
  }
}
