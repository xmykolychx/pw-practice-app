import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}, testInfo) => {
  await page.goto('http://localhost:4200/');
  if (testInfo.title.includes('sliders')) {
    await page.getByText('Forms').click();
  } else {
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
  }
 
});

test('test', async ({page}) => {
    await page.locator('#inputEmail1').fill(process.env.USERNAME || 'test@gmail.com');
    await page.locator('#inputPassword2').fill(process.env.PASSWORD || 'test123');
    await page.getByRole('button', { name: 'Sign in' }).first().click();
});

test('locating parent element', async ({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', { name: 'Email' }).click();
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click
});

test('reusing locators', async ({page}) => {
    const email = page.locator('#inputEmail1');
    const password = page.locator('#inputPassword2');
    const signInButton = page.getByRole('button', { name: 'Sign in' }).first();

    await email.fill('test@@gmail.com');
    await password.fill('test123');
    await signInButton.click();
});

test('assertions', async ({page})  => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button');

    const text = await basicFormButton.textContent();
    console.log(text);

    await expect(basicFormButton).toHaveText('Submit');
})

test('input fields', async ({page}) => {
    const usingTheGridEmail = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', { name: 'Email' });
    const usingTheGridPassword = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', { name: 'Password' });

    await usingTheGridEmail.fill('test@gmail.com');
    await usingTheGridEmail.clear();
    await usingTheGridEmail.pressSequentially('test@gmail.com', {delay: 100});
    await usingTheGridPassword.fill('test123');

    await expect(usingTheGridEmail).toHaveValue('test@gmail.com');
    await expect(usingTheGridPassword).toHaveValue('test123');      
});

test('checkboxes and radio buttons', async ({page}) => {
    const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"});

    await usingTheGridForm.getByRole('radio', { name: 'Option 1'}).check({force: true});
    const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked();
    console.log(radioStatus);
    expect(radioStatus).toBeTruthy();
    await expect(usingTheGridForm.getByRole('radio', { name: 'Option 2' })).not.toBeChecked();

    await usingTheGridForm.getByRole('radio', { name: 'Option 2'}).check({force: true});
    await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
});

test('checkboxes', async ({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({force: true});
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({force: true});

    const allCheckboxes = page.getByRole('checkbox');
    const count = await allCheckboxes.count();
    console.log(count); 

    for (const box of await allCheckboxes.all()) {
        await box.check({force: true});
        expect(await box.isChecked()).toBeTruthy();
    }
});

test('lists and dropdowns', async ({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select');
    await dropdownMenu.click();
    
    page.getByRole('list'); //ul tag
    page.getByRole('listitem'); //li tag

    //const optionList = page.getByRole('list').locator('nb-option');
    const optionList = page.locator('nb-option-list nb-option');
    await expect(optionList).toHaveCount(4);
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);
    await optionList.filter({hasText: 'Cosmic'}).click();
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    const colors = {
        Light: 'rgb(255, 255, 255)',
        Dark: 'rgb(34, 43, 69)',
        Cosmic: 'rgb(50, 50, 89)',
        Corporate: 'rgb(255, 255, 255)'
    };

    await dropdownMenu.click();
    for(const color in colors) {
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if(color != 'Corporate') {
            await dropdownMenu.click();
        }
    }
});

test('tooltips', async ({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const tooltipCard = page.locator('nb-card', {hasText: "Tooltip Placements"});
    await tooltipCard.getByRole('button', { name: 'Top' }).hover();

    page.getByRole('tooltip') //if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip');
});

test('dialog box', async ({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        dialog.accept();
    })

    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click();
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
});

test('web tables', async ({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //1 get the row by any test in this row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'});
    await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill('25');
    await page.locator('.nb-checkmark').click();

    //2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
    const targetRowById = page.getByRole('row', {name:"11"}).filter({has: page.locator('td').nth(1).getByText('11')});
    await targetRowById.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('E-mail').clear();
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
    await page.locator('.nb-checkmark').click();
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com');

    //3 test filter of the table
    const ages = ["20", "30", "40", "200"];

    for (let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(500);
        const ageRows = page.locator('tbody tr');

        for(let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent();
            
            if(age === "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found');
            } else {
                expect(cellValue).toEqual(age);
            }
        }
    }
});

test('date picker', async ({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarInputField = page.getByPlaceholder('Form Picker');
    await calendarInputField.click();

    let date = new Date();
    date.setDate(date.getDate() + 14);
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' });
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });
    const expectedYear = date.getFullYear();
    const expectedDateString = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation data-name="chevron-right"').click();
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();
    await expect(calendarInputField).toHaveValue(expectedDateString);
});

test('sliders', async({page}) => {
    // update attribute value
    // const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
    // await tempGauge.evaluate( node => {
    //     node.setAttribute('cx', '100'); 
    //     node.setAttribute('cy', '100'); 
    // });
    // await tempGauge.click();

    // mouse movement
    // const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
    // await tempBox.scrollIntoViewIfNeeded();

    // const box = await tempBox.boundingBox();
    // const x = box.x + box.width / 2;
    // const y = box.y + box.height / 2;

    // await page.mouse.move(x, y);
    // await page.mouse.down();
    // await page.mouse.move(x + 100, y);
    // await page.mouse.move(x + 100, y + 100);
    // await page.mouse.up();
    // await expect(tempBox).toContainText('30');

    //const humidityBox = page.locator('[tabtitle="Humidity"] ngx-humidity-dragger');
    const humidityBox = page.locator('[tabtitle="Humidity"]').locator('xpath=.//*[contains(@class, "dragger") or contains(@class, "slider")]').first();
    await page.getByText('Humidity').click(); // Click tab first to activate it
    await humidityBox.scrollIntoViewIfNeeded();

    const box = await humidityBox.boundingBox();
    if (!box) throw new Error('Humidity dragger element not found or not visible');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y);
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.up();
    await expect(humidityBox).toContainText('99');

});