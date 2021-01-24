/* ___________ REQUIRE CORE DEPENDENCIES ___________ */

const mongoose = require('mongoose');
/* ------------------------------------------------------- */

/* ___________ CREATING MODEL __________ */

const StudySessionSchema = new mongoose.Schema ({
    id: { type: String, unique: true, required: true },
    author: { type: Object, required: true },
    subscribersId: [{ type: String, required: true }],
    startDate: { type: Date, required: true },
    estimatedLength: { type: Number, required: true }
}, { collection: 'StudySession' });

mongoose.model('StudySession', StudySessionSchema);
/* ------------------------------------------------------- */
