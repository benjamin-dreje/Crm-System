import { Sale } from "../model/salesModel";

export async function getSales(req, res) {
  const sales = await Sale.find();

  // sales by this mounth

  // sales by last mounth

  //difrence between this mounth and last mounth

  if (!sales || sales.length === 0) {
    return res.status(404).json({ message: "No sales found" });
  }
  res.json(sales);
}
