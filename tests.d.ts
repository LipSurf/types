declare interface ICommandTestContext {
    timeout: (amount: number) => Promise<void>;
}