import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res){
    await mongooseConnect()

    if(req.method == "GET"){

        if(req.query?.id){
            res.json(await Category.findById(req.query.id))
        }else{
            res.json(await Category.find().populate("parent"))
        }
        
    }

    if(req.method == "POST"){
        const {name, parentCategory} = req.body;
        let categorieDoc
        if (parentCategory){
            categorieDoc = await Category.create({name, parent: parentCategory});
        }else{
            categorieDoc = await Category.create({name});
        }
        
        res.json(categorieDoc)
        
    }

    if(req.method == "PUT"){
        const {_id, name, parentCategory} = req.body;
        let categorieDoc
        if(parentCategory === "0"){
            categorieDoc = await Category.updateOne({_id}, {name, parent: null})
        }else{
            categorieDoc = await Category.updateOne({_id}, {name, parent: parentCategory})
        }
        
        res.json(categorieDoc)
    }

    if(req.method == "DELETE"){
        if(req.query?.id){
            await Category.deleteOne({_id:req.query?.id})
            res.json(true)
        }
        
        
    }
}