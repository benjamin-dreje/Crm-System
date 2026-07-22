import { Activity } from "../model/activitiesModel.js";
import { Customer } from "../model/customersModel.js";
import { Sale } from "../model/salesModel.js";

// 4. GET /status - קבלת לידים שנסגרו ולידים בטיפול
export const getCustomersByStatus = async (req, res) => {
  try {
    // 1. שליפת לידים שנסגרו בהצלחה
    const closedLeads = await Customer.find({ status: "closed_won" }).sort({
      updatedAt: -1,
    });
    console.log("TOTAL CUSTOMERS IN DB:", await Customer.countDocuments({}));

    const newLeads = await Customer.find({
      $or: [
        { status: "lead" },
        { status: { $exists: false } },
        { status: null },
      ],
    }).sort({ updatedAt: -1 });
    // 2. שליפת לידים שנמצאים כרגע בטיפול
    const inProgressLeads = await Customer.find({ status: "in_progress" }).sort(
      { updatedAt: -1 },
    );

    res.status(200).json({
      message: "Fetched leads successfully divided by status",
      analytics: {
        closedCount: closedLeads.length,
        inProgressCount: inProgressLeads.length,
        newLeads: newLeads.length,
        totalLeads:
          closedLeads.length + inProgressLeads.length + newLeads.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching leads by status",
      error: error.message,
    });
  }
};

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
    const { customerId } = req.params;
    const { statusAtTime, prices, notes } = req.body;

    if (!customerId || !statusAtTime) {
      return res.status(400).json({
        message: "Customer ID and statusAtTime are required fields",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // עדכון הסטטוס הנוכחי של הלקוח
    await Customer.findByIdAndUpdate(customerId, {
      status: statusAtTime,
    });

    const user = req.user;
    const employeeName = user?.userName ?? "System";

    const newActivity = new Activity({
      customerId,
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
    res.status(500).json({
      message: error.message,
    });
  }
};

// 3. PUT /activity/:customerId - עדכון סטטוס הלקוח ושמירת הפעילות בבסיס הנתונים
export const updateCustomerStatus = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { activityId, status, amount } = req.body;
    const userId = req.user.userId;

    // עדכון סטטוס הלקוח
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

    // --- ניהול רשומת המכירה לפי הסטטוס החדש ---
    if (status === "closed_won") {
      // אם העסקה נסגרה - מעדכנים מכירה קיימת או יוצרים חדשה במידה ואין
      await Sale.findOneAndUpdate(
        { customer: customerId },
        {
          user: userId,
          amount: amount || 0,
        },
        { upsert: true, new: true },
      );
    } else if (status === "in_progress") {
      // אם הליד חזר לטיפול - מוחקים את רשומת המכירה כדי שלא תספר באנליטיקות
      await Sale.findOneAndDelete({ customer: customerId });
    }

    res.status(200).json({
      message: "Status updated successfully and sales records synchronized",
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
