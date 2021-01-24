/* ________________ REQUIRE DATABASE DRIVER AND MODELS ________________ */

const mongoose = require('mongoose');
require('./models');
/* ------------------------------------------------------- */

/* ________________ INITIALIZE DATABASE CONNECTION ________________ */

mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log("Connection etablished"))
    .catch((e) => console.log("MongoDB Connection error :" + e));
/* ------------------------------------------------------- */
