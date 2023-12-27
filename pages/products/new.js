import Layout from "@/components/Layout";
import axios from "axios";

import { useState } from "react";

export default function NewProduct(){

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    async function createProduct(e) {
        e.preventDefault();
        const data = {title, description, price};
        await axios.post("/api/products", data);


    }

    return (
        <Layout>
            <form onSubmit={createProduct}>
                <h1>New Product</h1>
                <label>Product name</label>
                <input type="text" placeholder="Product Name" value={title} onChange={e => setTitle(e.target.value)}/>
                <label>Description</label>
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}/>
                <label>Price</label>
                <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)}/>

                <button type="submit"  className="btn-primary">Save</button>
            </form>
            
        </Layout>
)}