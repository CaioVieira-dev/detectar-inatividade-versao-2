import './App.css';
import {//useState,
  useEffect,
  useRef} from 'react'
import useTimeout from './hooks/useTimeout'
import {useLocalStorage} from './hooks/useStorage'
const timeout = 5000
const debounceMaxTime = 200

// function IdleVerifier(){
//   const debounceTimeoutId = useRef(null) 

//   const {reset} = useTimeout(()=>{
//     // console.log('inativo')
//     alert('inativo')
//   },timeout)
 
//   useEffect(()=>{
//     function debounce(){ 
//       // console.log('debounce')
//       if(!debounceTimeoutId.current){
//         debounceTimeoutId.current = setTimeout(()=>{
//           reset()
//           debounceTimeoutId.current = null
//         },debounceMaxTime)
//       }else{ 
//         clearTimeout(debounceTimeoutId.current);
//         debounceTimeoutId.current = setTimeout(()=>{
//           reset()
//           debounceTimeoutId.current = null
//         },debounceMaxTime)
//       }
//     }

//     document.addEventListener('keydown',reset,false)
//     document.addEventListener('mousemove',debounce,false)
//     document.addEventListener('touchstart',reset,false);
//     document.addEventListener('scroll',debounce,false)
//     document.addEventListener('touchmove',debounce,false);

//     return ()=>{
//       document.removeEventListener('keydown',reset)
//       document.removeEventListener('mousemove',debounce)
//       document.removeEventListener('touchstart',reset)
//       document.removeEventListener('scroll',debounce)
//       document.removeEventListener('touchmove',debounce)
//     }
//   },[reset])
//   return null
// }

function App() {
  // const [isVerifying,setIsVerifying] = useState(true)
  // useEffect(()=>{
  //   function handleVisibilityChange() {
  //     if(document.visibilityState==='visible'){
  //       setIsVerifying(true);
  //     }else{ 
  //       setIsVerifying(false);
  //     }
  //   }
  //   document.addEventListener('visibilitychange',handleVisibilityChange,false)
  //   return ()=>{
  //     document.removeEventListener('visibilitychange', handleVisibilityChange)
  //   }
  // },[setIsVerifying])
  //{isVerifying && <IdleVerifier />}
  const [storageTimeout,
    setStorageTimeout,
    removeStorageTimeout]= useLocalStorage('__example_timeout:',{lastAction: new Date().getTime()+timeout})

  const debounceTimeoutId = useRef(null) 

  const {reset} = useTimeout(()=>{
    // console.log('inativo')
    const time = new Date().getTime()
    console.log('last action',Object.assign(storageTimeout).lastAction )
    console.log('time',time)
    const LSItem = window.localStorage.getItem('__example_timeout:')
    console.log(JSON.parse( LSItem ))
    const actionTime = JSON.parse( LSItem ).lastAction
    console.log(actionTime)
    if(actionTime< time) { 
      alert('inativo')
    }

  },timeout)
 
  useEffect(()=>{
    function debounce(){ 
      // console.log('debounce')
      if(!debounceTimeoutId.current){
        debounceTimeoutId.current = setTimeout(()=>{
          reset()
          setStorageTimeout({lastAction: new Date().getTime()+timeout})
          debounceTimeoutId.current = null
        },debounceMaxTime)
      }else{ 
        clearTimeout(debounceTimeoutId.current);
        debounceTimeoutId.current = setTimeout(()=>{
          setStorageTimeout({lastAction: new Date().getTime()+timeout})
          reset()
          debounceTimeoutId.current = null
        },debounceMaxTime)
      }
    }
    function resetLocalStorageTimeout(){
      reset()
          setStorageTimeout({lastAction: new Date().getTime()+timeout})
          console.log('reset',{lastAction: new Date().getTime()+timeout})
    }

    document.addEventListener('keydown',resetLocalStorageTimeout,false)
    document.addEventListener('mousemove',debounce,false)
    document.addEventListener('touchstart',resetLocalStorageTimeout,false);
    document.addEventListener('scroll',debounce,false)
    document.addEventListener('touchmove',debounce,false);

    return ()=>{
      document.removeEventListener('keydown',resetLocalStorageTimeout)
      document.removeEventListener('mousemove',debounce)
      document.removeEventListener('touchstart',resetLocalStorageTimeout)
      document.removeEventListener('scroll',debounce)
      document.removeEventListener('touchmove',debounce)
    }
  },[reset,setStorageTimeout])
  return (
    <div className="App">
      <header className="App-header">
       <p> {Object.assign(storageTimeout).lastAction }</p>
      </header>
    </div>
  );
}

export default App;
