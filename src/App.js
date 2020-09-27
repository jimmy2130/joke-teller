import React, { useState } from 'react';
import './App.css';

function App() {
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const getJokes = async () => {
    let joke = '';
    const apiUrl = 'https://sv443.net/jokeapi/v2/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist';
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if(data.setup) {
        joke = `${data.setup} ... ${data.delivery}`;
      } else {
        joke = data.joke;
      }
      // Text-to-Speech
      tellJoke(joke);
      // Disable Button
      setButtonDisabled(true);
    } catch(error) {
      // Catch Errors Here
      console.log('whoops', error);
    }
  }

  const tellJoke = (joke) => {
    // const endpoint = 'http://localhost:8000';
    const cors = 'https://young-journey-86731.herokuapp.com/';
    const endpoint = 'https://fierce-wave-07352.herokuapp.com/';
    fetch(cors + endpoint, {
      method: 'post',
      body: JSON.stringify({
        joke: joke
      }),
      headers: {'Content-Type': 'application/json'},
    })
      // https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
      .then(res => res.blob())
      .then(blob => {
        let url = window.URL.createObjectURL(blob);
        window.audio = new Audio();
        window.audio.src = url;
        window.audio.play();
        // https://stackoverflow.com/questions/57486312/detect-when-audio-play-has-finished
        window.audio.onended = function() {
          setButtonDisabled(false);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  return (
    <div className="container">
      <button onClick={getJokes} disabled={buttonDisabled}>Tell Me A Joke</button>
    </div>
  );
}

export default App;
