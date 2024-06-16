import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer";
import fetch from "node-fetch";

let products = [];

const fetchAliexpressProductDetails = async (url, productData) => {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const regex = /[\n\*-\s+]/g;
  const productDescription = $("#root").text();
  const cleanedProductDescription = productDescription
    .replace(regex, " ")
    .trim();
  const detailedProductData = {
    ...productData,
    details: {
      productDescription: cleanedProductDescription,
      comments: [],
    },
  };
  products.push(detailedProductData);
};

const scrapingAlexpriss = async (searchedProduct) => {
  const url = `https://www.aliexpress.com/w/wholesale-${searchedProduct}.html`;

  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  // Create an array of promises for fetching product details
  const fetchDetailsPromises = $(
    "a.multi--container--1UZxxHY.cards--card--3PJxwBm.search-card-item"
  )
    .map(async function () {
      let productUrl = $(this).attr("href");
      if (!productUrl.startsWith("http")) {
        productUrl = "https:" + $(this).attr("href");
      }
      const productData = {
        name: $(this)
          .children(".multi--content--11nFIBL")
          .children(".multi--title--G7dOCj3")
          .children(".multi--titleText--nXeOvyr")
          .text()
          .trim(),
        price: $(this)
          .children(".multi--content--11nFIBL")
          .children(".multi--price--1okBCly")
          .children(".multi--price-sale--U-S0jtj")
          .text()
          .trim(),
        imageUrl:
          "https:" +
          $(this)
            .children(
              ".multi--image--2bIiWPB.multi--imagesGallery--3xCP4Ci.cards--image--1nakz5t"
            )
            .children(".images--multiImage--25mi-3K")
            .children(".images--hover--1N5tJXp")
            .children(".images--imageWindow--1Z-J9gn")
            .children("img")
            .attr("src"),
        source: "aliexpress",
        productOriginUrl: productUrl,
      };
      return fetchAliexpressProductDetails(productUrl, productData);
    })
    .get();

  // Wait for all promises to resolve
  await Promise.all(fetchDetailsPromises);
};

const fetchAvitoProductDetails = async (url, productData) => {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const productDescription = $(".sc-ij98yj-0.fAYGMO").text();
  const detailedProductData = {
    ...productData,
    details: {
      productDescription: productDescription,
      comments: [],
    },
  };
  products.push(detailedProductData);
};

const fetchingAvito = async (searchedProduct) => {
  const url = `https://www.avito.ma/fr/maroc/${searchedProduct}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Wait for the content to load
  await page.waitForSelector("a.sc-1jge648-0.eTbzNs");

  const html = await page.content();
  const $ = cheerio.load(html);

  // Create an array of promises for fetching product details
  const fetchDetailsPromises = $("a.sc-1jge648-0.eTbzNs")
    .map(async function () {
      let productUrl = $(this).attr("href");
      if (!productUrl.startsWith("http")) {
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
          .children("div")
          .text(),
        imageUrl: $(this)
          .children(".sc-bsm2tm-0.kvxLpd")
          .children(".sc-bsm2tm-1.sUHsx")
          .children(".sc-bsm2tm-2.eDIowj")
          .children("img")
          .attr("src"),
        source: "avito",
        productOriginUrl: productUrl,
      };
      return fetchAvitoProductDetails(productUrl, productData);
    })
    .get();

  // Wait for all promises to resolve
  await Promise.all(fetchDetailsPromises);
  await browser.close();
};

const fetchDecathlonData = async (product) => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Increase the navigation timeout to 60 seconds (60000 ms)
    await page.goto(
      `https://www.decathlon.ma/?decathlon_prod_fr%5Bquery%5D=${product}`,
      {
        waitUntil: "networkidle2",
        timeout: 60000,
      }
    );

    // Wait for the elements to be present in the DOM
    await page.waitForSelector("#hits > div > div > ol > li", {
      timeout: 60000,
    });

    // Extract the product information
    const data = await page.evaluate(() => {
      const productList = [];
      const elements = document.querySelectorAll("#hits > div > div > ol > li");

      for (let element of elements) {
        // Declare 'element' with 'let'
        const nameElement = element.querySelector("h3.name-product a");
        const priceElement = element.querySelector("span.price");
        const imageElement = element.querySelector("div.row div a img");

        // Check if the elements exist before accessing their properties
        if (imageElement) {
          productList.push({
            name: nameElement.textContent.trim(),
            price: priceElement.textContent.trim(),
            currency: "MAD",
            productOriginUrl: nameElement.href, // Get the href attribute of the <a> tag
            imageUrl: imageElement.src,
            source: "decathlon",
          });
        }
      }

      return productList;
    });
    products.push(...data); // Push the extracted product data to the 'products' array
  } catch (error) {
    console.error("Error during navigation:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
};

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
  await browser.close();
};

export const getAllData = async (req, res) => {
  try {
    await scrapingAlexpriss(req.params.product);
    await fetchingAvito(req.params.product);
    await fetchDecathlonData(req.params.product);
    await fetchingJumia(req.params.product);
    res.json({ products: products, howManyProducts: products.length });
  } catch (err) {
    console.log("Error fetch: ", err);
    res.status(500).json({ error: err.message });
  }
};
