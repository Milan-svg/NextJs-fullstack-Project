import mongoose from "mongoose";

type ConnectionObject ={
    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to the database") // checking if already connection hai, cause multiple db connections will lead to choking
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {}) //options study krne h
        console.log(db)
        connection.isConnected = db.connections[0].readyState
        console.log("db connected succesfully")
        
        
    } catch (error) {
        console.log("db connection failed", error)
        process.exit(1)
    }
}
export default dbConnect;