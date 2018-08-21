export function fDatetime(date: Date): string {

  let resp: string = "";
  resp += `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
  resp += " ";
  resp += `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
  resp += `${date.getTimezoneOffset() <= 0?'+':'-'}${('0' + Math.round(Math.abs(date.getTimezoneOffset())/60)).slice(-2)}${('0' + Math.round(Math.abs(date.getTimezoneOffset())%60)).slice(-2)}`;
  return resp;
}