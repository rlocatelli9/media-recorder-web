import React, { useRef } from 'react';
import InteractionBox from '../../components/InteractionBox';

import { Container } from './styles';

function Main() {

  const list = useRef(null)

  console.log({list})

  return <Container>
    <main>
      <h2>main</h2>
      <ul id="audio-list" ref={list}></ul>
    </main>
    <footer>
      <InteractionBox listRef={list}/>
    </footer>
  </Container>;
}

export default Main;