import User from "./userModel.js"
import mongoose from "mongoose"

// setup data types using mongoose schema
// Important => any data dosn't exist in the schema will not included in the created data even if it's written
const newsSchema = new mongoose.Schema(
  {
    category: String,
    content: { type: String, maxLength: [10000] }, //news
    content2: { type: String, maxLength: [10000] }, //news
    content3: String, //news
    title: { type: String, unique: true },
    link:{type:String},
    description: String,
    imgSrc: String,
    datePublished: {},
    dateModified: Date,
    activation: {
      type: Boolean,
      default: true,
    },
    headLines: Boolean,
    // author: Array, // use this to embeded all user doc
    author: [
      // use this to referencing user in the news docs
      // {
      //   type: mongoose.Schema.ObjectId,
      //   ref: 'User',
      // },
    ],
    views: { type: Number, default: 0 },
  },
  {
    // virtuals properties call in the schima
    // These data isn't part of the database query , we cant call it from data base
    toJSON: { virtuals: true }, // when data output as json
    toObject: { virtuals: true }, //when data output as object
  },
);

newsSchema.index({ datePublished: 1 }); // improving read preformanc

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

//embedding user data in news document by user id
newsSchema.pre('save', async function (next) {
  const d = new Date();
  this.datePublished = `${d.getDate()},${months[d.getMonth()]},${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`;
  this.link = this.title.replaceAll(" ","-"); 
  //save the data in real document 'embedding user data in news document in DB'
  const authorPromises = this.author.map(
    async (id) => await User.findById(id).select('name age avatar rating'),
  );
  this.author = await Promise.all(authorPromises);
  next();
});

// creating the model
const News = mongoose.model('News', newsSchema);

export default News;
