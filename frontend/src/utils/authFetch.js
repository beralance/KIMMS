export const authFetch = async (url, options = {}, token) => {
    const headers = {
        'Content-Type' : 'application/json',
        ...(options.headers || {}),
        ...(token ? {'Authorization' : `Bearer ${token}`} : {})
    }

    const res = await fetch(url, { ...options, headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data
}

//askjdflkjsdaf