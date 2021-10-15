import './App.css';
import {useState,useEffect,useRef} from 'react'
import useTimeout from './hooks/useTimeout'
const timeout = 5000
const debounceMaxTime = 200

function IdleVerifier(){
  const debounceTimeoutId = useRef(null) 

  const {reset} = useTimeout(()=>{
    // console.log('inativo')
    alert('inativo')
  },timeout)
 
  useEffect(()=>{
    function debounce(){ 
      // console.log('debounce')
      if(!debounceTimeoutId.current){
        debounceTimeoutId.current = setTimeout(()=>{
          reset()
          debounceTimeoutId.current = null
        },debounceMaxTime)
      }else{ 
        clearTimeout(debounceTimeoutId.current);
        debounceTimeoutId.current = setTimeout(()=>{
          reset()
          debounceTimeoutId.current = null
        },debounceMaxTime)
      }
    }

    document.addEventListener('keydown',reset,false)
    document.addEventListener('mousemove',debounce,false)
    document.addEventListener('touchstart',reset,false);
    document.addEventListener('scroll',debounce,false)
    document.addEventListener('touchmove',debounce,false);

    return ()=>{
      document.removeEventListener('keydown',reset)
      document.removeEventListener('mousemove',debounce)
      document.removeEventListener('touchstart',reset)
      document.removeEventListener('scroll',debounce)
      document.removeEventListener('touchmove',debounce)
    }
  },[reset])
  return null
}

function App() {
  const [isVerifying,setIsVerifying] = useState(true)
  useEffect(()=>{
    function handleVisibilityChange() {
      if(document.visibilityState==='visible'){
        setIsVerifying(true);
      }else{ 
        setIsVerifying(false);
      }
    }
    document.addEventListener('visibilitychange',handleVisibilityChange,false)
    return ()=>{
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  },[setIsVerifying])
  return (
    <div className="App">
      <header className="App-header">
        {isVerifying && <IdleVerifier />}
      </header>
    </div>
  );
}

export default App;
