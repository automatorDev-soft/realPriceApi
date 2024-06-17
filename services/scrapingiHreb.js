import puppeteer from "puppeteer";
import cheerio from "cheerio";
import { products } from "../data/products.js";

export const fetchingIhreb = async (searchedProduct) => {
    try {
        const url = `https://www.ihreb.com/search?q=${searchedProduct}`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set a user agent to make the request look like a legitimate browser request
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");

        await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

        // Wait for the page to fully load
        await page.waitForLoadState('networkidle2');

        const html = await page.content();
        const $ = cheerio.load(html);

        // Create an array of promises for fetching product details
        $(".product.ga-product").each(function () {
            let productUrl = $(this).find("a").attr("href");
            if (!productUrl.startsWith("http")) {
                productUrl = `https://www.ihreb.com/${productUrl}`;
            }
            const productData = {
                name: $(this).find(".product-title").text(),
                price: $(this).find(".price discount-red").text(),
                imageUrl: $(this).find("img.product-image").attr("src"),
                source: "ihreb",
                productOriginUrl: productUrl,
                details: {
                    productDescription: "",
                    comments: [],
                },
            };
            products.push(productData);
        });

        await browser.close();
    } catch (error) {
        console.error("An error occurred while fetching products:", error);
    }
};