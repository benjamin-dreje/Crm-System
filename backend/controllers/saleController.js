import { Sale } from "../model/salesModel.js";

export async function getSales(req, res) {
  try {
    const sales = await Sale.find();

    if (!sales || sales.length === 0) {
      return res.status(404).json({ message: "No sales found" });
    }

    // תאריכים לצורך חישוב
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    // 1. סינון מכירות של החודש הנוכחי וסיכומן
    const thisMonthSalesList = sales.filter(
      (sale) => new Date(sale.createdAt) >= startOfThisMonth,
    );
    const thisMonthSalesSum = thisMonthSalesList.reduce(
      (sum, sale) => sum + (sale.amount || 0),
      0,
    );

    // 2. סינון מכירות של החודש שעבר וסיכומן
    const lastMonthSalesList = sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= startOfLastMonth && saleDate <= endOfLastMonth;
    });
    const lastMonthSalesSum = lastMonthSalesList.reduce(
      (sum, sale) => sum + (sale.amount || 0),
      0,
    );

    // 3. חישוב ההפרש (באחוזים או בערך מספרי - שמתי לך את שניהם)
    const differenceAmount = thisMonthSalesSum - lastMonthSalesSum;
    let differencePercentage = 0;
    if (lastMonthSalesSum > 0) {
      differencePercentage =
        ((thisMonthSalesSum - lastMonthSalesSum) / lastMonthSalesSum) * 100;
    }

    // החזרת התשובה עם כל הנתונים המבוקשים
    res.json({
      allSales: sales,
      analytics: {
        thisMonth: {
          count: thisMonthSalesList.length,
          totalAmount: thisMonthSalesSum,
        },
        lastMonth: {
          count: lastMonthSalesList.length,
          totalAmount: lastMonthSalesSum,
        },
        difference: {
          amount: differenceAmount,
          percentage: Number(differencePercentage.toFixed(2)), // עיגול ל-2 ספרות אחרי הנקודה
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
