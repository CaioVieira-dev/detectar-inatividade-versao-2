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
const EventsListened = ['keydown','touchstart','mousemove','scroll','touchmove']

export function useInactivityCheck(onInactivity,configs){
    const [storageTimeout,
        setStorageTimeout]= useLocalStorage(configs.storage?configs.storage:'__example_timeout:',{expirationTime: new Date().getTime()+configs.timeout})
    
      const debounceTimeoutId = useRef(null) 
    
      const {reset} = useTimeout(()=>{
        const time = new Date().getTime()
        const LSItem = window.localStorage.getItem(configs.storage?configs.storage:'__example_timeout:')
        const actionTime = JSON.parse( LSItem ).expirationTime
    
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
                setStorageTimeout({expirationTime: new Date().getTime()+configs.timeout})
                debounceTimeoutId.current = null
              },configs.debounceMaxTime)
            }else{ 
              clearTimeout(debounceTimeoutId.current);
              debounceTimeoutId.current = setTimeout(()=>{
                setStorageTimeout({expirationTime: new Date().getTime()+configs.timeout})
                reset()
                debounceTimeoutId.current = null
              },configs.debounceMaxTime)
            }
          }


        EventsListened.forEach((event)=>{
          document.addEventListener(event,debounce,false)
        })

        return ()=>{
          EventsListened.forEach((event)=>{
            document.removeEventListener(event,debounce)
          })
          }
        },[reset,
            setStorageTimeout,
            configs.debounceMaxTime,
            configs.timeout])


    return [storageTimeout]
}