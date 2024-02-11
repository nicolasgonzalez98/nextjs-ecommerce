import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";


export default async function handler(req, res) {
    await mongooseConnect()
    
    if(req.method == "GET"){

        if(req.query?.id){
            res.json(await Product.findById(req.query.id))
        }else{
            res.json(await Product.find())
        }
        
    }

    if (req.method == "POST"){
        const {title, description, price, images, category} = req.body;
        console.log(req.body)
        const productDoc = await Product.create({
            title, description, price, images, category
        })
        res.json(productDoc)
    }

    if(req.method == "PUT"){
        const {_id, title, description, images, price, category} = req.body;

        await Product.updateOne({_id}, {title, description, price, images, category})
        res.json(true)
    }

    if(req.method == "DELETE"){
        if(req.query?.id){
            await Product.deleteOne({_id:req.query?.id})
            res.json(true)
        }
        
        
    }
  }