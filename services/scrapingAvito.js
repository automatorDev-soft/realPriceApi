import puppeteer from "puppeteer";
import cheerio from "cheerio";
import fetch from "node-fetch";

const searchedProduct = "chaire";
const url = `https://www.avito.ma/fr/maroc/${searchedProduct}`;
const data = [];

const fetchProductDetails = async (url, productData) => {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const productDescription = $(".sc-ij98yj-0.fAYGMO").text();
  const detailedProductData = {
    ...productData,
    details: {
      productDescription: productDescription,
      comments: []
    }
  };
  data.push(detailedProductData);
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Wait for the content to load
  await page.waitForSelector("a.sc-1jge648-0.eTbzNs");

  const html = await page.content();
  const $ = cheerio.load(html);

  // Create an array of promises for fetching product details
  const fetchDetailsPromises = $("a.sc-1jge648-0.eTbzNs").map(async function () {
    let productUrl = $(this).attr("href");
    if (!productUrl.startsWith('http')) {
      productUrl = `https://www.avito.ma${productUrl}`;
    }
    const productData = {
      name: $(this)
        .children(".sc-b57yxx-1.kBlnTB")
        .children("div")
        .children(".sc-1x0vz2r-0.czqClV")
        .text(),
      price: $(this)
        .children(".sc-b57yxx-1.kBlnTB")
        .children(".sc-b57yxx-0.ckugTG")
        .children('div').text(),
      imageUrl: $(this)
          .children('.sc-bsm2tm-0.kvxLpd')
          .children('.sc-bsm2tm-1.sUHsx')
          .children('.sc-bsm2tm-2.eDIowj')
          .children('img').attr('src'),
      source: 'avito',
      productOriginUrl: productUrl,
      starts: 'none',
    };
    return fetchProductDetails(productUrl, productData);
  }).get();

  // Wait for all promises to resolve
  await Promise.all(fetchDetailsPromises);

  console.log(data);
  await browser.close();
})();
