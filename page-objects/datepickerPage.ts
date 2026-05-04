import { expect,Page } from '@playwright/test';
import { HelperBase } from './helperBase';

export class DatepickerPage extends HelperBase {
    constructor(page: Page) {
        super(page);
    }

    async selectDateFromToday(numberOfDays: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker');
        await calendarInputField.click();
        const expectedDateString = await this.selectDateFromCalendar(numberOfDays);


        await expect(calendarInputField).toHaveValue(expectedDateString);
    }

    async selectDateRangeFromToday(startDate: number, endDate: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker');
        await calendarInputField.click();
        const expectedStartDateString = await this.selectDateFromCalendar(startDate);
        const expectedEndDateString = await this.selectDateFromCalendar(endDate);
        const expectedRangeString = `${expectedStartDateString} - ${expectedEndDateString}`;

        await expect(calendarInputField).toHaveValue(expectedRangeString);
    }

    private async selectDateFromCalendar(numberOfDays: number) {
        let date = new Date();
        date.setDate(date.getDate() + numberOfDays);
        const expectedDate = date.getDate().toString();
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' });
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });
        const expectedYear = date.getFullYear();
        const expectedDateString = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`;

        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation data-name="chevron-right"').click();
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent();
        }

        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click();
        return expectedDateString;
    }
}