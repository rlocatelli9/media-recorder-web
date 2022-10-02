import React, { useCallback, useEffect, useRef } from 'react';
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


function RecorderButton({listRef}) {
  const mediaRecorder = useRef(null)
  const stopTimer = useRef(null)
  const isRecording = useRef(null)

  const stopRecorder = useCallback(() => {
      mediaRecorder.current.stop()
      isRecording.current = false
  }, [])

  

  const handleClick = () => {
    navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => {
      if(isRecording.current){
        stopRecorder()
      } else {
        console.log(stream)
        mediaRecorder.current = new MediaRecorder(stream)
        let chunks = []
        
        mediaRecorder.current.ondataavailable = data => {
          console.log(data)
          chunks.push(data.data)
        }

        mediaRecorder.current.onstart = () => {
          console.log('start')
          isRecording.current = true

        }

        mediaRecorder.current.onstop = () => {
          console.log('stop')
          const blob = new Blob(chunks, {type: 'audio/ogg; codecs=opus'})
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

        mediaRecorder.current.start()
      }
      
    })
    .catch(error => {
      alert('microfone precisa ser habilitado')
    })
  }
  return (
    <Container>
      <button 
        type="button" 
        style={styleButton}
        onClick={handleClick}
      >
        gravar
      </button>
    </Container>
  )
}

export default RecorderButton;