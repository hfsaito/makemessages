export function findAll(source: string, re: RegExp): RegExpExecArray[] {

  let matches: RegExpExecArray[] = [];
  source.replace(re, (...args) => {

    let m: RegExpExecArray = <RegExpExecArray> args.slice(0, -2);
    m.index = args.reverse()[1];
    m.input = args.reverse()[0];
    m.push()
    matches.push(m);
    return args[0];
  });
  return matches;
}