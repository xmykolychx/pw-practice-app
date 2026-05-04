import { Page } from '@playwright/test';
import { HelperBase } from './helperBase';

export class FormLayoutsPage extends HelperBase {
    constructor(page: Page) {
        super(page);
    }

    async submitGridFromCreds(email: string, password: string, optionText: string) {
        const usingGridForm = this.page.locator('nb-card', {hasText: 'Using the Grid'});
        await usingGridForm.getByRole('textbox', {name: 'Email'}).fill(email);
        await usingGridForm.getByRole('textbox', {name: 'Password'}).fill(password);
        await usingGridForm.getByRole('radio', {name: optionText}).click({force: true});
        await usingGridForm.getByRole('button').click();
    }

    async submitInlineForm(name: string, email: string, rememberMe: boolean) {
        const inlineForm = this.page.locator('nb-card', {hasText: 'Inline form'});
        await inlineForm.getByRole('textbox', {name: 'Jane Doe'}).fill(name);
        await inlineForm.getByRole('textbox', {name: 'Email'}).fill(email);
        if (rememberMe) 
            await inlineForm.getByRole('checkbox').check({force: true});
        await inlineForm.getByRole('button').click();
    }    
}