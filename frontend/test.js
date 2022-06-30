// function Test() {
//     return (
//         <section>
//       <header>
//         <h1 id="logo">WAZAM
//         </h1>
//         <center><h1 id="song-name">{Err}</h1></center>
//         <SongTitle SongName={SongName} />
//         <div id="container">
//         <RecordingButton setErr={setErr} setSongName={setSongName} setRecording={setRecording} DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setAudioURL={setAudioURL} filetoBase64={filetoBase64}  />
//         <RecordingStatus Recording={Recording} />
//           <div id="container2">
//           <PlayAudioButton AudioURL={AudioURL} DisableButtons={DisableButtons}  />
//             <label for="file">
//               <div id="audio-result">
//                 <i class="fa-solid fa-arrow-up-from-bracket">
//                 </i> Upload
//               </div>
//               <UploadFile setErr={setErr} setSongName={setSongName} setAudioURL={setAudioURL} DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setFile={setFile} filetoBase64={filetoBase64} />
//             </label>
//           </div>
//         </div>
//         <center>
//         <ResponseData Data={Data} />
//         </center>
//       </header>
//     </section>
//     )
// }

// function Ree() {
//     return (
//         <div>
//           <section>
//           <header>
//           <h1>{Err}</h1>
//             <SongTitle SongName={SongName} />
//             <label htmlFor="file">Please select an audio file to search with</label>
//             <br />
//             <UploadFile setErr={setErr} setSongName={setSongName} setAudioURL={setAudioURL} DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setFile={setFile} filetoBase64={filetoBase64} />
//             <br />
    
//             <RecordingButton setErr={setErr} setSongName={setSongName} setRecording={setRecording} DisableButtons={DisableButtons} setDisableButtons={setDisableButtons} setAudioURL={setAudioURL} filetoBase64={filetoBase64}  />
//             <RecordingStatus Recording={Recording} />
    
//             <br />
//             <br />
//             <PlayAudioButton AudioURL={AudioURL} DisableButtons={DisableButtons}  />
//           </header>
//         </section>
//         <section id="r"><ResponseData Data={Data} /></section>
//         </div>
//       );
// }