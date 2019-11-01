declare interface ICommandTestContext {
    localPageDomain: string;
    timeout: (amount: number) => Promise<void>;
}