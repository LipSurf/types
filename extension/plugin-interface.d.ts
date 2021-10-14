/// <reference types="webdriverio"/>
/// <reference types="chrome"/>

declare type ExecutionContext<T> = import("ava").ExecutionContext<T>;
declare type IndicesPair = [number, number];
declare interface TsData {
  preTs: string;
  normTs: string;
}

declare interface IDisableable {
  enabled: boolean;
}

type ItemWAssocText<T> = { item: T; text: string[] };
type ClickableElement =
  | HTMLAnchorElement
  | HTMLButtonElement
  | HTMLInputElement;
type TabWithIdAndURL = chrome.tabs.Tab & { id: number; url: string };
// the element XFRAME_UNIQUE_ID attribute value, and the client rect of the element
type FrameElWOffsets = [string, ClientRect];

// for talking to iframes
type SpecialProp = "visible" | "pos" | "onTop";
type SpecialFn =
  | "clickOrFocus"
  | "blinkHighlight"
  | "highlight"
  | "unhighlightAll";

type StoreListener<T> = (newState: T) => Promise<void> | void;

declare interface IPlan {
  plan: plan;
}

type Serialized<T> = T extends string | number | boolean | null
  ? T
  : T extends RegExp | Function
  ? string
  : T extends Set<T> | Array<T>
  ? Iterable<T>
  : T extends object
  ? { [K in keyof T]: Serialized<T[K]> }
  : never;

// for 3rd party plugins definitions
declare interface ISimpleHomophones {
  [s: string]: string;
}

declare interface IReplacement {
  pattern: RegExp;
  replacement: string;
  context?: string | string[];
}

declare type SyncDynamicMatchFnResp =
  | [startMatchIndex: number, endMatchIndex: number, matchOutput?: any[]]
  | undefined
  | false;
declare type AsyncDynamicMatchFnResp = Promise<SyncDynamicMatchFnResp>;
declare type DynamicMatchFnResp =
  | SyncDynamicMatchFnResp
  | AsyncDynamicMatchFnResp;

declare type CmdArgExtras = any[] | undefined;
// the ...any[] should match CmdArgExtras but there's no way to do that along with allowing it to be undefined
declare type CmdArgs =
  | [transcript: TsData]
  | [transcript: TsData, ...cmdArgExtras: any[]];

declare interface IDynamicMatch {
  // `false` if partial match -- if there's a partial match we should delay other commands that
  //                  have a full match; because the user might be in the process of saying this longer
  //                  command where the partial match is a subset but also a matching command "ie. Help Wanted"
  //                  executing a different command from "Help"
  // can be a promise
  fn: (transcript: TsData) => DynamicMatchFnResp;
  description: string;
}

declare type INiceFn = (transcript: TsData, ...matchOutput: any[]) => string;

declare interface INiceCmd {
  // matchOutput is the array returned from the match function (if there's a match fn) or
  // the arguments from special match string (wildcard, numeral etc. type special params)
  nice?: string | INiceFn;
}

declare interface ILocalizedCmdBase extends INiceCmd {
  // the original name to match this command against
  name: string;
  description?: string;
}

declare interface IGlobalCmd {
  // let command match on any page (not restricted by plugin level match regex)
  global?: boolean;
}

declare interface IFnCmd {
  // matchOutput is the array returned from the match function (if there's a match fn) or
  // the arguments from special match string (wildcard, numeral etc. type special params)
  fn?: (transcript: TsData, ...matchOutput: any[]) => Promise<void>;
}

declare interface ILocalizedCmd extends ILocalizedCmdBase {
  // strings should not have any punctuation in them as puncutation
  // is converted into it's spelled out form eg. "." -> "dot"
  match: string | string[] | IDynamicMatch;
  // returns the complete liveTs that should be shown.
  // raw input would be eg. "go to are meal time video"
  delay?: number | number[];
}

interface IBaseSetting {
  name: string;
  type: any;
  default?: any;
}

interface IBooleanSetting extends IBaseSetting {
  type: "boolean";
  default?: boolean;
}

interface IStringSetting extends IBaseSetting {
  type: "url" | "text" | "string";
  default?: string;
}

interface INumberSetting extends IBaseSetting {
  type: "number";
  default?: number;
}

interface IChoiceSetting extends IBaseSetting {
  type: "choice";
  choices: string[];
  default?: string;
}

declare type ISetting =
  | IStringSetting
  | IBooleanSetting
  | INumberSetting
  | IChoiceSetting;
