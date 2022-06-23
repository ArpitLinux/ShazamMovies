import React, { useState } from 'react';
import axios from "axios"


function RecordingButton(DisableButtons, setDisableButtons, setAudioURL, filetoBase64) {

  function startRecording() {
    setDisableButtons(true)
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      let mediaRecorder = new MediaRecorder(stream);
      setDisableButtons(true)
      mediaRecorder.start();
  
      let audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });
  
      mediaRecorder.addEventListener("stop", () => {
        let audioBlob = new Blob(audioChunks);
        let audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(new Audio(audioUrl))

        var newFileReader = new FileReader();
        newFileReader.readAsArrayBuffer(audioBlob)
        filetoBase64(newFileReader)
      });
  
      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000);
    });
  }


  if (DisableButtons) {
    return (
      <div>
        <button disabled id="audio-button">Record</button>
      </div>
    )
  } else {
    return (
      <div>
        <button onClick={startRecording} id="audio-button">Record</button>
      </div>
    )
  }
}

function RecordingStatus(Recording) {

    if (Recording) {
      return (
        <h5 id="audio-status">Current status: Recording</h5>
      )
    } else {
      return (
        <h5 id="audio-status">Current status: not recording</h5>
      )
    }
}

function UploadFile(DisableButtons, setDisableButtons, setFile, filetoBase64) {
  setDisableButtons(true)

  function selectFile(event) {
    let chosenFile = event.target.files[0]
    setFile(chosenFile)

    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(chosenFile);
    filetoBase64(fileReader)
  }

  if (DisableButtons) {
    return (
      <input disabled type="file" name="file" id="file" />
    )
  } else {
    <input onChange={selectFile}  type="file" name="file" id="file" />
  }
}


function App() {

  const [DisableButtons, setDisableButtons] = useState(false)
  const [AudioURL, setAudioURL] = useState(false)
  const [File, setFile] = useState("")

  const [SongName, setSongName] = useState("")
  const [Data, setData] = useState([])
  const [Err, setErr] = useState("")

  function filetoBase64(specifiedVar) {
    var sr = 44100; // sample rate
    var sl = 4; // 4 seconds
    specifiedVar.onload = async (event) => {
      var audioContext = new AudioContext({ sampleRate: sr });
      audioContext.decodeAudioData(
        event.target.result,
        async (buffer) => {
          var sbf32 = new ArrayBuffer(buffer.length * 4);
          var sbi16 = new ArrayBuffer(sr * 2 * sl);
          var sbfloat32 = new Float32Array(sbf32);
          var sbint16 = new Int16Array(sbi16);
          var sbuint8 = new Uint8Array(sbi16);
          var base64 = "";
          buffer.copyFromChannel(sbfloat32, 0);

          for (var i = 0; i < sr * sl; i++) {
            var value = Math.floor(sbfloat32[i] * 32767);
            sbint16[i] = value;
          }
          base64 = btoa(
            sbuint8.reduce((data, byte) => data + String.fromCharCode(byte))
          );

          const datatoSend = {"base64": base64}
      await axios.post("http://localhost:3000/base64file", datatoSend).then(function(response) {
        console.log(response.data.Data.items)
        if (response.data.Err) {
          setErr(`Error: ${response.data.Err}`)

          if (response.data.Data.items) {
            setData(response.data.Data.items)
          }

          if (response.data.Song) {
            setSongName(response.data.Song)
          }

          setDisableButtons(false)
          
          
        } else {
          setData(response.data.Data.items)
          setSongName(response.data.Song)
          setDisableButtons(false)
        }

      })
        }
      );



    };
  }

  return (
    <div>
      <section>
      <header>
        <h1 id="audio-result">Please upload audio file</h1>
        <label for="file">Please select an audio file to search with</label>
        <br />
        <UploadFile DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setFile={setFile} filetoBase64={filetoBase64} />
        <br />

        <RecordingButton DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setAudioURL={setAudioURL} filetoBase64={filetoBase64}  />
        <RecordingStatus />

        <br />
        <br />
        <button id="play-audio">Click here to play audio if recorded</button>
      </header>
    </section>
    <section id="r"></section>
    </div>
  );
}

export default App;
