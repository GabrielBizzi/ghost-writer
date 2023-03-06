import puppeteer from "puppeteer";
import qs from "qs";

export default class Bing {
  constructor(
    opts = {
      q: "",
    }
  ) {
    let { q } = opts;

    if (q.length <= 0) throw Error("There must be a 'search'");

    this.q = q;
  }

  async search() {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    const queryString = qs.stringify({ q: this.q });
    const url = `https://www.bing.com/search?${queryString}`;
    await page.goto(url);
  }
}
