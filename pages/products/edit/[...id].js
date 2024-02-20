import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProduct(){

    const [productInfo, setProductInfo] = useState(null)
    const router = useRouter()
    const {id} = router.query
    
    

    useEffect(() => {
        if(id){
            axios.get("/api/products?id="+id)
            .then((res) => {
                setProductInfo(res.data)
            })
        }
        console.log(productInfo)
        
    }, [id])

    return (
        <Layout>
            {
                productInfo ? (
                    <>
                        <h1>Edit Product</h1>
                        <ProductForm {...productInfo}/>
                    </>
                ) :
                <>
                    <h1>Cargando...</h1>
                </>
            }
        </Layout>
    )
}