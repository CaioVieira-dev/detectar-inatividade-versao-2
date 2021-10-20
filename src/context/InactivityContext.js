import {createContext,
        useEffect,
        useState,
        useCallback} from 'react';
import {debounce} from 'lodash'

export const InactivityContext = createContext({})

function useLocalStorage(key,defaultValue){
  const [value, setValue] = useState(() => {
    const jsonValue = window.localStorage.getItem(key)
    if (jsonValue != null) return JSON.parse(jsonValue)
    
    if (typeof initialValue === "function") {
      return defaultValue()
    } else {
        return defaultValue
      }})
    
  useEffect(() => {
    if (value === undefined) return window.localStorage.removeItem(key)
      window.localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])
    
  const remove = useCallback(() => {
    setValue(undefined)
  }, [])
    
  return [value, setValue, remove]
}

const EventsListened = ['keydown','touchstart','mousemove','scroll','touchmove']
/**types
 * onInactivity= função;
 * configs = {
 * timeout: tempo em ms,
 * debounceMaxTime: tempo em ms,
 * storage:string,
 * } */
function onIdle(storage,onInactivity){
  const LSItem = window.localStorage.getItem(storage?storage:'__example_timeout:')
  const expiration = JSON.parse( LSItem ).expirationTime

  const time = new Date().getTime()

  // console.log('timeout')//mostra que aconteceu o timout numa aba não focada

  /**O valor de 'expiration' foi setado para quando o timeout deve acontecer
   * O valor 'time' é o momento de agora
   * Em teoria, 'expiration' e 'time' devem ter o mesmo valor se o usuario ficar inativo
   * ou devem ser diferentes se houve ação em outra aba,
   * quando há ação em outra aba, 'time'-'expiration' é um numero negativo
   * 
   * enquanto testava, vi varias vezes uma diferença entre -20 e 0
   * esse deve ser o tempo de execução do codigo,
   * por conta disso o alert não era disparado. 
   * Ao reduzir 50ms da expiração, eu garanto que no caso de uma inatividade o alert seja disparado.
   * 50ms é um valor empirico menor do que o debounce
   */
  if(expiration-50<= time) { 
    alert('inativo')
    /*
    Inserir logica para lidar com inatividade
    */
   if(typeof onInactivity ==='function'){
      onInactivity()
   }
  }
}


export function InactivityContextProvider(props){
  const [storageTimeout,
      setStorageTimeout]= useLocalStorage(props.configs.storage?props.configs.storage:'__example_timeout:',{expirationTime: new Date().getTime()+(props.configs.timeout)})

  const [timeoutId,setTimeoutId] =useState()

  const prepareTimeout = useCallback(()=>{
    return setTimeout(()=>onIdle(props.configs.storage,props.onInactivity),props.configs.timeout)  
  },[props.configs.storage,props.onInactivity,props.configs.timeout])

  const ResetTimeout = useCallback(()=>{ 
    console.log('timeout: '+timeoutId)
    clearTimeout(timeoutId)
    setTimeoutId(prepareTimeout())
    console.log('timeout: '+timeoutId)
  },[setTimeoutId,timeoutId,prepareTimeout])
  
  useEffect(()=>{
    setTimeoutId(prepareTimeout())
  },[prepareTimeout])

  useEffect(()=>{  
    const debouncedEvent= debounce(()=>{
      console.log('debounced')
      ResetTimeout();
      setStorageTimeout({expirationTime: new Date().getTime()+props.configs.timeout})
    },props.configs.debounceMaxTime);

    EventsListened.forEach((event)=>{
      document.addEventListener(event,debouncedEvent,false)
    })

    return ()=>{
      EventsListened.forEach((event)=>{
        document.removeEventListener(event,debouncedEvent)
      })
    }},[ResetTimeout,
        setStorageTimeout,
        props.configs.debounceMaxTime,
        props.configs.timeout])

  return <InactivityContext.Provider value={{
      storageTimeout
  }}>{props.children}</InactivityContext.Provider>
}