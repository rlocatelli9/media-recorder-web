import React from 'react';
import RecorderButton from '../Button/RecorderButton';

import { Container } from './styles';


function InteractionBox({listRef}) {
  return (
    <Container>
      <section style={{padding: '0.5rem', color: 'white'}}>actions</section>
      <section style={{display: 'flex', alignItems: 'center'}}>
        <textarea style={{height: '4rem',width: '100%', resize: 'none'}}></textarea>       
        <RecorderButton listRef={listRef}/>
      </section>
    </Container>
  )
}

export default InteractionBox;