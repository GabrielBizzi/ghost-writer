import puppeteer from "puppeteer";
import qs from "qs";

export default class Google {
  constructor(
    opts = {
      q: "",
      oq: "",
      aqs: "chrome.1.69i57j0i22i30.3470j0j7",
      sourceid: "chrome",
      ie: "UTF-8",
    }
  ) {
    let { q, oq, aqs, sourceid, ie } = opts;

    if (q.length <= 0 && oq.length <= 0)
      throw Error("There must be a 'search'");

    this.q = q;
    this.oq = oq;
    this.aqs = aqs;
    this.sourceid = sourceid;
    this.ie = ie;
  }

  async search() {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    const queryString = qs.stringify({ q: this.q, oq: this.oq });
    const url = `https://www.google.com/search?${queryString}&${this.aqs}&sourceid=${this.sourceid}&ie=${this.ie}`;
    await page.goto(url);

    const content = await page.$$eval("p", (element) =>
      element.map((el, _index) => ({
        index: _index,
        text: el.innerText,
      }))
    );

    const founded = content.map((item) => item.text.replace(/\[(\d+)\]/gm, ""));

    console.log(founded);
  }
}
