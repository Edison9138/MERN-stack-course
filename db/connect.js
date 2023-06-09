import mongoose from "mongoose"

const connectDB = (url) => {
    // after mongoose 6 don't need to add deprecation warnings
    return mongoose.connect(url)
}

export default connectDB