import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
    title: { 
        type: String,
        required: [true, "Report title is required"],
        enum: ['Tsunami', 'Hurricane', 'Coastal Flooding', 'Typhoon', 'Cyclone', 'Storm Surge', 'Errosion', 'Oil spill', 'Red Tide'],
    },
    description: {
        type: String,
        trim: true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, "Report severity is required"]
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
   image: {
    url: { type: String },        
    public_id: { type: String }
   }
},
{
    timestamps: true,
}
);

reportSchema.index({ location: '2dsphere' });

const Report = mongoose.model('Report', reportSchema);

export default Report;