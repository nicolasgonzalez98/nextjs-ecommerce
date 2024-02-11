import axios from "axios";

import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";


export default function ProductForm({
    _id,
    title: existingTitle, 
    description: existingDescription, 
    price: existingPrice,
    images: existingImages,
    category: existingCategory
}){
        
        const [title, setTitle] = useState(existingTitle || "");
        const [description, setDescription] = useState(existingDescription || "");
        const [price, setPrice] = useState(existingPrice || "");
        const [images, setImages] = useState(existingImages || []);
        const [goToProducts, setGoToProducts] = useState(false);
        const [isUploading, setIsUploading] = useState(false)
        //Categories
        const [parentCategory, setParentCategory] = useState(existingCategory || "")
        const [categories, setCategories] = useState(null)
        //
        const router = useRouter();

        async function saveProduct(e) {
            e.preventDefault();
            const data = {title, description, price, images, category: parentCategory};
            console.log(data)
            if (_id){
                await axios.put("/api/products", {...data, _id})
            }else{
                await axios.post("/api/products", data);
            }
            setGoToProducts(true)
            

        }

        function fetchCategories(){
            axios.get("/api/categories")
            .then(res => {
                setCategories(res.data)
            })
        }

        if(goToProducts){
            router.push("/products")
        }

        async function uploadImages(e){
            const files = e.target?.files;

            if(files?.length > 0) {
                setIsUploading(true)
                const data = new FormData()
                for (const file of files){
                    data.append('file', file)
                }
                
                
                const res = await axios.post("/api/upload", data, {
                    headers: {'Content-Type':'multipart/form-data'}
                })
                .then((res) => {
                    setImages(oldImages => {
                            return [...oldImages, ...res.data.links]
                        })
                })
                .then(() => {
                    setIsUploading(false)
                })
                
                
                
                
                
            }

        }

        function updateImagesOrder(images){
            setImages(images)
        }

        useEffect(() => {
            fetchCategories()
        }, [])

        return (
            <form onSubmit={saveProduct}>
                
                <label>Product name</label>
                <input type="text" placeholder="Product Name" value={title} onChange={e => setTitle(e.target.value)}/>
                <label>Category</label>
                <select
                    className="mb-0"
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
                <label>Photos</label>
                <div className="mb-2 flex flex-wrap gap-2">
                    <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-2">
                        {!!images?.length && images.map(link => (
                            <div key={link} className="h-24 ">
                                <img src={link} alt="" className="rounded-lg"/>
                            </div>
                            
                        ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 p-1 bg-gray-200 flex items-center">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    <div>
                        Upload
                    </div>
                    <input type="file" className="hidden" onChange={uploadImages}/>
                    </label>
                    
                </div>
                <label>Description</label>
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}/>
                <label>Price</label>
                <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)}/>

                <button type="submit"  className="btn-primary" disabled={isUploading && true}>Save</button>
            </form> 
)}