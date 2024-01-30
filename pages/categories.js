import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CategoriesPage(){

    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState("")
    const [parentCategory, setParentCategory] = useState("")
    const [categories, setCategories] = useState(null)
    

    async function saveCategory(e){
        e.preventDefault();
        const data = {name, parentCategory}
        if(editedCategory){
            await axios.put("/api/categories", {...data, _id: editedCategory._id})
            setEditedCategory(null)
        }else{
            await axios.post("/api/categories", data)
            
        }
        setName("");
        setParentCategory("")
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        
    }

    function fetchCategories(){
        axios.get("/api/categories")
        .then(res => {
            setCategories(res.data)
        })
    }

    useEffect(() => {
        fetchCategories()
        
    }, []);

    return (
        <Layout>
            <h1>Categories</h1>

            <label>{editedCategory ? 
                    `Edit category ${editedCategory.name}`:
                    "New category name"}
            </label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                className="mb-0" 
                type="text" 
                placeholder="Category name"
                value={name}
                onChange={e => setName(e.target.value)}
                />
                <select className="mb-0"
                        value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)}
                >
                    <option value="0">No parent category.</option>
                    {categories && (
                        categories.map(i => (
                            <option key={i._id} value={i._id}>{i.name}</option>
                        ))
                    )
                    
                    }
                </select>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>

            {
                categories ? (
                    <table className="basic mt-4">
                        <thead>
                            <tr>
                                <td>Category name</td>
                                <td>Parent category</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(i => (
                                <tr key={i._id}>
                                    <td>{i.name}</td>
                                    <td>{i?.parent?.name}</td>
                                    <td>
                                        <button onClick={() => editCategory(i)} className="btn-primary mr-1">
                                            
                                            Edit
                                        </button>
                                        <button className="btn-primary mr-1">
                                            

                                                Delete
                                        </button>
                                        
                                    </td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                ) :
                <p>Cargando...</p>
                
            }

            
            
        </Layout>
    )
}