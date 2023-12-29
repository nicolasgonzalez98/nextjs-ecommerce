import clientPromise from "@/lib/mongodb"
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose from "mongoose"

export default async function handler(req, res) {
    await mongooseConnect()
    
    if(req.method == "GET"){
        res.json(await Product.find())
    }

    if (req.method == "POST"){
        const {title, description, price} = req.body;
        const productDoc = await Product.create({
            title, description, price
        })
        res.json(productDoc)
    }
  }