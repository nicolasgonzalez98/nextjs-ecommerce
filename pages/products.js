import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products(){

    const [products, setProducts] = useState(null)

    useEffect(() => {
        axios.get("/api/products")
        .then(res => {
            setProducts(res.data)
            
        })
    }, []);

    return (
        <Layout>
            <Link className="bg-blue-800 rounded-md py-1 px-2 text-white" href="/products/new">Add new product</Link>

            {
                products ? (
                    <table>
                        <thead>
                            <tr>
                                <td>Product Name</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(i => (
                                <tr key={i._id}>
                                    <td>{i.title}</td>
                                    <td>Buttons</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                        
                    
                ) : (
                    <p>Cargando...</p>
                )

            }
        </Layout>
    )
}