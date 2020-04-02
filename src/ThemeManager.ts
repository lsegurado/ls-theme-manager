import { Theme, DocumentTheme } from "./Types";
import ThemeUtils from "./ThemeUtils";

export interface OnThemeChangeFunction {
    (newTheme: Theme, newDocumentTheme: DocumentTheme): void;
}

export default class ThemeManager {
    private onThemeChange: OnThemeChangeFunction;

    constructor(onThemeChange: OnThemeChangeFunction) {
        const localStorageResult = localStorage.getItem('theme');
        const theme: Theme = localStorageResult === 'dark' || localStorageResult === 'light' || localStorageResult === 'system' ? localStorageResult : 'system';

        this.onThemeChange = onThemeChange;
        ThemeUtils.setTheme(theme);
        onThemeChange(theme, ThemeUtils.getDocumentTheme());

        new MutationObserver(() => {
            this.onThemeChange(ThemeUtils.getTheme(), ThemeUtils.getDocumentTheme());
            localStorage.setItem('theme', ThemeUtils.getTheme());
        }).observe(document.documentElement, {
            attributes: true, //configure it to listen to attribute changes
            attributeFilter: ['theme', 'use-system-preferred-theme']
        });
    }
}