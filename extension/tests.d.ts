declare type Client = {
  id: string;
  client: WebdriverIO.BrowserObject;
  // only necessary on host
  port?: number;
  driver?: import("child_process").ChildProcess;
};

declare interface WebdriverIOTestContext {
  id: string;
  // need to wrap in an object/array, otherwise
  // primitives (eg. port number) will be copied by value
  // instead of reference
  clients: Client[];
}

declare interface ICommandTestContext extends WebdriverIOTestContext {
  localPageDomain: string;
  sleep: (amount: number) => Promise<void>;
  activate: () => Promise<void>;
  waitForTagCondition(
    client: WebdriverIO.BrowserObject,
    condition: (numTags) => boolean,
    errorStr?: string
  ): Promise<number>;
  getInnerText(
    client: WebdriverIO.BrowserObject,
    selectorStr: string
  ): Promise<string>;
  pageHasText: (text: string) => Promise<boolean>;
}
