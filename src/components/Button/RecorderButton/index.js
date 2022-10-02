import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Container } from './styles';

const styleButton = {
  margin: '1rem', 
  width: 'auto', 
  border: 'none', 
  background: 'none', 
  color: '#FFF', 
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const SECONDS_AMOUNT = 5

function RecorderButton({listRef}) {
  const mediaRecorder = useRef(null)
  const isRecording = useRef(null)
  const buttonRef = useRef(null)
  let timer = useRef(0)
  const [stateTimer, setStateTimer] = useState(SECONDS_AMOUNT)
  const [timerFormated, setTimerFormated] = useState('')
  
  const secondsToTime = (secs) => {
    let obj = {}
    if(secs < 0) {
      obj = {
        "h": String(0).padStart(2, '0'),
        "m": String(0).padStart(2, '0'),
        "s": String(0).padStart(2, '0')
      };
    } else {
      let hours = Math.floor(secs / (60 * 60));

      let divisor_for_minutes = secs % (60 * 60);
      let minutes = Math.floor(divisor_for_minutes / 60);

      let divisor_for_seconds = divisor_for_minutes % 60;
      let seconds = Math.ceil(divisor_for_seconds);

      obj = {
        "h": String(hours).padStart(2, '0'),
        "m": String(minutes).padStart(2, '0'),
        "s": String(seconds).padStart(2, '0')
      };
    }
    return obj;
  }
  
  const stopRecorder = useCallback(() => {
    if(mediaRecorder.current) {
      mediaRecorder.current.stop()
      isRecording.current = false
      if(buttonRef.current) buttonRef.current.textContent = 'gravar'
    }
  }, [])

  useEffect(() => {
    if(stateTimer < 0){
      stopRecorder()
    } else {
      const timerObject = secondsToTime(stateTimer)    
      console.log(`${timerObject.h}:${timerObject.m}:${timerObject.s}`)
      setTimerFormated(`${timerObject.h}:${timerObject.m}:${timerObject.s}`)
    }
  }, [stateTimer, stopRecorder])

  const countDown = useCallback(() => {
    // Remove one second, set state so a re-render happens.
    setStateTimer((oldState) => {
      const newSeconds = oldState - 1
      return newSeconds
    });
  },[setStateTimer])

  const startTimer = useCallback(() => {
    if (isRecording.current && stateTimer > 0) {
      console.log('gravando...')
      timer.current = setInterval(countDown, 1000);
    }
  },[countDown, stateTimer])

  const stopTimer = useCallback(() => {
    if(!isRecording.current || stateTimer < 0) {
      console.log('parando...')
      clearInterval(timer.current);
      setStateTimer(SECONDS_AMOUNT)
    }
  },[stateTimer])

  

  const startRecorder = useCallback(() => {
    if(mediaRecorder.current){    
      mediaRecorder.current.start()
      isRecording.current = true
      if(buttonRef.current) buttonRef.current.textContent = 'gravando'
    }
  }, [])
  

  const handleClick = () => {
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
      if(isRecording.current){
        stopRecorder()
      } else {    
        mediaRecorder.current = new MediaRecorder(stream)
        let chunks = []
        
        mediaRecorder.current.ondataavailable = data => {
          chunks.push(data.data)
        }
  
        mediaRecorder.current.onstart = () => {
          console.log('start')
          startTimer()         
        }
  
        mediaRecorder.current.onstop = () => {
          console.log('stop')
          stopTimer()
          const blob = new Blob(chunks, {type: 'audio/ogg; code=opus'})
          const readFile = new window.FileReader(blob)
          readFile.readAsDataURL(blob)
          readFile.onloadend = () => {
            const audioElement = document.createElement('audio')
            audioElement.src = readFile.result
            audioElement.controls = true
            const listElement = document.createElement('li')
            listElement.appendChild(audioElement)
            listRef.current.appendChild(listElement)
          }
          chunks = []
        }   
        startRecorder()
      }
      
    })
    .catch(error => {
      alert('microfone precisa ser habilitado')
    })
  }
  return (
    <Container>
      <button 
        ref={buttonRef}
        id="recorderBtn"
        type="button" 
        style={styleButton}
        onClick={handleClick}
      >
        gravar
      </button>
      {timerFormated}
    </Container>
  )
}

export default RecorderButton;