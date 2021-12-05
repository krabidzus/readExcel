import './App.css';
import * as XLSX from "xlsx";
import { useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState([]);

  const readExcelFile = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const workBook = XLSX.read(bufferArray, { type: "buffer" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const data = XLSX.utils.sheet_to_json(workSheet);
        resolve(data);
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    });
    promise.then((data)=> {
      for (const [key] of Object.entries(data[0])) {
        setHeaderData((keysItems) => [...keysItems, key])
      }
      setData(data);
    })
  }

  function addDataValuesToTable(item, i) {
    return (
      <tr key={i}>
        {Object.values(item).map((val, index) => <td key={index}>{val}</td>)}
      </tr>
    )
  }

  return (
    <div >
      <input type="file" onChange={(e) => {
        const file = e.target.files[0];
        setHeaderData([]);
        setData([]);
        readExcelFile(file);
      }} />
      <table className="table">
        <thead>
        <tr>
          {headerData.map((key, index) => <th scope="col" key={index}>{key}</th>)}
        </tr>
        </thead>
        <tbody>
        {data.map((item, i) => addDataValuesToTable(item, i))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
