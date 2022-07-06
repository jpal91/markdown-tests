import React, { useEffect, useState } from "react";
// import fs from "fs";
// import path from "path";
import ReactHtmlParser from "react-html-parser";

import { searchText } from "../helpers/search-text";

const transform = (node, index) => {
    // if (node.parent && node.parent.name === 'code' && node.type === 'tag') {
    //     if (node.name === 'br') {
    //         return `\n`
    //     }
        
    //     let textMap = node.children.map((d) => {
    //         return `${d.data}`
    //     }).join('')
    //     return (
    //         `<${node.name}>${textMap}</${node.name}>`
    //     )
    // }
    // if (!node.parent && node.type === 'tag' && !node.attribs.id) { node.attribs.id = index }
    // if (!node.parent && node.type === 'text') {
        
    //     return (
    //         <span id={index}>{node.data}</span>
    //     )
    // }
    if (node.type ==='text' && (!node.parent || node.parent.name === 'br')) {
        return (
            <span>{`${node.data}`}</span>
        )
    }
}

const Data = () => {
  const [data, setData] = useState();
  const handleChange = (e) => {
    // e.preventDefault()
    // setData(e.currentTarget.textContent)
    setData(e.target.value);
}

  useEffect(() => {
    // const filePath = path.join(process.cwd(), "README.md");
    // fs.readFile(filePath, "utf8", (err, data) => {
    //   setData(data);
    // });
    const gettingData = async () => {
        await fetch('./test2.md')
        .then(res => res.text())
        .then(res => res.replace(/(\\n)/g, '\n'))
        .then(res => setData(res))
        //.then(res => console.log(res))
    }
    gettingData()

    const textId = document.querySelector('textarea')

    textId.addEventListener('keydown', (e) => {
        if (e.code === 'Tab') {
            e.preventDefault()
            textId.setRangeText(
                '\t',
                textId.selectionStart,
                textId.selectionStart,
                'end'
            )
            handleChange(e)
        }
    })
  }, []);

  useEffect(() => {

  }, [data])

  //const returnedData = data && data.split(/[\n]+/).map((d) => searchText(d))
  const returnedData = data && searchText(data);

  return (
    <React.Fragment>
      <textarea
        rows="20"
        cols="100"
        value={data}
        onChange={(event) => handleChange(event)}
        id='my-textbox'
      />
      {/* <pre contentEditable='true' id="my-textbox" width="1000" wrap="true" onInput={(e) => {handleChange(e)}}>{data}</pre> */}
      <div>{ ReactHtmlParser(returnedData, { transform: transform } ) }</div>
    </React.Fragment>
  );
};

export default Data;