import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { products } from "../data/products.js";

export const fetchingJumia = async (searchedProduct) => {
  const url = `https://www.jumia.ma/catalog/?q=${searchedProduct}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

  // Wait for the content to load
  await page.waitForSelector("a.core");

  const html = await page.content();
  const $ = cheerio.load(html);

  // Create an array of promises for fetching product details
  $("a.core").map(async function () {
    let productUrl = $(this).attr("href");
    if (!productUrl.startsWith("http")) {
      productUrl = `https://www.jumia.ma/${productUrl}`;
    }
    const productData = {
      name: $(this).children(".info").children("h3").text(),
      price: $(this).children(".info").children("div.prc").text(),
      imageUrl: $(this).children(".img-c").children("img.img").attr("data-src"),
      source: "Jumia",
      productOriginUrl: productUrl,
      details: {
        productDescription: "",
        comments: [],
      },
    };
    return products.push(productData);
  });

  //console.log(products);
  //console.log("length of products : " + products.length);

  await browser.close();
};

//fetchingJumia("tondouse");
