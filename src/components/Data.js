import React, { useEffect, useState } from "react";
import fs from "fs";
import path from "path";
import ReactHtmlParser from "react-html-parser";

import { searchText } from "../helpers/search-text";

const Data = () => {
  const [data, setData] = useState();
  const handleChange = (event) => setData(event.target.value);

  useEffect(() => {
    const filePath = path.join(process.cwd(), "README.md");
    fs.readFile(filePath, "utf8", (err, data) => {
      setData(data);
    });
  }, []);

  //const returnedData = data && data.split(/[\n]+/).map((d) => searchText(d))
  const returnedData = data && searchText(data);

  return (
    <React.Fragment>
      <textarea
        rows="20"
        cols="100"
        value={data}
        onChange={(event) => handleChange(event)}
      />
      <div>{ReactHtmlParser(returnedData)}</div>
    </React.Fragment>
  );
};

export default Data;