declare type SingleTest = (
  t: ExecutionContext<ICmdTestContext>,
  say: (s?: string, segmentId?: number) => Promise<void>,
  client: WebdriverIO.Browser
) => Promise<void> | void;

declare interface ICmd
  extends Partial<IPlan>,
    ILocalizedCmd,
    IGlobalCmd,
    IFnCmd {
  test?: SingleTest | { [testTitle: string]: SingleTest };
  // matchOutput is the array returned from the match function (if there's a match fn) or
  // the arguments from special match string (wildcard, numeral etc. type special params)
  pageFn?: (transcript: TsData, ...matchOutput: any[]) => void | Promise<void>;
  // set to false to not include this command in Normal mode. For commands that only belong
  // in certain context(s)
  normal?: false;
  settings?: ISetting[];
  minConfidence?: number;
  onlyFinal?: true;
  // whether to execute this command in the iframe that has focus
  // won't work if the focus is just document.body
  activeDocument?: true;
  // BETA
  // in case the automatic command sorting is insufficient this allows for
  // regular match commands to take priority over dynamic ones
  // higher numbers mean higher priority, eg. a priority of 20
  // gets chosen over a priority of 10.
  // dynamic command default priority is 10,000
  priority?: number;
}

declare interface IButtons {
  [name: string]: (moduleCtx: any) => Promise<void>;
}

declare type ContextMutator = (origContext: string[]) => string[];

declare type HUDChild = "top" | "obscure" | "dontobscure";

declare interface IPluginUtil {
  // meta
  shutdown: () => void; // shutdown LipSurf
  pause: () => void; // pause LipSurf - so it stops listening but doesn't close help or HUD
  start: () => void; // startup LipSurf programmatically (also resumes)
  getOptions(): IOptions;
  getOptions<T extends keyof IOptions>(...key: T[]): Pick<IOptions, T>;
  getLanguage: () => LanguageCode;
  // automatically reverts to the last selected dialect
  // if given language code is 2 characters
  setLanguage: (lang: LanguageCode) => void;

  getContext: () => string[];
  prependContext: (...context: string[]) => void;
  appendContext: (...context: string[]) => void;
  removeContext: (...context: string[]) => void;
  // explicitly enter the seq of contexts
  enterContext: (context: string[]) => void;

  getCmdHistory: () => [pluginId: string, cmdName: string, cmdArgs: CmdArgs][];

  // takes into account LipSurf dialogues that are in the shadow DOM (eg. custom homosyn adder)
  getActiveEl: () => HTMLElement;
  queryAllFrames: (
    query: string,
    attrs?: string | string[],
    props?: string | string[],
    specialProps?: SpecialProp[]
  ) => Promise<[string, ...any[]]>;
  postToAllFrames: (
    ids?: string | string[],
    fnNames?: string | string[],
    selector?,
    specialFns?: SpecialFn | SpecialFn[]
  ) => void;
  // TODO: deprecate in favor of generic postToAllFrames?
  // currently used for fullscreen?
  sendMsgToBeacon: (msg: object) => Promise<any>;
  scrollToAnimated: (el: HTMLElement, offset?: number) => void;
  getRGB: (
    colorHexOrRgbStr: string
  ) => [red: number, green: number, blue: number];
  isVisible: (el: HTMLElement, inFrame?: boolean) => boolean;
  isOnTop: (el: HTMLElement) => boolean;
  getNoCollisionUniqueAttr: () => string;
  sleep: (t: number) => Promise<void>;
  getHUDEl: (child?: HUDChild) => [HTMLDivElement, boolean];

  ready: () => Promise<void>;
  waitForElToExist: (elQ: string) => Promise<HTMLElement>;

  pick: (obj: object, ...props: string[]) => object;
  deepSetArray: (obj: object, keys: string[], value: any) => object;
  memoize: (...args: any[]) => any;

  fuzzyHighScore: (
    query: string,
    sources: string[],
    minScore?: number,
    partial?: boolean,
    skipCanonicalizing?: boolean
  ) => Promise<[idx: number, score: number]>;
  fuzzyHighScoreScrub: (
    query: string,
    sources: string[],
    minScore?: number
  ) => Promise<
    [idx: number, score: number, matchStartI: number, matchEndI: number]
  >;
  topFuzzyItemMatches: <T>(
    query: string,
    itemWTextColl: ItemWAssocText<T>[],
    minScore?: number
  ) => Promise<T[]>;

