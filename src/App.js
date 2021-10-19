import './App.css';

import {useInactivityCheck} from './hooks/useInativityCheck'
const timeout = 5000
const debounceMaxTime = 200

function App() {
 const [storageTimeout]=useInactivityCheck(()=>{console.log('executado')},{timeout:timeout,debounceMaxTime:debounceMaxTime})

  return (
    <div className="App">
      <header className="App-header">
       <p> {Object.assign(storageTimeout).expirationTime }</p>
      </header>
    </div>
  );
}

export default App;
