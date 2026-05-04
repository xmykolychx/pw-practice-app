import {Page} from '@playwright/test';
import {NavigationPage} from './navigationPage';
import {FormLayoutsPage} from './formLayoutsPage';
import {DatepickerPage} from './datepickerPage';

export class PageManager {
    private readonly navigationPage: NavigationPage;
    private readonly formLayoutsPage: FormLayoutsPage;
    private readonly datepickerPage: DatepickerPage;
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.navigationPage = new NavigationPage(this.page);
        this.formLayoutsPage = new FormLayoutsPage(this.page);
        this.datepickerPage = new DatepickerPage(this.page);
    }
    
    toNavigationPage() {
        return this.navigationPage;
    }

    toFormLayoutsPage() {
        return this.formLayoutsPage;
    }

    toDatepickerPage() {
        return this.datepickerPage;
    }
}