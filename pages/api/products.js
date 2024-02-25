import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { AuthOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";


export default async function handler(req, res) {
    await mongooseConnect()
    await isAdminRequest(req, res)
    
    if(req.method == "GET"){

        if(req.query?.id){
            res.json(await Product.findById(req.query.id))
        }else{
            res.json(await Product.find())
        }
        
    }

    if (req.method == "POST"){
        const {title, description, price, images, category, properties} = req.body;
        console.log(req.body)
        const productDoc = await Product.create({
            title, description, price, images, category: category == "" ? null : category, properties
        })
        res.json(productDoc)
    }

    if(req.method == "PUT"){
        const {_id, 
            title,
            description, 
            images, 
            price, 
            category,
            properties
        } = req.body;

        await Product.updateOne({_id}, {title, description, price, images, category: category == "" ? null : category, properties})
        res.json(true)
    }

    if(req.method == "DELETE"){
        if(req.query?.id){
            await Product.deleteOne({_id:req.query?.id})
            res.json(true)
        }
        
        
    }
  }