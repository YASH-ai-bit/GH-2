import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const authSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    }
})

authSchema.pre("save", async function (next){
    const salt =  await bcrypt.genSalt();
    this.password =  await bcrypt.hash(this.password, salt);
    next();
})

authSchema.statics.login = async function (email, password) {
    const auth = await this.findOne({email});
    if(auth){
        const _auth = await bcrypt.compare(password, auth.password);
        if(_auth){
            return auth;
        }
        throw Error("Incorrect Password");
    }
    throw Error("Incorrect Email");
}

const Auth = mongoose.model("Auth", authSchema);
export default Auth