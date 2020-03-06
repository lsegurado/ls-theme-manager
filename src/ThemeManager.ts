import { Theme } from "./Types";
import ThemeUtils from "./ThemeUtils";

export interface OnThemeChangeFunction {
    (newTheme: Theme): void;
}

export default class ThemeManager {
    private onThemeChange: OnThemeChangeFunction;

    constructor(onThemeChange: OnThemeChangeFunction) {
        const localStorageResult = localStorage.getItem('theme');
        const theme: Theme = localStorageResult === 'dark' || localStorageResult === 'light' || localStorageResult === 'system' ? localStorageResult : 'system';

        this.onThemeChange = onThemeChange;
        ThemeUtils.setTheme(theme);
        onThemeChange(theme);

        new MutationObserver(() => {
            this.onThemeChange(ThemeUtils.getTheme());
            localStorage.setItem('theme', ThemeUtils.getTheme());
        }).observe(document.documentElement, {
            attributes: true, //configure it to listen to attribute changes
            attributeFilter: ['theme', 'use-system-preferred-theme']
        });
    }
}