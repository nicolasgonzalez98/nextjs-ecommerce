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
    category: assignedCategory,
    properties: assignedProperties
}){
        
        const [title, setTitle] = useState(existingTitle || "");
        const [description, setDescription] = useState(existingDescription || "");
        const [category,setCategory] = useState(assignedCategory || '');
        const [productProperties, setProductProperties] = useState(assignedProperties || {})
        const [price, setPrice] = useState(existingPrice || "");
        const [images, setImages] = useState(existingImages || []);
        const [goToProducts, setGoToProducts] = useState(false);
        const [isUploading, setIsUploading] = useState(false)
        //Categories
        const [categories, setCategories] = useState([])
        //
        const router = useRouter();

        async function saveProduct(e) {
            e.preventDefault();
            const data = {title, description, price, images, category, properties: productProperties};
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

        function setProductProp(propName, value){
            setProductProperties(prev => {
                const newProductProps = {...prev};
                newProductProps[propName] = value;
                return newProductProps;
            })
        }

        useEffect(() => {
            fetchCategories()
        }, [])

        const propertiesToFill = [];

        if (categories.length > 0 && category) {
            let catInfo = categories.find(({_id}) => _id === category);
            if (catInfo){
                propertiesToFill.push(...catInfo.properties);
                console.log(propertiesToFill)
            }
            
            // while(catInfo?.parent?._id) {
            //   const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            //   propertiesToFill.push(...parentCat.properties);
            //   catInfo = parentCat;
            // }
        }

        return (
            <form onSubmit={saveProduct}>
                
                <label>Product name</label>
                <input type="text" placeholder="Product Name" value={title} onChange={e => setTitle(e.target.value)}/>
                <label>Category</label>
                <select
                    className="mb-0"
                    value={category}
                    onChange={e => {
                        setCategory(e.target.value)
                        setProductProperties({})
                    }}
                >
                    <option value="">Uncategorized</option>
                    {categories?.length > 0 && categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
                {propertiesToFill?.length > 0 && propertiesToFill.map((p, i) => (
                    <div key={i} className="flex gap-1">
                        <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                        <select value={productProperties[p.name]} onChange={(e) => setProductProp(p.name,e.target.value)}>
                            <option unselectable="">Choose one...</option>
                            {
                                p.values.map((v, i) => (
                                    <option value={v} key={i}>{v}</option>
                                ))
                            }
                        </select>
                    </div>
                ))}
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