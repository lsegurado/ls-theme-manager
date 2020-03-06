import { Theme, DocumentTheme } from "./Types";

export default class ThemeUtils {

    public static setTheme(theme: Theme) {
        if (theme === 'system') {
            document.documentElement.setAttribute('theme', ThemeUtils.getSystemPreferenceTheme());
            document.documentElement.setAttribute('use-system-preferred-theme', 'enabled');
        } else {
            document.documentElement.setAttribute('theme', theme);
            document.documentElement.setAttribute('use-system-preferred-theme', 'disabled');
        }
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