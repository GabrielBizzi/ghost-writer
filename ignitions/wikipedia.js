import puppeteer from "puppeteer";
import qs from "qs";

export default class Wikipedia {
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
      headless: true,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    const queryString = qs.stringify({ search: this.q });
    const url = `https://pt.wikipedia.org/w/index.php?${queryString}`;
    await page.goto(url);

    const content = await page.$$eval("p", (element) =>
      element.map((el, _index) => ({
        index: _index,
        text: el.innerText,
      }))
    );

    const founded = content.map((item) => item.text.replace(/\[(\d+)\]/gm, ""));

    browser.close();
    return founded;
  }
}
