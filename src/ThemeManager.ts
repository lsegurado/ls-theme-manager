import { Theme, DocumentTheme } from "./Types";

export interface OnThemeChangeFunction {
    (newTheme: Theme): void;
}

export default class ThemeManager {
    private onThemeChange: OnThemeChangeFunction;

    constructor(onThemeChange: OnThemeChangeFunction) {
        const localStorageResult = localStorage.getItem('theme');
        const theme: Theme = localStorageResult === 'dark' || localStorageResult === 'light' || localStorageResult === 'system' ? localStorageResult : 'system';

        this.onThemeChange = onThemeChange;
        this.setTheme(theme);

        new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type == "attributes") {
                    if (mutation.attributeName === 'theme' || mutation.attributeName === 'use-system-preferred-theme') {
                        localStorage.setItem('theme', ThemeManager.getTheme());
                    }
                }
            });
        }).observe(document.documentElement, {
            attributes: true //configure it to listen to attribute changes
        })
    }

    public setTheme(theme: Theme) {
        if (theme === 'system') {
            document.documentElement.setAttribute('theme', ThemeManager.getSystemPreferenceTheme());
            document.documentElement.setAttribute('use-system-preferred-theme', 'enabled');
        } else {
            document.documentElement.setAttribute('theme', theme);
            document.documentElement.setAttribute('use-system-preferred-theme', 'disabled');
        }
        this.onThemeChange(theme);
    }

    public static getTheme(): Theme {
        return this.isUsingSystemPreferences() ? 'system' : this.getDocumentTheme();
    }

    public static getDocumentTheme(): DocumentTheme {
        return document.documentElement.getAttribute('theme') === 'dark' ? 'dark' : 'light';
    }

    public static getSystemPreferenceTheme(): DocumentTheme {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    public static isUsingSystemPreferences(): boolean {
        return document.documentElement.getAttribute('use-system-preferred-theme') === 'enabled';
    }
}