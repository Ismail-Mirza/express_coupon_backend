import { NextFunction,Request,Response } from "express";

const router = require('../server').Router();

const Coupon = require("../model/coupon");
class ErrorHandler extends Error{
    constructor(message:string,statusCode:Number){
        super(message);
        Error.captureStackTrace(this,this.constructor);
    }
}
  

// Get all coupon codes
router.get('/get-all', (req: Request, res: Response) => {
    Coupon.find()
      .then((coupons:any) => {
        res.json(coupons);
      })
      .catch((err:any) => {
        res.status(500).json({ error: 'Failed to fetch coupon codes' });
      });
  });

// get coupon code value by its name
router.get(
    "/get/:code",
    async (req:Request, res:Response, next:NextFunction) => {
      try {
        const coupon = await Coupon.findOne({ code: req.params.code });
  
        res.status(200).json({
          success: true,
          coupon,
        });
      } catch (error:any) {
        return next(new ErrorHandler(error, 400));
      }
    }
  );

// Create a new coupon code
router.post('/create', async(req:Request, res:Response,next:NextFunction) => {
  
    try {
        const isCouponExists = await Coupon.find({
            code: req.body?.code,
          });
    
          if (isCouponExists.length !== 0) {
            res.status(400).json({
                error:'Coupon already Existed'
            })
          }
    
          const coupon = await Coupon.create(req.body);
          res.status(201).json({
            success: true,
            coupon,
          });
    } catch (error:any) {
        return next(new ErrorHandler(error, 400));
    }
    
  });


// Update a coupon code
router.put('/update/:id', (req:Request, res:Response) => {
    const { id } = req.params; // Get the coupon ID from the request URL
    const { code, discount, expirationDate } = req.body; // Get the updated coupon details from the request body
  
    // Find the coupon by ID and update its details
    Coupon.findByIdAndUpdate(id, {
      code,
      discount,
      expirationDate,
    })
      .then((updatedCoupon:{
        code: string,
        discount: number,
        expirationDate: Date
      }) => {
        if (updatedCoupon) {
          res.status(201).json(updatedCoupon);
        } else {
          res.status(404).json({ error: 'Coupon code not found' });
        }
      })
      .catch((err:any) => {
        res.status(500).json({ error: 'Failed to update coupon code' });
      });
  });
  
// Delete a coupon code
router.delete('/delete/:id', (req:Request, res:Response) => {
    const { id } = req.params; // Get the coupon ID from the request URL

    // Find the coupon by ID and update its details
    Coupon.findByIdAndDelete(id)
      .then((deletedCoupon:{
        code: string,
        discount: number,
        expirationDate: Date
      }) => {
        if (deletedCoupon) {
          res.status(200).json(
            {
                message:"Coupon Deleted Successfully",
                deletedCoupon
            }
            );
        } else {
          res.status(404).json({ error: 'Coupon code not found' });
        }
      })
      .catch((err:any) => {
        res.status(500).json({ error: 'Failed to delete coupon code' });
      });
  });
  

module.exports = router;