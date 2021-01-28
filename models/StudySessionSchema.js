/* ___________ REQUIRE CORE DEPENDENCIES ___________ */

const mongoose = require('mongoose');
/* ------------------------------------------------------- */

/* ___________ CREATING MODEL __________ */

const StudySessionSchema = new mongoose.Schema ({
    message: {
        id: { type: String, unique: true, required: true },
        link: { type: String, required: true },
        text: { type: String, required: true }
    },
    author: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    subscribersId: [{ type: String, required: true }],
    startDate: { type: Date, required: true },
    estimatedLength: { type: Number, required: true }
}, { collection: 'StudySession' });

mongoose.model('StudySession', StudySessionSchema);
/* ------------------------------------------------------- */
