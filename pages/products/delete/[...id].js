import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductPage(){

    const router = useRouter()
    const {id} = router.query;

    const [productInfo, setProductInfo] = useState(null)
    const [goToProducts, setGoToProducts] = useState(false);

    useEffect(() => {

        if(!id)return

        axios.get("/api/products?id="+id)
        .then((res) => {
            setProductInfo(res.data)
            
        })
        
    }, [id])

    function goBack(){
        router.push("/products");
    }

    if(goToProducts){
        goBack()
    }

    async function deleteProduct(){
        await axios.delete("/api/products?id="+id)
        .then(() => setGoToProducts(true))
    }

    

    return (
        <Layout>
            {
                productInfo ? 
                <>
                        <h1 className="text-center">Do you really want to delete product {productInfo?.title}?</h1>
                        <div className="flex gap-2 justify-center">
                            <button onClick={deleteProduct} className="btn-accept">Yes</button>
                            <button className="btn-red" onClick={goBack}>No</button>
                        </div>
                        
                </>:
                <>
                    <p>Cargando...</p>
                </>
            }
        </Layout>
    )
}