import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        minlength: 3
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3
    },
    provider: {
        type: String,
        default: 'local',
        enum: ['local', 'facebook', 'google'],
        // If it's facebook, google, or other trusted third party
        // Then password would be the granted token
    },
    resetPasswordToken : {
        type: String,
    },
    resetPasswordExpires : {
        type: String,
    }
});

// This is called a pre-hook, before the user information is saved in the database
// this function will be called, we'll get the plain text password, hash it and store it.
UserSchema.pre('save', async function (next) {
    // 'this' refers to the current document about to be saved
    const user = this;

    if(user.provider === 'local' || true)
    {
        // Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
        // your application becomes.
        const hash = await bcrypt.hash(this.password, 10);
        // Replace the plain text password with the hash and then store it
        this.password = hash;
        // Indicates we're done and moves on to the next middleware
    }
    
    next();
});

// We'll use this later on to make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    // Hashes the password sent by the user for login and checks if the hashed password stored in the
    // database matches the one sent. Returns true if it does else false.
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;