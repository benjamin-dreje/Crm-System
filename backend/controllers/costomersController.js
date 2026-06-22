// קובץ: controllers/costomersController.js
import { Customer } from "../model/customersModel.js";

// 1. GET /customers/ - קבלת כל הלקוחות מהדאטה-בייס
export const getCoustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    const [totalCustomers, inProgressCount, completedCount] = await Promise.all(
      [
        Customer.countDocuments(), // סך הכל לקוחות
        Customer.countDocuments({ status: "in_progress" }), // לידים בטיפול
        Customer.countDocuments({ status: "closed_won" }), // לידים שנסגרו
      ],
    );
    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "Clients not found" });
    }

    res.status(200).json({
      customers,
      totalCustomers,
      inProgressCount,
      completedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET /customers/:id - קבלת לקוח ספציפי לפי ה-ID
export const getCoustomersById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. POST /customers/create - יצירת לקוח חדש
export const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, idNumber } = req.body;

    const numberRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName || !lastName || !email || !phone || !idNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // בדיקות פורמט
    if (!numberRegex.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone must contain only numbers" });
    }

    if (!numberRegex.test(idNumber)) {
      return res.status(400).json({ message: "ID must contain only numbers" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingCustomer = await Customer.findOne({
      $or: [{ phone }, { idNumber }],
    });

    if (existingCustomer) {
      return res.status(409).json({
        message: "Client with this phone number or ID already exists",
      });
    }

    const newCustomer = new Customer({
      firstName,
      lastName,
      email,
      phone,
      idNumber,
    });

    await newCustomer.save();
    res
      .status(201)
      .json({ message: "Client created successfully", customer: newCustomer });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate field error (phone / ID / email)",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// 4. PUT /customers/update/:id - עדכון פרטי לקוח קיים
export const updateCostomers = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCustomer) {
      return res
        .status(404)
        .json({ message: "Client not found and not updated" });
    }

    res.status(200).json({
      message: "Client updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. DELETE /customers/delete/:id - מחיקת לקוח לפי ID
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
      id: deletedCustomer._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
