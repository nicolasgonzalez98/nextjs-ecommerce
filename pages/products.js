import Layout from "@/components/Layout";
import Link from "next/link";

export default function Products(){
    return (
        <Layout>
            <Link className="bg-blue-800 rounded-md py-1 px-2 text-white" href="/products/new">Add new product</Link>
        </Layout>
    )
}