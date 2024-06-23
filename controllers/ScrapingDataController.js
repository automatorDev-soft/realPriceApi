import { products } from "../data/products.js";
import { fetchingAvito } from "../services/scrapingAvito.js";
import { fetchDecathlonData } from "../services/scrapingDecathlon.js";
import { fetchingJumia } from "../services/scrapingJumia.js";
import { fetchAliexpressProducts } from "../services/scrapingAliexpress.js";

export const getAllData = async (req, res) => {
  try {
    await fetchAliexpressProducts(req.params.product);
    await fetchingAvito(req.params.product);
    await fetchDecathlonData(req.params.product);
    await fetchingJumia(req.params.product);
    res.json({ products: products, howManyProducts: products.length });
  } catch (err) {
    console.log("Error fetch: ", err);
    res.status(500).json({ error: err.message });
  }
};
