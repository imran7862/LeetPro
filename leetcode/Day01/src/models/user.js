const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        lastName: {
            type: String,
            minlength: 3,
            maxlength: 50,
        },
        emailId: {
            type: String,
            require: true,
            unique: true,
            immutable: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        age:{
            type: Number,
            min: 6,
            max: 120,
        },
        role:{
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        problemSolved: {
            type: [{
                type:Schema.Types.ObjectId,
                ref:'problem',
                default: [] 
            }
           ],
           unique:true
        },
  }, {
    timeestamps: true,
  });

  userSchema.post('findOneAndDelete', async function (userInfo)
{
    if(userInfo)
    {
        await mongoose.model('submission').deleteMany({userId:userInfo._id});
    }
});

  const User = mongoose.model('user', userSchema);
    module.exports = User;