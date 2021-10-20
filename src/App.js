import './App.css';
import {InactivityContextProvider,InactivityContext} from './context/InactivityContext'
import {useContext} from 'react'

// import {useInactivityCheck} from './hooks/useInativityCheck'
const timeout = 5000
const debounceMaxTime = 200

function Mock(){
const {storageTimeout} = useContext(InactivityContext)

  return <header className="App-header">
  <p> {Object.assign(storageTimeout).expirationTime }</p>
  </header>
}

function App() {
//  const [storageTimeout]=useInactivityCheck(()=>{console.log('executado')},{timeout:timeout,debounceMaxTime:debounceMaxTime})
  return (
    <div className="App">
      <InactivityContextProvider configs={{timeout,debounceMaxTime}} >
      <Mock/>
      </InactivityContextProvider>
    </div>
  );
}

export default App;


/* <p> {Object.assign(storageTimeout).expirationTime }</p> */
