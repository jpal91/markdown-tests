

export const searchText = (str) => {
  let regex = /(?<=#\s)[A-Z a-z]*/;
  let regex2 = /(```js)[\n\s]+[A-Z a-z]*[\n\s]+(```)/gm;
  // if (!regex.test(str)) {
  //     return <p>{str}</p>
  // }

  let newString = str.match(regex);

  let temp = str.replace(newString[0], `<h3>${newString[0]}</h3>`);
  temp = temp.replace(/[\n]+/g, "</br>");
  //console.log(temp.split(/[\n]+/))

  return temp;
};