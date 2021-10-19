import {useEffect} from 'react'
import useTimeout from './useTimeout'
import {useLocalStorage} from './useStorage'
import {debounce} from 'lodash'

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
     const debouncedEvent= debounce(()=>{
            reset();
            setStorageTimeout({expirationTime: new Date().getTime()+configs.timeout})
          },configs.debounceMaxTime);

        EventsListened.forEach((event)=>{
          document.addEventListener(event,debouncedEvent,false)
        })

        return ()=>{
          EventsListened.forEach((event)=>{
            document.removeEventListener(event,debouncedEvent)
          })
          }
        },[reset,
            setStorageTimeout,
            configs.debounceMaxTime,
            configs.timeout,
          ])


    return [storageTimeout]
}