  unhighlightAll: () => void;
  highlight: (...els: HTMLElement[]) => void;
  clickOrFocus: (el: HTMLElement) => void;
  disambiguate(
    els: FrameElWOffsets[]
  ): Promise<[number, Promise<void>, FrameElWOffsets]>;
  disambiguate(
    els: HTMLElement[]
  ): Promise<[number, Promise<void>, HTMLElement]>;
  disambiguate(
    els: HTMLElement[] | FrameElWOffsets[]
  ): Promise<[number, Promise<void>, HTMLElement | FrameElWOffsets]>;

  runCmd: (
    pluginName: string,
    cmdName: string,
    cmdArgs: CmdArgs,
    options?: { allPlugins?: any; atFront?: boolean }
  ) => Promise<void>;
  runOtherCmd: (
    pluginName: string,
    cmdName: string,
    cmdArgs?: CmdArgs
  ) => Promise<void>;

  showNeedsUpgradeError: (data: {
    plan: plan;
    hold?: boolean;
    customMsg?: string;
    buttons?: IButtons;
  }) => Promise<void>;
}

declare interface IHelp {
  autoOpen: (
    pluginId: string,
    setting: string,
    context?: string[]
  ) => Promise<() => void>;
  show: (autoOpen?: boolean) => void;
  hide: (immediate?: boolean) => void;
  toggle: (show?: boolean) => boolean;
  turnOffLastAutoOpened: () => Promise<void>;
  // return true if on left
  togglePosition: () => boolean;
}

declare interface IAnnotations {
  destroy: () => void;
  annotate: (getEls: () => Promise<FrameElWOffsets[]>) => void;
  isUsed: (s: string) => boolean;
  select: (annotationName: string) => void;
  setAnnoSelectCb: (
    cb: (annoEl: FrameElWOffsets, annoName: string) => any
  ) => void;
}

declare namespace ExtensionUtil {
  function queryActiveTab(): Promise<chrome.tabs.Tab & TabWithIdAndURL>;
}

declare interface ILocalizedPlugin {
  niceName: string;
  commands: { [commandName: string]: ILocalizedCmd };
  authors?: string;
  description?: string;
  homophones?: ISimpleHomophones;
  // always run the following regexs in this context, unlike homophones these don't look for a valid
  // command with the homophone...  they simply always replace text in the transcript. Can be used to
  // filter words, add shortcuts etc.
  replacements?: IReplacement[];
}

declare interface IContext {
  [name: string]: {
    // * list of commands to allow in this context. Use format [plugin id].[command name]
    // eg. (LipSurf.Open Help) for commands from external plugins
    // * the first format is for grouping commands (name of the group, followed by commands in the group)
    commands: [group: string, commands: string[]][] | string[];
    // usually an emoji to show the left of the live transcript
    icon?: string;
  };
}

declare interface IPluginBase {
  languages: { [lang in LanguageCode]?: ILocalizedPlugin };
  constants: Readonly<{
    contexts: Readonly<{
      Normal: "Normal";
      Tag: "Tag";
    }>;
  }>;
  // should not be overridden by plugins
  getPluginOption: (pluginId: string, name: string) => any;
  setPluginOption: (pluginId: string, name: string, val: any) => Promise<void>;

  watch: <K extends keyof IOptions>(
    handler: StoreListener<Pick<IOptions, K>>,
    firstProp: K,
    ...props: K[]
  ) => Promise<number>;
  unwatch: (id: number | undefined) => void;

  util: IPluginUtil;
  annotations: IAnnotations;
  help: IHelp;
}

declare interface IPlugin extends Partial<IPlan> {
  niceName: string;
  description?: string;
  languages?: { [L in LanguageCode]?: ILocalizedPlugin };
  version: string;
  // defaults to 1 if not specified
  // 1 LipSurf versions < "4.0.0"
  // 2 LipSurf versions >= "4.0.0"
  apiVersion?: number;
  match: RegExp | RegExp[];
  authors?: string;
  // svg string of an uncolored icon with no height or width
  icon?: string;

  commands: ICmd[];
  // less common -> common
  // global homophones that all plugins share
  // mis-hearings kept in homophones so they can be easily tracked for removal
  // as voice recognition improves
  homophones?: ISimpleHomophones;
  replacements?: IReplacement[];
  contexts?: IContext;
  settings?: ISetting[];
  // called anytime the page is re-shown. Must be safe to re-run
  // while lipsurf is activated. Or when lipsurf is first activated.
  init?: (() => void) | (() => Promise<void>);
  // called when plugin is deactivated (speech recg. paused)
  // in page context
  destroy?: (() => void) | (() => Promise<void>);
  // called when LipSurf is turned off (after destroy)
  deactivatedHook?: () => void | (() => Promise<void>);
}
