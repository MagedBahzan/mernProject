import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import validator from "validator"

// setup data types using mongoose schema
// Important => any data dosn't exist in the schema will not included in the created data even if it's written
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'user must have a name'],
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'user must have age'],
      validate: {
        //custom valdator
        validator: function (val) {
          return val <= 130; // return only true or false
        },
        message: 'error',
      },
    },
    gender: {
      type: String,
      required: [true, 'user must have gender'],
    },
    email: {
      type: String,
      required: [true, 'user must have email'],
      unique: true,
      validate: validator.isEmail, // read the doc on githup => search validator github
    },
    password: {
      type: String,
      required: [true, 'user must have password'],
      select: false, //always hide from send in the res
      maxLength: [10, 'password must be less than or equal to 10'],
      minLength: [5, 'password must be more than or equal to 5'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'user must have password'],
      validate: {
        validator: function (ele) {
          return ele === this.password;
        },
        message: 'password confirmation error',
      },
    },
    rating: {
      type: Number,
      default: 0,
      max: [5, 'max rate is 5'],
      min: [0, 'min rate is 0'],
    },
    activation: {
      type: Boolean,
      default: true,
    },
    passChangDate: Date,
    passwordResetToken: String,
    passwordResetExpiers: Date,
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
  },
  {
    // virtuals properties call in the schima
    // These data isn't part of the database query , we cant call it from data base
    toJSON: { virtuals: true }, // when data output as json
    toObject: { virtuals: true }, //when data output as object
  },
);

//DOCUMENT MIDDLEWARE
// document in the database
// process the curent document pefore saving it --- only work ehen using save()  or create()  methods
userSchema.pre('save', async function (next) {
  //only run this function if password is modifid
  if (!this.isModified('password')) return next();
  //crypt the password
  this.password = await bcrypt.hash(this.password, 12);
  //delete passowrdConfim feild
  this.passwordConfirm = undefined;
  next();
});

//check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkPassChangDate = function (JWTTimestamp) {
  if (this.passChangDate) {
    const changeTimestamp = parseInt(this.passChangDate.getTime() / 1000, 10);
    return changeTimestamp > JWTTimestamp;
  }

  // false means password has not changed
  return false;
};

//create randome token
userSchema.methods.createPasswordResetToken = function () {
  //create random reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  //crypt the random reser token to save it into the DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpiers = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// call this after saving data
// userSchema.post('save', function (doc, next) {
//   next();
// });

// QUERY MIDDLEWARE
// query send to the front-end
// return query with some process
userSchema.pre(/^find/, function (next) {
  //regular exprtion to use this middelware with all find methode "find - findOne - ...ect"
  this.find({ activation: { $eq: true } });
  next();
});

//AGGRIGATIOM MIDDELWARE
userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { activation: { $eq: true } } });
  next();
});

// creating the model
const User = mongoose.model('User', userSchema);

export default User;
