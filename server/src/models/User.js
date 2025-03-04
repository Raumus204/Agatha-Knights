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
    },
    attributes: {
        health: { type: Number, required: true },
        armor: { type: Number, required: true },
        initiative: { type: Number, required: true },
        tempHP : { type: Number, required: true },
    },
    potionUses: { type: Number, required: true },
    gold: {type: Number, required: true },
    equipment: {
        weapon: { type: String, required: false },
        armor: { type: String, required: false },
        shield: { type: String, required: false },
    },
    kings: { type: Number, required: false },
    knights: { type: Number, required: false },
    
})
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    character: characterSchema,
});

const User = mongoose.model("User", userSchema);
export default User;