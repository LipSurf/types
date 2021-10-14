/// <reference path="../index.d.ts"/>
// What's called IState in the chrome-extension is simplified and known as IOptions in the
// public plugins repo
declare interface IOptions {
  pluginData: Record<string, ILocalPluginData>;
  user: {
    id: string;
    plan: plan;
  };
  pluginPreferences: Record<string, ISyncPluginData>;
  language: LanguageCode;
  showLiveTs: boolean;
  noHeadphonesMode: boolean;
  tutorialSlide: string | null;
  inactivityAutoOffMins: number;
  pushToTalkKey: string;
  activatedViaPushToTalk: boolean;
  context: string[];
}

// Based on order given in the Plugin
interface IOrderable {
  order: number;
}

interface ICmdData extends IPlan, IGlobalCmd, IOrderable {
  order: number;
  fn?: string;
  normal?: false;
}

interface IMatcher {
  // the original name to match this command against
  name: string;
  description?: string;
  delay?: number[];
  match: string[] | Serialized<IDynamicMatch>;
}

interface IInternalReplacement {
  pattern: RegExp;
  replacement: string;
  context: string;
  // if false, then it's a custom shortcut
  correction: boolean;
}

interface ILocalPluginData extends IPlan, IOrderable {
  contexts?: IContext;
  commands: {
    [cmdName: string]: ICmdData;
  };
  localized: {
    [Lang in LanguageCode]?: {
      matchers: { [cmdName: string]: IMatcher };
      niceName: string;
      replacements: IInternalReplacement[];
      homophones?: ISimpleHomophones;
      description?: string;
    };
  };
  match: RegExp[];
  // the version is stored in both local and sync storage because
  // sync storage can be updated on a different machine, and all
  // machines would need to update their local plugin versions
  version: string;
  apiVersion: number;
}

interface ISyncPluginData extends IDisableable {
  version: string;
  expanded: boolean;
  showMore: boolean;
  // the names of the commands
  disabledCommands: string[];
  // the source of the homophones
  disabledHomophones: string[];
  // encoded replacement ID (uses source and context)
  disabledReplacements: string[];
  // private plugin settings for now eg. annotate on setting
  settings: { [key: string]: any } | undefined;
}
