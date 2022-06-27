import React, { useState } from 'react';
import axios from "axios"


function RecordingButton({DisableButtons, setDisableButtons, setAudioURL, filetoBase64, setRecording}) {

  function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      let mediaRecorder = new MediaRecorder(stream);
      setDisableButtons(true)
      setRecording(true)
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
        setDisableButtons(false)
        setRecording(false)
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

function RecordingStatus({Recording}) {

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

function UploadFile({DisableButtons, setDisableButtons, setFile, filetoBase64, setAudioURL}) {

  function selectFile(event) {
    setDisableButtons(true)
    let chosenFile = event.target.files[0]
    setFile(chosenFile)

    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(chosenFile);
    setAudioURL(new Audio(URL.createObjectURL(event.target.files[0])))
    filetoBase64(fileReader)
  }

  if (DisableButtons) {
    return (
      <input disabled type="file" name="file" id="file" />
    )
  } else {
    return (
      <input onChange={selectFile}  type="file" name="file" id="file" />
    )
  }
}

function PlayAudioButton({DisableButtons, AudioURL}) {

  function handleClick() {
    AudioURL.play()
  }

  if (DisableButtons) {
    return (
      <button disabled id="play-audio">Click here to play audio if recorded</button>
    )
  } else {
    return (
      <button onClick={handleClick} id="play-audio">Click here to play audio if recorded</button>
    )
  }
}


function SongTitle({SongName}) {
  if (SongName) {
    return (
      <h1 id="audio-result">{"Found song: " + SongName}</h1>
    )
  } else {
    return (
      <h1 id="audio-result">Please upload audio file</h1>
    )
  }
}

function ResponseData({Data}) {
  if (Data) {
    return (
      <div>
        {Data.map((item) => {
          return (
            <a href={item.link}>
            <b>{item.pagemap.metatags[0].title}</b>
            <img src={item.pagemap.cse_image[0].src} width="100px" />
            <p>{item.htmlSnippet}</p>
            <br/>
          </a>
          )
        })}
      </div>
    )
  }
}


function App() {

  const [DisableButtons, setDisableButtons] = useState(false)
  const [AudioURL, setAudioURL] = useState(false)
  const [File, setFile] = useState("")
  const [Recording, setRecording] = useState(false)

  const [SongName, setSongName] = useState(false)
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
      await axios.post("http://localhost:8000/base64file", datatoSend).then(function(response) {
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
      <h1>{Err}</h1>
        <SongTitle SongName={SongName} />
        <label htmlFor="file">Please select an audio file to search with</label>
        <br />
        <UploadFile setAudioURL={setAudioURL} DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setFile={setFile} filetoBase64={filetoBase64} />
        <br />

        <RecordingButton setRecording={setRecording} DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setAudioURL={setAudioURL} filetoBase64={filetoBase64}  />
        <RecordingStatus Recording={Recording} />

        <br />
        <br />
        <PlayAudioButton AudioURL={AudioURL} DisableButtons={DisableButtons}  />
      </header>
    </section>
    <section id="r"><ResponseData Data={Data} /></section>
    </div>
  );
}

export default App;
