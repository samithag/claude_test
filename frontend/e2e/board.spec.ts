import { expect, type Locator, type Page, test } from "@playwright/test";

async function dragCard(page: Page, source: Locator, target: Locator) {
  const from = await source.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) {
    throw new Error("Missing drag coordinates");
  }
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height - 40, {
    steps: 25,
  });
  await page.mouse.up();
}

test("loads dummy board data", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Product Launch" })).toBeVisible();
  await expect(page.getByTestId("board")).toBeVisible();
  await expect(page.getByText("Draft onboarding emails")).toBeVisible();
  await expect(page.getByTestId("column-col-backlog")).toBeVisible();
  await expect(page.getByTestId("column-col-ready")).toBeVisible();
  await expect(page.getByTestId("column-col-progress")).toBeVisible();
  await expect(page.getByTestId("column-col-review")).toBeVisible();
  await expect(page.getByTestId("column-col-done")).toBeVisible();
});

test("renames a column", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("column-title-col-backlog").click();
  const input = page.getByRole("textbox", { name: "Column name" });
  await input.fill("Icebox");
  await input.press("Enter");
  await expect(page.getByTestId("column-title-col-backlog")).toHaveText("Icebox");
});

test("adds a card to a column", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("add-card-col-ready").click();
  await page.getByLabel("Title").fill("QA checklist");
  await page.getByLabel("Details").fill("Cover drag and drop on empty columns.");
  await page.getByTestId("card-submit").click();
  await expect(page.getByTestId("column-col-ready").getByText("QA checklist")).toBeVisible();
});

test("deletes a card", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("card-onboarding").click();
  await page.getByTestId("card-delete").click();
  await expect(page.getByTestId("card-onboarding")).toHaveCount(0);
});

test("drags a card to another column", async ({ page }) => {
  await page.goto("/");
  await dragCard(
    page,
    page.getByTestId("card-pricing"),
    page.getByTestId("column-col-done"),
  );
  await expect(
    page.getByTestId("column-col-done").getByTestId("card-pricing"),
  ).toBeVisible();
  await expect(
    page.getByTestId("column-col-ready").getByTestId("card-pricing"),
  ).toHaveCount(0);
});
