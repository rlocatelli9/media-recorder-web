import './App.css';
import Header from './containers/Header';
import Main from './containers/Main';
import Left from './containers/Sidebar/Left';
import Right from './containers/Sidebar/Right';

function App() {
  return (
    <div className="App">    
      <Header/>
      <Left/>
      <Main/>
      <Right/>
    </div>
  );
}

export default App;
