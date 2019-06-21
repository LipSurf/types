import { By, until, Key, WebDriver } from 'selenium-webdriver';
import { NotAssertion, IsAssertion, TrueAssertion } from 'ava';

declare interface IBot {
    say(phrase: string): Promise<void>;
}

declare interface ICommandTestContext {
    driver: WebDriver;
    By: By;
    Key: any;
    until: any;
    bot: IBot;
    assert: {
        notEqual: NotAssertion,
        equal: IsAssertion,
        true: TrueAssertion,
    };
    say: () => Promise<void>;
    loadPage: (url: string) => Promise<void>;
}