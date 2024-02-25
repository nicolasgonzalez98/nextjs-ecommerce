import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import { AuthOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res){
    await mongooseConnect()
    await isAdminRequest(req, res);

    if(req.method == "GET"){

        if(req.query?.id){
            res.json(await Category.findById(req.query.id))
        }else{
            res.json(await Category.find().populate("parent"))
        }
        
    }

    if(req.method == "POST"){
        const {name, parentCategory, properties} = req.body;
        let categorieDoc
        if (parentCategory){
            categorieDoc = await Category.create({name, parent: parentCategory, properties});
        }else{
            categorieDoc = await Category.create({name, properties});
        }
        
        res.json(categorieDoc)
        
    }

    if(req.method == "PUT"){
        const {_id, name, parentCategory, properties} = req.body;
        let categorieDoc
        if(parentCategory === "0"){
            categorieDoc = await Category.updateOne({_id}, {name, parent: null, properties})
        }else{
            categorieDoc = await Category.updateOne({_id}, {name, parent: parentCategory, properties})
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