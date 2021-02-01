import mongoose from 'mongoose';

const StudySessionSchema = new mongoose.Schema(
    {
        message: {
            id: {type: String, unique: true, required: true},
            link: {type: String, required: true},
            text: {type: String, required: true}
        },
        author: {
            id: {type: String, required: true},
            username: {type: String, required: true}
        },
        subscribersId: [{type: String, required: true}],
        startDate: {type: Date, required: true},
        estimatedLength: {type: Number, required: true},
        notificationSent: {type: Boolean, default: false}
    },
    {collection: 'StudySession'}
);

mongoose.model('StudySession', StudySessionSchema);
