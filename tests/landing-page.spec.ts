import { test, expect } from "@playwright/test";

test("landing page header", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(page.getByRole("link", { name: "IMOS Logo" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Australian Ocean Data Network" }).first()
  ).toBeVisible();
});

test("landing page nav and banner", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(
    page.getByRole("heading", { name: "Open Access to Ocean Data" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Data" }).click();
  await expect(page.getByRole("menuitem")).toContainText("Item1");
});

test("landing page search bar", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await page.getByRole("button", { name: "Filters" }).click();
  await expect(page.getByRole("main")).toContainText("Filters");
  await page.getByRole("heading", { name: "Time Range" }).click();
  await expect(page.getByRole("main")).toContainText("Time Range");
  await expect(page.getByRole("main")).toContainText("Data Delivery Mode");
  await expect(page.getByRole("main")).toContainText("Real-time");
  await expect(page.getByRole("main")).toContainText("Acoustics");
});

test("landing page smart panel", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(page.getByRole("main")).toContainText("Get started");
});
