import { expect, test } from '@playwright/test';

test.describe('i18n', () => {
  test('vào / thì chuyển sang /vi', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/vi$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Một ly matcha'
    );
  });

  test('đổi ngôn ngữ sang English', async ({ page }) => {
    await page.goto('/vi');
    await page.getByRole('button', { name: /Đổi ngôn ngữ/ }).click();
    await page.getByRole('menuitemradio', { name: 'English' }).click();

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'One cup of matcha'
    );
    await expect(page.getByRole('contentinfo')).toContainText(
      'Go Vap District'
    );
  });

  test('trang không tồn tại hiển thị 404 đã dịch', async ({ page }) => {
    const res = await page.goto('/en/khong-co');
    expect(res?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: 'Page not found' })
    ).toBeVisible();
  });
});

test.describe('menu', () => {
  test('lọc theo Bánh', async ({ page }) => {
    await page.goto('/vi#menu');
    const menu = page.locator('#menu');
    await expect(
      menu.getByRole('heading', { name: 'Matcha Latte' })
    ).toBeVisible();

    const response = page.waitForResponse(
      (r) => r.url().includes('/api/menu') && r.url().includes('bakery')
    );
    await menu.getByRole('tab', { name: 'Bánh' }).click();
    expect((await response).status()).toBe(200);

    await expect(
      menu.getByRole('heading', { name: 'Croissant Bơ' })
    ).toBeVisible();
    await expect(
      menu.getByRole('heading', { name: 'Matcha Latte' })
    ).toHaveCount(0);
  });
});

test.describe('gallery', () => {
  test('mở lightbox, chuyển ảnh bằng phím và đóng', async ({ page }) => {
    await page.goto('/vi#gallery');
    await page
      .locator('#gallery')
      .getByRole('button', { name: /Phóng to ảnh/ })
      .first()
      .click();

    const dialog = page.getByRole('dialog', { name: 'Thư viện ảnh' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId('lightbox-counter')).toHaveText('1 / 8');

    await page.keyboard.press('ArrowRight');
    await expect(dialog.getByTestId('lightbox-counter')).toHaveText('2 / 8');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});

test.describe('SEO', () => {
  test('có JSON-LD CafeOrCoffeeShop, hreflang và canonical', async ({
    page
  }) => {
    await page.goto('/vi');

    const jsonLd = JSON.parse(
      await page
        .locator('script[type="application/ld+json"]')
        .first()
        .innerText()
    );
    expect(jsonLd['@type']).toBe('CafeOrCoffeeShop');
    expect(jsonLd.telephone).toBe('+84388738680');
    expect(jsonLd.address.streetAddress).toBe('93 Trần Thị Nghỉ');
    expect(jsonLd.openingHoursSpecification[0]).toMatchObject({
      opens: '08:00',
      closes: '21:30'
    });

    for (const lang of ['vi', 'en', 'x-default']) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${lang}"]`)
      ).toHaveCount(1);
    }
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/vi$/
    );
  });

  test('sitemap và robots', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('/vi</loc>');
    expect(sitemap).toContain('/en</loc>');
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Disallow: /api/');
  });

  test('link skip to content đưa focus tới nội dung chính', async ({
    page
  }) => {
    await page.goto('/vi');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Bỏ qua tới nội dung chính' });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe('nút lên đầu trang', () => {
  test('ẩn ở đầu trang, hiện khi cuộn xuống, bấm thì về đầu', async ({
    page
  }) => {
    await page.goto('/vi');
    const button = page.getByRole('button', { name: 'Lên đầu trang' });
    await expect(button).toHaveCount(0);

    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect(button).toBeVisible();

    await button.click();
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 })
      .toBeLessThan(10);
    await expect(button).toHaveCount(0);
  });
});

test.describe('đặt món trên GrabFood', () => {
  // Chặn request ra Grab thật, chỉ kiểm tra trình duyệt điều hướng tới đúng link
  test.beforeEach(async ({ context }) => {
    await context.route(/grab\.com/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<title>Grab</title>'
      })
    );
  });

  test('máy tính: mở GrabFood ở tab mới', async ({ page, context }) => {
    await page.goto('/vi#order');
    const popupPromise = context.waitForEvent('page');
    await page.getByTestId('grabfood-button').click();
    const popup = await popupPromise;
    expect(popup.url()).toContain('food.grab.com');
    await expect(page).toHaveURL(/\/vi#order$/);
  });

  test.describe('điện thoại', () => {
    test.use({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 }
    });

    test('mở ngay trong tab hiện tại để hệ điều hành chuyển sang app Grab', async ({
      page
    }) => {
      await page.goto('/vi#order');
      await page.getByTestId('grabfood-button').tap();
      await page.waitForURL(/food\.grab\.com/);
    });
  });
});
