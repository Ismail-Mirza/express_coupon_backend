// src/server.ts
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require("cors");
const app = require('./server')();


require('dotenv').config()


const port:Number = 3000;
let db:any = require('./db');


const coupon = require('./routes/coupon')
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1/coupon/',coupon)

// Connect to MongoDB
db.connect(process.env.db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err:any) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
