import {test, expect} from '@playwright/test';

test('input fields', async ({page}, testInfo) => {
    await page.goto('http://localhost:4200');
    if(testInfo.project.name === 'Mobile Safari') {
        await page.locator('.sidebar-toggle').click();
        await page.screenshot({path: 'screenshots/mobile-sign-in.png'});
    }
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
    if(testInfo.project.name === 'Mobile Safari') {
        await page.locator('.sidebar-toggle').click();
    }
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'});
    await usingTheGridEmailInput.fill('test@test.com');
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.type('test2@test.com', {delay: 100});
});