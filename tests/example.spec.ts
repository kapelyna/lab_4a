import { test, expect } from "@playwright/test";

test("Login User with incorrect email and password", async ({ page }) => {
  await page.goto("http://automationexercise.com");
  await expect(page).toHaveTitle(/Automation Exercise/);
  await page.click('a[href="/login"]');
  await expect(page.locator('h2:has-text("Login to your account")')).toBeVisible();
  await page.fill('input[data-qa="login-email"]', "incorrect@example.com");
  await page.fill('input[data-qa="login-password"]', "wrongpassword");
  await page.click('button[data-qa="login-button"]');
  await expect(page.locator('p:has-text("Your email or password is incorrect!")')).toBeVisible();
});

test("Search Product", async ({ page }) => {
  await page.goto("http://automationexercise.com");
  await expect(page).toHaveTitle(/Automation Exercise/);
  await page.click('a[href="/products"]');
  await expect(page.locator('h2:has-text("All Products")')).toBeVisible();
  await page.fill('input[id="search_product"]', "shirt");
  await page.click('button[id="submit_search"]');
  await expect(page.locator('h2:has-text("Searched Products")')).toBeVisible();
  const products = await page.locator(".productinfo").count();
  expect(products).toBeGreaterThan(0);
});

test("Add Products in Cart", async ({ page }) => {
  await page.goto("http://automationexercise.com");
  await expect(page).toHaveTitle(/Automation Exercise/);
  await page.click('a[href="/products"]');
  const firstProduct = page.locator('.productinfo:has(a[data-product-id="1"])');
  await firstProduct.hover();
  await firstProduct.locator('a[data-product-id="1"]').click();
  await page.click('button:has-text("Continue Shopping")');
  const secondProduct = page.locator('.productinfo:has(a[data-product-id="2"])');
  await secondProduct.hover();
  await secondProduct.locator('a[data-product-id="2"]').click();
  await page.click('a[href="/view_cart"]');
  const cartProducts = await page.locator(".cart_product").count();
  expect(cartProducts).toBe(2);
  const firstProductPrice = await page.locator("tr:nth-child(1) .cart_price").textContent();
  const secondProductPrice = await page.locator("tr:nth-child(2) .cart_price").textContent();
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
  test.setTimeout(60000);
  await page.goto('http://automationexercise.com');
  const categoriesVisible = await page.isVisible('div.left-sidebar h2:has-text("Category")');
  expect(categoriesVisible).toBeTruthy();
  await page.click('a[href="#Women"]');
  await page.click('a[href="/category_products/1"]');
  const categoryHeader = await page.textContent('h2.title.text-center');
  expect(categoryHeader).toContain('Women - Dress Products');
  await page.click('a[href="#Men"]');
  await page.waitForSelector('#Men .panel-body a:has-text("Tshirts")', { timeout: 60000 });
  await page.click('a[href="/category_products/3"]');
  const menCategoryHeader = await page.textContent('h2.title.text-center');
  expect(menCategoryHeader).toContain('Men - Tshirts Products');
});
