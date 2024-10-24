import { test, expect } from "@playwright/test";

test("Login User with incorrect email and password", async ({ page }) => {
  // 1. Launch browser and navigate to URL
  await page.goto("http://automationexercise.com");

  // 3. Verify that home page is visible successfully
  await expect(page).toHaveTitle(/Automation Exercise/);

  // 4. Click on 'Signup / Login' button
  await page.click('a[href="/login"]');

  // 5. Verify 'Login to your account' is visible
  await expect(
    page.locator('h2:has-text("Login to your account")')
  ).toBeVisible();

  // 6. Enter incorrect email address and password
  await page.fill('input[data-qa="login-email"]', "incorrect@example.com");
  await page.fill('input[data-qa="login-password"]', "wrongpassword");

  // 7. Click 'login' button
  await page.click('button[data-qa="login-button"]');

  // 8. Verify error 'Your email or password is incorrect!' is visible
  await expect(
    page.locator('p:has-text("Your email or password is incorrect!")')
  ).toBeVisible();
});

test("Search Product", async ({ page }) => {
  // 1. Launch browser and navigate to URL
  await page.goto("http://automationexercise.com");

  // 3. Verify that home page is visible successfully
  await expect(page).toHaveTitle(/Automation Exercise/);

  // 4. Click on 'Products' button
  await page.click('a[href="/products"]');

  // 5. Verify user is navigated to ALL PRODUCTS page successfully
  await expect(page.locator('h2:has-text("All Products")')).toBeVisible();

  // 6. Enter product name in search input and click search button
  await page.fill('input[id="search_product"]', "shirt");
  await page.click('button[id="submit_search"]');

  // 7. Verify 'SEARCHED PRODUCTS' is visible
  await expect(page.locator('h2:has-text("Searched Products")')).toBeVisible();

  // 8. Verify all the products related to search are visible
  const products = await page.locator(".productinfo").count();
  expect(products).toBeGreaterThan(0);
});

test("Add Products in Cart", async ({ page }) => {
  // 1. Launch browser and navigate to URL
  await page.goto("http://automationexercise.com");

  // 3. Verify that home page is visible successfully
  await expect(page).toHaveTitle(/Automation Exercise/);

  // 4. Click 'Products' button
  await page.click('a[href="/products"]');

  // 5. Hover over first product and click 'Add to cart'
  const firstProduct = page.locator('.productinfo:has(a[data-product-id="1"])');
  await firstProduct.hover();
  await firstProduct.locator('a[data-product-id="1"]').click(); // Ensure the click is on the right element

  // 6. Click 'Continue Shopping' button
  await page.click('button:has-text("Continue Shopping")');

  // 7. Hover over second product and click 'Add to cart'
  const secondProduct = page.locator(
    '.productinfo:has(a[data-product-id="2"])'
  );
  await secondProduct.hover();
  await secondProduct.locator('a[data-product-id="2"]').click();

  // 8. Click 'View Cart' button
  await page.click('a[href="/view_cart"]');

  // 9. Verify both products are added to Cart
  const cartProducts = await page.locator(".cart_product").count();
  expect(cartProducts).toBe(2);

  // 10. Verify their prices, quantity, and total price
  const firstProductPrice = await page
    .locator("tr:nth-child(1) .cart_price")
    .textContent();
  const secondProductPrice = await page
    .locator("tr:nth-child(2) .cart_price")
    .textContent();

  expect(firstProductPrice?.trim()).toContain("Rs.");
  expect(secondProductPrice?.trim()).toContain("Rs.");
});

test("Add to cart from Recommended items", async ({ page }) => {
  await page.goto('http://automationexercise.com');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const recommendedItemsSection = await page.locator('h2:has-text("recommended items")');
  await expect(recommendedItemsSection).toBeVisible();

  const productContainer = await page.locator('#recommended-item-carousel .active.left .productinfo:has(p:has-text("Men Tshirt"))');
  await productContainer.locator('a:has-text("Add to cart")').click();

  await page.click('a:has-text("View Cart")');

  const cartProduct = await page.locator('.table-responsive .cart_description:has(a:has-text("Men Tshirt"))');
  await expect(cartProduct).toBeVisible();
});


test('View Category Products', async ({ page }) => {
  // Задаємо тайм-аут для тесту
  test.setTimeout(60000);

  // 1. Відкрити сторінку
  await page.goto('http://automationexercise.com');

  // 2. Перевірити, що категорії відображаються на лівій панелі
  const categoriesVisible = await page.isVisible('div.left-sidebar h2:has-text("Category")');
  expect(categoriesVisible).toBeTruthy();

  // 3. Клікнути на категорію 'Women'
  await page.click('a[href="#Women"]');

  // 4. Клікнути на підкатегорію 'Dress' у категорії 'Women'
  await page.click('a[href="/category_products/1"]');

  // 5. Перевірити, що сторінка категорії відображається, і підтвердити текст "WOMEN - DRESS PRODUCTS"
  const categoryHeader = await page.textContent('h2.title.text-center');
  expect(categoryHeader).toContain('Women - Dress Products');

  // 6. Клікнути на категорію 'Men'
  await page.click('a[href="#Men"]');

  // 7. Дочекатися, поки підкатегорія 'T-Shirts' стане видимою
  await page.waitForSelector('#Men .panel-body a:has-text("Tshirts")', { timeout: 60000 });

  // 8. Клікнути на підкатегорію 'T-Shirts'
  await page.click('a[href="/category_products/3"]');

  // 9. Перевірити, що сторінка підкатегорії відображається з текстом "MEN - T-SHIRTS PRODUCTS"
  const menCategoryHeader = await page.textContent('h2.title.text-center');
  expect(menCategoryHeader).toContain('Men - Tshirts Products');
});
