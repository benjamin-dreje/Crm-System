import mongoose from "mongoose";
import dotenv from "dotenv";
import { Customer } from "./model/customersModel.js";
dotenv.config();

const customers = [
  // =========================
  // 20 לקוחות ללא כתובת
  // =========================
  {
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@gmail.com",
    phone: "0501234501",
    idNumber: "123456701",
  },
  {
    firstName: "Sarah",
    lastName: "Miller",
    email: "sarah.miller@gmail.com",
    phone: "0501234502",
    idNumber: "123456702",
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@gmail.com",
    phone: "0501234503",
    idNumber: "123456703",
  },
  {
    firstName: "Emma",
    lastName: "Davis",
    email: "emma.davis@gmail.com",
    phone: "0501234504",
    idNumber: "123456704",
  },
  {
    firstName: "David",
    lastName: "Levi",
    email: "david.levi@gmail.com",
    phone: "0501234505",
    idNumber: "123456705",
  },
  {
    firstName: "Noa",
    lastName: "Cohen",
    email: "noa.cohen@gmail.com",
    phone: "0501234506",
    idNumber: "123456706",
  },
  {
    firstName: "Daniel",
    lastName: "Green",
    email: "daniel.green@gmail.com",
    phone: "0501234507",
    idNumber: "123456707",
  },
  {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@gmail.com",
    phone: "0501234508",
    idNumber: "123456708",
  },
  {
    firstName: "Maria",
    lastName: "Brown",
    email: "maria.brown@gmail.com",
    phone: "0501234509",
    idNumber: "123456709",
  },
  {
    firstName: "Kevin",
    lastName: "White",
    email: "kevin.white@gmail.com",
    phone: "0501234510",
    idNumber: "123456710",
  },
  {
    firstName: "Laura",
    lastName: "Wilson",
    email: "laura.wilson@gmail.com",
    phone: "0501234511",
    idNumber: "123456711",
  },
  {
    firstName: "Mark",
    lastName: "Taylor",
    email: "mark.taylor@gmail.com",
    phone: "0501234512",
    idNumber: "123456712",
  },
  {
    firstName: "Nina",
    lastName: "Cohen",
    email: "nina.cohen@gmail.com",
    phone: "0501234513",
    idNumber: "123456713",
  },
  {
    firstName: "Peter",
    lastName: "Levy",
    email: "peter.levy@gmail.com",
    phone: "0501234514",
    idNumber: "123456714",
  },
  {
    firstName: "Dana",
    lastName: "Mizrahi",
    email: "dana.mizrahi@gmail.com",
    phone: "0501234515",
    idNumber: "123456715",
  },
  {
    firstName: "Ron",
    lastName: "Peretz",
    email: "ron.peretz@gmail.com",
    phone: "0501234516",
    idNumber: "123456716",
  },
  {
    firstName: "Shira",
    lastName: "Amar",
    email: "shira.amar@gmail.com",
    phone: "0501234517",
    idNumber: "123456717",
  },
  {
    firstName: "Yoni",
    lastName: "Katz",
    email: "yoni.katz@gmail.com",
    phone: "0501234518",
    idNumber: "123456718",
  },
  {
    firstName: "Talia",
    lastName: "Baron",
    email: "talia.baron@gmail.com",
    phone: "0501234519",
    idNumber: "123456719",
  },
  {
    firstName: "Omer",
    lastName: "Raz",
    email: "omer.raz@gmail.com",
    phone: "0501234520",
    idNumber: "123456720",
  },

  // =========================
  // 20 לקוחות עם כתובת
  // =========================

  {
    firstName: "Olivia",
    lastName: "Wilson",
    email: "olivia.wilson@gmail.com",
    phone: "0501234521",
    idNumber: "123456721",
    address: {
      city: "Ashdod",
      street: "HaAtzmaut",
      houseNumber: "55",
      apartment: "4",
      entrance: "B",
    },
  },
  {
    firstName: "James",
    lastName: "Taylor",
    email: "james.taylor@gmail.com",
    phone: "0501234522",
    idNumber: "123456722",
    address: {
      city: "Beer Sheva",
      street: "Rager",
      houseNumber: "10",
      apartment: "1",
      entrance: "A",
    },
  },
  {
    firstName: "Maya",
    lastName: "Israeli",
    email: "maya.israeli@gmail.com",
    phone: "0501234523",
    idNumber: "123456723",
    address: {
      city: "Holon",
      street: "Haim Landau",
      houseNumber: "20",
      apartment: "7",
      entrance: "C",
    },
  },
  {
    firstName: "Robert",
    lastName: "Anderson",
    email: "robert.anderson@gmail.com",
    phone: "0501234524",
    idNumber: "123456724",
    address: {
      city: "Kfar Saba",
      street: "Ben Yehuda",
      houseNumber: "31",
      apartment: "5",
      entrance: "A",
    },
  },
  {
    firstName: "Liam",
    lastName: "Martin",
    email: "liam.martin@gmail.com",
    phone: "0501234525",
    idNumber: "123456725",
    address: {
      city: "Modiin",
      street: "Emek Dotan",
      houseNumber: "12",
      apartment: "8",
      entrance: "B",
    },
  },
  {
    firstName: "Sophia",
    lastName: "Clark",
    email: "sophia.clark@gmail.com",
    phone: "0501234526",
    idNumber: "123456726",
    address: {
      city: "Raanana",
      street: "Ahuza",
      houseNumber: "88",
      apartment: "3",
      entrance: "A",
    },
  },
  {
    firstName: "Ethan",
    lastName: "Walker",
    email: "ethan.walker@gmail.com",
    phone: "0501234527",
    idNumber: "123456727",
    address: {
      city: "Rehovot",
      street: "Herzl",
      houseNumber: "19",
      apartment: "6",
      entrance: "B",
    },
  },
  {
    firstName: "Ava",
    lastName: "Hall",
    email: "ava.hall@gmail.com",
    phone: "0501234528",
    idNumber: "123456728",
    address: {
      city: "Eilat",
      street: "HaYam",
      houseNumber: "25",
      apartment: "2",
      entrance: "A",
    },
  },
  {
    firstName: "Tom",
    lastName: "Adler",
    email: "tom.adler@gmail.com",
    phone: "0501234529",
    idNumber: "123456729",
    address: {
      city: "Haifa",
      street: "Horev",
      houseNumber: "18",
      apartment: "3",
      entrance: "A",
    },
  },
  {
    firstName: "Ella",
    lastName: "Shalev",
    email: "ella.shalev@gmail.com",
    phone: "0501234530",
    idNumber: "123456730",
    address: {
      city: "Jerusalem",
      street: "Jaffa",
      houseNumber: "45",
      apartment: "12",
      entrance: "B",
    },
  },
  {
    firstName: "Adam",
    lastName: "Barak",
    email: "adam.barak@gmail.com",
    phone: "0501234531",
    idNumber: "123456731",
    address: {
      city: "Kiryat Ono",
      street: "Levi Eshkol",
      houseNumber: "40",
      apartment: "9",
      entrance: "B",
    },
  },
  {
    firstName: "Rachel",
    lastName: "Gold",
    email: "rachel.gold@gmail.com",
    phone: "0501234532",
    idNumber: "123456732",
    address: {
      city: "Givatayim",
      street: "Katznelson",
      houseNumber: "60",
      apartment: "10",
      entrance: "A",
    },
  },
  {
    firstName: "Chris",
    lastName: "Evans",
    email: "chris.evans@gmail.com",
    phone: "0501234533",
    idNumber: "123456733",
    address: {
      city: "Bat Yam",
      street: "Ben Gurion",
      houseNumber: "15",
      apartment: "3",
      entrance: "B",
    },
  },
  {
    firstName: "Roni",
    lastName: "Shavit",
    email: "roni.shavit@gmail.com",
    phone: "0501234534",
    idNumber: "123456734",
    address: {
      city: "Netanya",
      street: "Weizmann",
      houseNumber: "22",
      apartment: "6",
      entrance: "A",
    },
  },
  {
    firstName: "Yael",
    lastName: "Friedman",
    email: "yael.friedman@gmail.com",
    phone: "0501234535",
    idNumber: "123456735",
    address: {
      city: "Herzliya",
      street: "Sokolov",
      houseNumber: "33",
      apartment: "2",
      entrance: "B",
    },
  },
  {
    firstName: "Gil",
    lastName: "Carmel",
    email: "gil.carmel@gmail.com",
    phone: "0501234536",
    idNumber: "123456736",
    address: {
      city: "Petah Tikva",
      street: "Rothschild",
      houseNumber: "14",
      apartment: "9",
      entrance: "A",
    },
  },
  {
    firstName: "Nadav",
    lastName: "Eli",
    email: "nadav.eli@gmail.com",
    phone: "0501234537",
    idNumber: "123456737",
    address: {
      city: "Tel Aviv",
      street: "Dizengoff",
      houseNumber: "120",
      apartment: "5",
      entrance: "A",
    },
  },
  {
    firstName: "Hila",
    lastName: "Mor",
    email: "hila.mor@gmail.com",
    phone: "0501234538",
    idNumber: "123456738",
    address: {
      city: "Zichron Yaakov",
      street: "HaMeyasdim",
      houseNumber: "7",
      apartment: "4",
      entrance: "C",
    },
  },
  {
    firstName: "Itay",
    lastName: "Sharon",
    email: "itay.sharon@gmail.com",
    phone: "0501234539",
    idNumber: "123456739",
    address: {
      city: "Nazareth",
      street: "Paul VI",
      houseNumber: "16",
      apartment: "5",
      entrance: "A",
    },
  },
  {
    firstName: "Gal",
    lastName: "Avraham",
    email: "gal.avraham@gmail.com",
    phone: "0501234540",
    idNumber: "123456740",
    address: {
      city: "Ramat Gan",
      street: "Bialik",
      houseNumber: "77",
      apartment: "8",
      entrance: "C",
    },
  },
];
// ערבוב לקוחות כדי שיהיו מעורבים עם ובלי כתובת
customers.sort(() => Math.random() - 0.5);
async function seedCustomers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Customer.deleteMany({});

    await Customer.insertMany(customers);

    console.log("40 customers inserted successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedCustomers();
