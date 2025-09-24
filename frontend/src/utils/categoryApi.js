const API_URL = 'http://localhost:5000/api/categories'

export async function fetchCategories() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
}

export async function addCategory(name) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({name}),
    })
    if (!res.ok) throw new Error('Failed to add category')
    return res.json();
}

export async function deleteCategory(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
        const data = await res.json()
        
        return {ok: res.ok, data};
    }
    catch (err) {
        console.error('Error deleting category', err)
        return {ok: false, data: {message: `This category cannot be removed because it is still assigned to existing products.`}}
    }
}
