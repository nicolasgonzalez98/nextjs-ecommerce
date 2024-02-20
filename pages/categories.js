import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function CategoriesPage({swal}){

    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState("")
    const [parentCategory, setParentCategory] = useState("")
    const [categories, setCategories] = useState(null)
    const [properties, setProperties] = useState([])
    const [property, setProperty] = useState({name:"", values:""})

    async function saveCategory(e){
        e.preventDefault();
        const data = {name, 
            parentCategory, 
            properties: properties.map(p => ({name:p.name, values:p.values.split(",")}))
        }
        if(editedCategory){
            await axios.put("/api/categories", {...data, _id: editedCategory._id})
            setEditedCategory(null)
        }else{
            await axios.post("/api/categories", data)
            
        }
        setName("");
        setParentCategory("")
        setProperties([])
        setProperty({name:"", values:""})
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id || "0")
        setProperties(category.properties.map(({name, values}) => (
            {name, values: values.join(",")}
        )))
    }

    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete'+category.name+"?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#d55",
            
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            reverseButtons: true
        }
        ).then((result) => {
            if (result.isConfirmed) {
              axios.delete("/api/categories?id="+category._id)
              .then(
                swal.fire({
                    title: "Deleted!",
                    text: "Your category has been deleted.",
                    icon: "success"
                  })
              )
              .then(
                fetchCategories()
              )
            }
          });
    }

    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:"", values:""}]
        })
    }

    function cancelEdit(e){
        e.preventDefault()
        setEditedCategory(null)
        setName("");
        setParentCategory("")
        setProperties([])
        setProperty({name:"", values:""})
    }

    function fetchCategories(){
        axios.get("/api/categories")
        .then(res => {
            setCategories(res.data)
        })
    }

    function handlePropertyNameChange(index,category, value){
        setProperties(prev => {
            
            const properties = [...prev]
            
            if(category=="name"){
                properties[index].name = value
            }else if(category=="values"){
                properties[index].values = value
            }
            return properties
            
        })
    }

    function removePropertie(e, index){
        e.preventDefault()
        setProperties(prev => {
            return prev.filter((p, pi) => {
                return pi !== index
            }) ;
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
            <form onSubmit={saveCategory} >
                <div className="flex gap-1">
                    <input 
                    
                    type="text" 
                    placeholder="Category name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    />
                    <select 
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
                </div>
                <div className="mb-1">
                    <label className="block">Properties</label>
                    <button 
                        type="button" 
                        className="btn-default text-sm mb-1"
                        onClick={addProperty}>
                            Add new property
                    </button>
                    {
                        properties.length > 0 && properties.map((p, i) => (
                            <div key={i} className="flex gap-1 mb-2">
                                <input type="text"
                                    onChange={(e) => handlePropertyNameChange(i,"name", e.target.value)}
                                    className="mb-0"
                                    value={p.name} 
                                    placeholder="property name"
                                />
                                <input type="text"
                                    onChange={(e) => handlePropertyNameChange(i,"values", e.target.value)}
                                    className="mb-0"
                                    value={p.values} 
                                    placeholder="values, " 
                                />
                                <button onClick={(e) => removePropertie(e, i)} className="btn-default text-sm">Remove</button>
                            </div>
                        ))
                    }
                </div>
                
                
                <button type="submit" className="btn-primary mr-1">{editedCategory ? "Edit" : "Save"}</button>
                {editedCategory && (
                    <button onClick={cancelEdit} className="btn-primary py-1">Cancel</button> 
                )}
                
            </form>
            
            
            
            
                    {!editedCategory && (
                        <table className="basic mt-4">
                        <thead>
                            <tr>
                                <td>Category name</td>
                                <td>Parent category</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {categories?.map(i => (
                                <tr key={i._id}>
                                    <td>{i.name}</td>
                                    <td>{i?.parent?.name}</td>
                                    <td>
                                        <button onClick={() => editCategory(i)} className="btn-primary mr-1">
                                            
                                            Edit
                                        </button>
                                        <button 
                                        onClick={() => deleteCategory(i)}
                                        className="btn-primary mr-1">
                                                Delete
                                        </button>
                                        
                                    </td>
                                </tr>
                            )
                            )}
                        
                        </tbody>
                    </table>
                )}

            
            
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <CategoriesPage swal={swal}/>
))