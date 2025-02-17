import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true },
    classImage: { type: String, required: true },
    classCharacter: { type: String, required: true },
    stats: {
        strength: { type: Number, required: true },
        dexterity: { type: Number, required: true },
        constitution: { type: Number, required: true },
        intelligence: { type: Number, required: true },
        wisdom: { type: Number, required: true },
        charisma: { type: Number, required: true },
    }
})
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    character: characterSchema,
});

const User = mongoose.model("User", userSchema);
export default User;