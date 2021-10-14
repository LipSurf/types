declare type Client = {
  id: string;
  client: WebdriverIO.Browser;
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

declare interface ICmdTestContext extends WebdriverIOTestContext {
  localPageDomain: string;
  sleep: (amount: number) => Promise<void>;
  activate: () => Promise<void>;
  focusAddressBar: () => Promise<void>;
  waitForTagCondition(
    client: WebdriverIO.Browser,
    condition: (numTags) => boolean,
    errorStr?: string
  ): Promise<number>;
  getInnerText(
    client: WebdriverIO.Browser,
    selectorStr: string
  ): Promise<string>;
  pageHasText: (text: string) => Promise<boolean>;
}
