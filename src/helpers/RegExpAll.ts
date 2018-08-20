export function findAll(source: string, re: RegExp): RegExpExecArray[] {

  let matches: RegExpExecArray[] = [];
  let found: RegExpExecArray;
  re.lastIndex = 0;
  do {

    found = re.exec(source);
    if (found)
      matches.push(found);
  } while(found);
  return matches;
}