let db = require('../db');
import { Document } from 'mongoose';

// CouponCode interface
interface ICouponCode extends Document {
    code: string;
    discount: number;
    expirationDate: Date;
  }

const couponCodeSchema:ICouponCode = new db.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
    index: { expires: '1d' }
  },
});



module.exports = db.model("Coupon", couponCodeSchema);