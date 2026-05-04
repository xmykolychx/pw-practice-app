import {test} from '../test-options';
import {PageManager} from '../page-objects/pageManager';
import { faker } from '@faker-js/faker';

// test.beforeEach(async ({page}) => {
//   await page.goto('http://localhost:4200/');
// });

test('parametrized methods', async ({pageManager}) => {
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`;
    const randomPassword = faker.internet.password();

    await pageManager.toFormLayoutsPage().submitGridFromCreds(randomEmail, randomPassword, 'Option 1');
    await pageManager.toFormLayoutsPage().submitInlineForm(randomFullName, randomEmail, true);
});