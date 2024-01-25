import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res){
    await mongooseConnect()

    if(req.method == "GET"){

        if(req.query?.id){
            res.json(await Category.findById(req.query.id))
        }else{
            res.json(await Category.find())
        }
        
    }

    if(req.method == "POST"){
        const {name, parentCategory} = req.body;

        const categorieDoc = await Category.create({name, parent: parentCategory});
        res.json(categorieDoc)
        
    }

    if(req.method == "PUT"){
        const {_id, name} = req.body;

        await Category.updateOne({_id}, {name})
        res.json(true)
    }

    if(req.method == "DELETE"){
        if(req.query?.id){
            await Category.deleteOne({_id:req.query?.id})
            res.json(true)
        }
        
        
    }
}