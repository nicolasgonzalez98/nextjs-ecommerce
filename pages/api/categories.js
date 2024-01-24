import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res){
    await mongooseConnect()

    if(req.method == "POST"){
        const {name} = req.body;

        const categorieDoc = await Category.create({name});
        res.json(categorieDoc)
        
    }
}