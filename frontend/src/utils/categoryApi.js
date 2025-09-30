//const API_URL = 'http://localhost:5000/api/categories'
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCategories() {
    const res = await fetch(`${API_URL}/api/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
}

export async function fetchPostedCategories() {
    const res = await fetch(`${API_URL}/api/categories/posted`);
    if (!res.ok) throw new Error('Failed to fetch posted categories.')
    return res.json()
}

export async function addCategory(name) {
    const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({name}),
    })
    if (!res.ok) throw new Error('Failed to add category')
    return res.json();
}

export async function deleteCategory(id) {
    try {
        const res = await fetch(`${API_URL}/api/categories/${id}`, {method: 'DELETE'});
        const data = await res.json()
        
        return {ok: res.ok, data};
    }
    catch (err) {
        console.error('Error deleting category', err)
        return {ok: false, data: {message: `This category cannot be removed because it is still assigned to existing products.`}}
    }
}

// ✅ New: fetch categories used in products
export async function fetchCategoriesFromProducts() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = user.token?.trim()
    const res = await fetch(`${API_URL}/api/categories/from-products`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch categories from products.');
    return res.json();
}
