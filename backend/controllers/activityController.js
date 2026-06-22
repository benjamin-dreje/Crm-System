import { Activity } from "../model/activitiesModel.js"; 
import { Customer } from "../model/customersModel.js"; 
import { Sale } from "../model/salesModel.js"; 

// 1. GET /customers/activity/:id - קבלת כל הפעילויות של לקוח ספציפי
export const costomersActivity = async (req, res) => {
  try {
    // תוקן ל-customerId כדי להתאים לראוטר המעודכן
    const { customerId } = req.params;

    const activities = await Activity.find({ customerId })
      .populate("customerId", "firstName lastName idNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: `Fetching activity history for customer: ${customerId}`,
      count: activities.length,
      activities: activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. POST /customers/activity - הוספת פעילות אמיתית ללקוח ושמירתה בבסיס הנתונים
export const addcostomersActivity = async (req, res) => {
  try {
    // ה-ID מגיע מכתובת ה-URL ששלח הפרונטאנד
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    //מגיע מהיוזר
    const { statusAtTime, prices, notes } = req.body;

    if (!customerId || !statusAtTime) {
      return res
        .status(400)
        .json({ message: "Customer ID and statusAtTime are required fields" });
    }

    const user = req.user;
    const employeeName = user?.userName ?? "System";

    const newActivity = new Activity({
      customerId, // מקושר ללקוח המורחב
      performedBy: employeeName,
      statusAtTime,
      prices,
      notes,
    });

    await newActivity.save();

    const fullActivity = await newActivity.populate(
      "customerId",
      "firstName lastName",
    );

    res.status(201).json({
      message: "New activity recorded successfully",
      activity: fullActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. PUT /activity/:customerId - עדכון סטטוס הלקוח ושמירת הפעילות בבסיס הנתונים
export const updateCustomerStatus = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { activityId, status, amount } = req.body;
    const userId = req.user.userId; // עדכון סטטוס הלקוח
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { status },
      { returnDocument: "after" },
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // עדכון הפעילות
    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        statusAtTime: status,
      },
      { returnDocument: "after" },
    );

    if (!updatedActivity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    // יצירת מכירה אם נסגרה עסקה
    if (status === "closed_won") {
      await Sale.create({
        user: userId,
        customer: customerId,
        amount: amount || 0,
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
      customer: updatedCustomer,
      activity: updatedActivity,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating status",
      error: error.message,
    });
  }
};
