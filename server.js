// import puppeteer from 'puppeteer';

// (async () => {
//     // Launch the browser
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     try {
//         // Increase the navigation timeout to 60 seconds (60000 ms)
//         await page.goto('https://www.decathlon.ma/?decathlon_prod_fr%5Bquery%5D=trottinette', {
//             waitUntil: 'networkidle2',
//             timeout: 60000
//         });

//         // Wait for the elements to be present in the DOM
//         await page.waitForSelector('#hits > div > div > ol > li', { timeout: 60000 });

//         // Extract the product information
//         const products = await page.evaluate(() => {
//             const productList = [];
//             const elements = document.querySelectorAll('#hits > div > div > ol > li');

//             for (let element of elements) {  // Declare 'element' with 'let'
//                 const nameElement = element.querySelector('h3.name-product a');
//                 const priceElement = element.querySelector('span.price');
//                 const imageElement = element.querySelector('div.row div a img');

//                 // Check if the elements exist before accessing their properties
//                 if (imageElement) {
//                     productList.push({
//                         name: nameElement.textContent.trim(),
//                         price: priceElement.textContent.trim(),
//                         currency: "MAD",
//                         url: nameElement.href, // Get the href attribute of the <a> tag
//                         imageUrl: imageElement.src
//                     });
//                 }
//             }

//             return productList;
//         });

//         console.log(products); // Output the extracted product data
//     } catch (error) {
//         console.error('Error during navigation:', error);
//     } finally {
//         // Close the browser
//         await browser.close();
//     }
// })();
