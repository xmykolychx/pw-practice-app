import {expect, test} from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import {NavigationPage} from '../page-objects/navigationPage';
import {FormLayoutsPage} from '../page-objects/formLayoutsPage';
import {DatepickerPage} from '../page-objects/datepickerPage';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({page}) => {
  await page.goto('http://localhost:4200/');
});

test('navigate to form page', async ({page}) => {
    const pm = new PageManager(page);
    await pm.toNavigationPage().formLayoutsPage();
    await pm.toNavigationPage().datepickerPage();
    await pm.toNavigationPage().smartTablePage();
    await pm.toNavigationPage().toastrPage();
    await pm.toNavigationPage().tooltipPage();
});

test.describe('submit form with credentials', () => {
    test.describe.configure({retries: 2});
    
    test('submit form with credentials', async ({page}) => {
        const pm = new PageManager(page);
        const randomFullName = faker.person.fullName();
        const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`;
        const randomPassword = faker.internet.password();

        await pm.toNavigationPage().formLayoutsPage();
        await pm.toFormLayoutsPage().submitGridFromCreds(randomEmail, randomPassword, 'Option 1');
        await page.screenshot({path: 'screenshots/form-submission.png'});
        const buffer = await page.screenshot();
        console.log(buffer.toString('base64'));
        await pm.toFormLayoutsPage().submitInlineForm(randomFullName, randomEmail, true);
        await page.locator('nb-card', {hasText: 'Inline Form'}).screenshot({path: 'screenshots/inline-form-submission.png'});
        await pm.toNavigationPage().datepickerPage();
        await pm.toDatepickerPage().selectDateFromToday(14);
        await pm.toDatepickerPage().selectDateRangeFromToday(7, 14);
    });
});