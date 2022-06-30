import React, { useState } from 'react';
import axios from "axios"


function RecordingButton({DisableButtons, setDisableButtons, setAudioURL, filetoBase64, setRecording, setSongName, setErr}) {

  function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      let mediaRecorder = new MediaRecorder(stream);
      setDisableButtons(true)
      setRecording(true)
      setSongName("")
      setErr("")
      mediaRecorder.start();

      let audioButton = document.getElementById("audio-button")
      let faMic = document.getElementById("fa-microphone")
      audioButton.style.animationPlayState = "running"
      faMic.style.animationPlayState = "running"
  
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

        audioButton.style.animationDirection="reverse"
        faMic.style.animationDirection="reverse"
      });
  
      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000);
    });
  }


  if (DisableButtons) {
    return (
        <button disabled id="audio-button"> 
            <i id="fa-microphone" className="fa-solid fa-microphone">
            </i> Record
        </button>
    )
  } else {
    return (
        <button id="audio-button" onClick={startRecording}> 
            <i id="fa-microphone" className="fa-solid fa-microphone">
            </i> Record
        </button>
    )
  }
}

function RecordingStatus({Recording}) {

    if (Recording) {
      return (
        <h5 id="audio-status">Status: Recording</h5>
      )
    } else {
      return (
        <h5 id="audio-status">Status: Not recording</h5>
      )
    }
}

function UploadFile({DisableButtons, setDisableButtons, setFile, filetoBase64, setAudioURL, setSongName, setErr}) {

  function selectFile(event) {
    setDisableButtons(true)
    let chosenFile = event.target.files[0]
    setFile(chosenFile)
    setSongName("")
    setErr("")

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
      <button disabled id="play-audio">
              <i className="fa-solid fa-play">
              </i> Play Audio
      </button>
    )
  } else {
    return (
      <button onClick={handleClick} id="play-audio">
              <i className="fa-solid fa-play">
              </i> Play Audio
      </button>
    )
  }
}


function SongTitle({SongName}) {
  if (SongName) {
    return (
      <center><h1 id="song-name">{"Found song: " + SongName}</h1></center>
    )
  } else {
    return (
      <center></center>
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
            <br/>
            </a>
          )
        })}
      </div>
    )
  }
}


function MainHandler() {

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
    <section>
  <header>
    <center><h1 id="logo">WAZAM
    </h1></center>
    <center><h1 id="song-name">{Err}</h1></center>
    <SongTitle SongName={SongName} />
    <div id="container">
    <RecordingButton setErr={setErr} setSongName={setSongName} setRecording={setRecording} DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setAudioURL={setAudioURL} filetoBase64={filetoBase64}  />
    <RecordingStatus Recording={Recording} />
      <div id="container2">
      <PlayAudioButton AudioURL={AudioURL} DisableButtons={DisableButtons}  />
        <label htmlFor="file">
          <div id="audio-result">
            <i className="fa-solid fa-arrow-up-from-bracket">
            </i> Upload
          </div>
          <UploadFile setErr={setErr} setSongName={setSongName} setAudioURL={setAudioURL} DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setFile={setFile} filetoBase64={filetoBase64} />
        </label>
      </div>
    </div>
    <center>
    <ResponseData Data={Data} />
    </center>
  </header>
</section>
)
}

function App() {
  const [Started, setStarted] = useState(false)

  if (Started) {
    return (
      <MainHandler />
    )
  } else {
    function handleClick() {
      setStarted(true)
      document.getElementById('body-start').setAttribute('id', 'body');
    }

    return (
      <section>
        <h1 id="logo">WAZAM</h1>
        <center>
          <p>
            Find shows and <br /> movies with your <br /> favourite songs
          </p>
          <button onClick={handleClick}>Get Started</button>
        </center>
      </section>
    )
  }
}


export default App;
