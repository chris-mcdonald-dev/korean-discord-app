const mongoose = require('mongoose');

const RoleMessageSchema = new mongoose.Schema({
    messageId: { type: String, unique: true, required: true },
    channelId: { type: String, unique: false, required: true },
    roleReactions: [{
        roleId: { type: String, unique: false, required: true },
        reactionName: { type: String, unique: false, required: true },
    }]
}, { collection: 'RoleMessage' }).index({
    messageId: 1,
    channelId: 1
}, {
    unique: true
});

mongoose.model('RoleMessage', RoleMessageSchema);
