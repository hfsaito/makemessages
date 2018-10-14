import { findAll } from "./index";

export class RegexNamedGroups extends RegExp {

  private namedGroups: string[];
  public getGroupIndex: Function;
  constructor(source: string, flags: string = "") {

    if (/(^|[^\\])\((?!\?<\w+?>|\?:)/g.test(source))
      throw new Error("Not named capturing group");

    if (/(^|[^\\])\(([^\(\)]*?\(|([^\(\)]*?\([^\(\)]*?\)[^\(\)]*?)*?\()(?!\?:).*?\)/g.test(source))
      throw new Error("Nested capturing group");

    super(source.replace(/\(\?<(\w+?)>(.*?)\)/g, "($2)"), flags);

    let namedGroupExtracter = /\(\?<(\w+?)>([^\(\)]*?|(?:[^\(\)]*?\([^\(\)]*?\)[^\(\)]*?))\)/g;
    let found: RegExpExecArray;
    this.namedGroups = [];
    do {

      found = namedGroupExtracter.exec(source);
      if (found)
        this.namedGroups.push(found[1]);
    } while (found);
    this.getGroupIndex = function (label: string): number {

      if (this.namedGroups.indexOf(label) < 0)
        return undefined;
      return this.namedGroups.indexOf(label) + 1;
    }
  }
}