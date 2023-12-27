import clientPromise from "@/lib/mongodb"
import { Product } from "@/models/Product";
import mongoose from "mongoose"

export default async function handler(req, res) {
    mongoose.Promise = clientPromise;
    if (req.method == "POST"){
        const {title, description, price} = req.body;
        const productDoc = await Product.create({
            title, description, price
        })
        res.json(productDoc)
    }
  }