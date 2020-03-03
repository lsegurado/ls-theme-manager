import {Theme, DocumentTheme} from "./Types";

export default class ThemeManager {
    constructor() {
        const localStorageResult = localStorage.getItem('theme');
        const theme: Theme = localStorageResult === 'dark' || localStorageResult === 'light' || localStorageResult === 'system' ? localStorageResult : 'system';
        this.setTheme(theme);

        const self = this;
        new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type == "attributes") {
                    if (mutation.attributeName === 'theme' || mutation.attributeName === 'use-system-preferred-theme') {
                        localStorage.setItem('theme', self.getTheme());
                    }
                }
            });
        }).observe(document.documentElement, {
            attributes: true //configure it to listen to attribute changes
        })
    }

    setTheme(theme: Theme) {
        if (theme === 'system') {
            document.documentElement.setAttribute('theme', this.getSystemPreferenceTheme());
            document.documentElement.setAttribute('use-system-preferred-theme', 'enabled');
        } else {
            document.documentElement.setAttribute('theme', theme);
            document.documentElement.setAttribute('use-system-preferred-theme', 'disabled');
        }
    }

    getTheme(): Theme {
        return this.isUsingSystemPreferences() ? 'system' : this.getDocumentTheme();
    }

    getDocumentTheme(): DocumentTheme {
        return document.documentElement.getAttribute('theme') === 'dark' ? 'dark' : 'light';
    }

    private getSystemPreferenceTheme(): DocumentTheme {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    private isUsingSystemPreferences(): boolean {
        return document.documentElement.getAttribute('use-system-preferred-theme') === 'enabled';
    }
}