import {
    useEffect,
    useRef} from 'react'
import useTimeout from './useTimeout'
import {useLocalStorage} from './useStorage'

/**types
 * onInactivity= função;
 * configs = {
 * timeout: tempo em ms,
 * debounceMaxTime: tempo em ms,
 * storage:string,
 * } */

export function useInactivityCheck(onInactivity,configs){
    const [storageTimeout,
        setStorageTimeout]= useLocalStorage(configs.storage?configs.storage:'__example_timeout:',{lastAction: new Date().getTime()+configs.timeout})
    
      const debounceTimeoutId = useRef(null) 
    
      const {reset} = useTimeout(()=>{
        const time = new Date().getTime()
        const LSItem = window.localStorage.getItem(configs.storage?configs.storage:'__example_timeout:')
        const actionTime = JSON.parse( LSItem ).lastAction
    
        if(actionTime< time) { 
          alert('inativo')
          /*
          Inserir logica para lidar com inatividade
          */
         if(typeof onInactivity ==='function'){
             onInactivity()
         }
        }
    
      },configs.timeout)
    useEffect(()=>{
        function debounce(){ 
            if(!debounceTimeoutId.current){
              debounceTimeoutId.current = setTimeout(()=>{
                reset()
                setStorageTimeout({lastAction: new Date().getTime()+configs.timeout})
                debounceTimeoutId.current = null
              },configs.debounceMaxTime)
            }else{ 
              clearTimeout(debounceTimeoutId.current);
              debounceTimeoutId.current = setTimeout(()=>{
                setStorageTimeout({lastAction: new Date().getTime()+configs.timeout})
                reset()
                debounceTimeoutId.current = null
              },configs.debounceMaxTime)
            }
          }
          function resetLocalStorageTimeout(){
            reset()
                setStorageTimeout({lastAction: new Date().getTime()+configs.timeout})
          }

        document.addEventListener('keydown',resetLocalStorageTimeout,false)
        document.addEventListener('touchstart',resetLocalStorageTimeout,false);
        document.addEventListener('mousemove',debounce,false)
        document.addEventListener('scroll',debounce,false)
        document.addEventListener('touchmove',debounce,false);
        return ()=>{
            document.removeEventListener('keydown',resetLocalStorageTimeout)
            document.removeEventListener('touchstart',resetLocalStorageTimeout)
            document.removeEventListener('mousemove',debounce)
            document.removeEventListener('scroll',debounce)
            document.removeEventListener('touchmove',debounce)
          }
        },[reset,
            setStorageTimeout,
            configs.debounceMaxTime,
            configs.timeout])


    return [storageTimeout]
}