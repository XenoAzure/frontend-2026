import { useState } from "react";

/* 
Manejar con estados de react el estado actual de una consulta HTTP

EJEMPLO:
Traigo productos de la API
    loading: es un estado booleano que representa si la operacion esta cargando o no
    error: Es un estado que representa el error de la operacion (SI lo hay, sino es null)
    response: Es un estado que representa la respuesta de la operacion (Si la hay, sino es null)
La idea es usar a useRequest POR CADA CONSULTA AL SERVIDOR
Nos sirve para centralizar y reutilizar el comoportamiento a nivel de estados de nuestra app cuando hace una consulta al servidor
*/

function useRequest (){
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);


    /* 
    Recibe una funcion que emita un consulta al servidor por parametro (Callback)
    */
    async function sendRequest( {requestCb} ){
        try{
            // Do NOT clear response — keep stale data visible during background refreshes
            setError(null)
            setLoading(true)
            const res = await requestCb()
            setResponse(res)
        }
        catch(error){
            console.log(error)
            setError(error)
        }
        finally{
            setLoading(false)
            setIsFirstLoad(false)
        }
    }


    return {
        sendRequest,
        response,
        error,
        loading,
        isFirstLoad
    }
}

export default useRequest