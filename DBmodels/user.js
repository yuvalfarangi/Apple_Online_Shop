const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { cartSchema } = require('./cart.js');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    cart_items: { type: [cartSchema], required: false }
});

//{ firstName, lastName, username, email, phoneNumber, password }
userSchema.statics.validateNewUser = async (req) => {

    let formValidation = true;
    let errorMsgs = [];

    if (req.password.length < 8) { formValidation = false; errorMsgs.push("Password must contain 8 digits or more") }
    if (req.phoneNumber.length != 10) { formValidation = false; errorMsgs.push("Phone number must contain 10 digits") }
    if (!/^\d+$/.test(req.phoneNumber)) { formValidation = false; errorMsgs.push("Phone number must contain only digits") }
    const foundUsers = await DBusers.findOne({ username: req.username });
    if (foundUsers) { formValidation = false; errorMsgs.push("User name already in use") }

    return errorMsgs;
}

userSchema.statics.validateEditedUser = async (req) => {

    const user = await DBusers.findById(req.userID);
    let errorMsgs = [];

    if (!req.username) { errorMsgs.push("User name is required") }
    if (!req.firstName) { errorMsgs.push("First name is required") }
    if (!req.email) { errorMsgs.push("Email is required") }
    if (!/^[^@]+@[^@]+$/.test(req.email)) { errorMsgs.push("Email must follow the pattern: Example@Apple.com") }
    if (!req.phoneNumber) { errorMsgs.push("Phone number is required") }
    if (req.password && req.password.length != 8) { errorMsgs.push("Password must contain 8 digits or more") }
    if (req.phoneNumber.length != 10) { errorMsgs.push("Phone number must contain 10 digits") }
    if (!/^\d+$/.test(req.phoneNumber)) { errorMsgs.push("Phone number must contain only digits") }
    const foundUser = await DBusers.findOne({ username: req.username });
    if (foundUser && foundUser._id != req.userID) {
        errorMsgs.push("User name already in use")
    }
    if (req.currentPassword || req.newPassword || req.conNewPassword) {
        const isPasswordMatch = await bcrypt.compare(req.currentPassword, user.password);
        if (!isPasswordMatch) {
            errorMsgs.push("Mismatch passwords");
        }
        else if (req.newPassword != req.conNewPassword) {
            errorMsgs.push("Mismatch passwords");
        }
        if (req.currentPassword.length < 8 || req.newPassword.length < 8 || req.conNewPassword.length < 8) {
            errorMsgs.push("Password must contain 8 digits or more")
        }
    }

    return errorMsgs;
}

userSchema.statics.addNewUser = async (req) => {
    const password = req.password;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new DBusers({
        firstName: req.firstName,
        lastName: req.lastName,
        email: req.email,
        phoneNumber: req.phoneNumber,
        username: req.username,
        password: hashedPassword,
    })
    await user.save();
    return user._id;
}


userSchema.methods.update = async function (req) {
    if (req.firstName && req.firstName !== this.firstName) this.firstName = req.firstName;
    if (req.lastName && req.lastName !== this.lastName) this.lastName = req.lastName;
    if (req.email && req.email !== this.email) this.email = req.email;
    if (req.phoneNumber && req.phoneNumber !== this.phoneNumber) this.phoneNumber = req.phoneNumber;
    if (req.username && req.username !== this.username) this.username = req.username;

    if (req.newPassword) {
        const isPasswordMatch = await bcrypt.compare(req.newPassword, this.password);
        if (!isPasswordMatch) {
            this.password = await bcrypt.hash(req.newPassword, 12);
        }
    }

    await this.save();
};




const DBusers = mongoose.model('User', userSchema);

module.exports = DBusers;
