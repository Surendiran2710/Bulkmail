import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";




function App() {

  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);


  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event) {

    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader()

    reader.onload = function (e) {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail = emailList.map(function (item) { return item.A })
      console.log(totalemail)
      setEmailList(totalemail)
    }

    reader.readAsArrayBuffer(file)

  }


  function send() {
    setstatus(true)
    axios.post("http://localhost:5000/sendemail", { msg: msg, emailList:emailList})
    .then(function (data) {
      if (data.data === true) {
        alert("Email sent Successfully")
        setstatus(false)
      } else {
        alert("Failed")
      }
    })
  }


  return (
    <div>
      <div className="bg-blue-950 text-white text text-center">
        <h1 className="text-3xl font-medium px-5 py-3">BulkMail</h1>
      </div>

      <div className="bg-blue-800 text-white text text-center">
        <h1 className="font-medium px-5 py-3">We can help your business with sending multiple emails at once</h1>
      </div>

      <div className="bg-blue-600 text-white text text-center">
        <h1 className="font-medium px-5 py-3">Drag & Drop</h1>
      </div>

      <div className="bg-blue-400 text-center text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter the email text ...."></textarea>
      </div>

      <div className="text-center">
        <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5"></input>
      </div>

      <p className="text-center">Total Emails in the file: {emailList.length}</p>


      <div className="text-center">
        <button onClick={send} className="bg-blue-950 py-2 px- mt-2 text-center text-white font-medium rounded-md w-fit p-8 mb-2 hover:bg-gray-500">{status ? "Sending..." : "Send"}</button>
      </div>

      <div className="bg-blue-300 p-8">

      </div>

      <div className="bg-blue-200 p-8">

      </div>

    </div>
  )
}


export default App;