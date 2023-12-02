type Methods = "GET" | "POST" | "PATCH" | "DELETE" 

export default async function MakeRequest(url: string,method: Methods, payload: Record<any,any>, cookie: string = ""){
    
    let headers = {
        'Content-Type': 'application/json',
        Cookie: cookie
    }

    let options = {
        method,
        headers,
        body: JSON.stringify(payload)
    }

    return fetch(url, options)
    .then((response) => {
        return response
    })

    .catch((error: any) => {
        throw error
    })

}
