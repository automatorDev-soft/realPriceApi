import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://hmizate.ma/", { waitUntil: "domcontentloaded" });

  await page.waitForSelector(".tvproduct-wrapper");

  const products = await page.evaluate(() => {
    let products = [];
    let elements = document.querySelectorAll(".tvproduct-wrapper");

    elements.forEach((element) => {
      let img =
        element.querySelector(".thumbnail img")?.getAttribute("src") || "";
      let name =
        element.querySelector(".tvproduct-name")?.textContent.trim() || "";
      let price = element.querySelector(".price")?.textContent || "";
      let description =
        element.querySelector(".product-description")?.textContent || "";
      let stars =
        element
          .querySelector(".tvall-product-star-icon")
          ?.getAttribute("src") || "";

      products.push({
        img: img,
        name: name,
        price: price,
        currency: "MAD",
        description: description,
        stars: stars,
        source: "Hmizate",
      });
    });

    return products;
  });

  console.log(products);
  console.log(products.length);
  await browser.close();
})();
