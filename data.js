const vehicleData = [
  {
    make: "Traxxas",
    models: [
      { name: "Slash 4x4", years: ["2022", "2023", "2024"] },
      { name: "X-Maxx", years: ["2021", "2022", "2023"] },
      { name: "Rustler 4x4", years: ["2022", "2024"] }
    ]
  },
  {
    make: "Arrma",
    models: [
      { name: "Kraton 6S", years: ["2021", "2023", "2024"] },
      { name: "Typhon 3S", years: ["2022", "2023"] },
      { name: "Mojave 4S", years: ["2024"] }
    ]
  },
  {
    make: "Axial",
    models: [
      { name: "SCX10 III", years: ["2021", "2022", "2023"] },
      { name: "SCX24", years: ["2022", "2023", "2024"] }
    ]
  }
];

const products = [
  {
    id: 1,
    title: "Heavy Duty Suspension Kit",
    make: "Traxxas",
    model: "Slash 4x4",
    year: "2024",
    price: "$89.99",
    stock: "In Stock",
    category: "Suspension",
    sku: "TRX-SLS-2241"
  },
  {
    id: 2,
    title: "Aluminum Steering Upgrade",
    make: "Traxxas",
    model: "Slash 4x4",
    year: "2023",
    price: "$42.99",
    stock: "In Stock",
    category: "Steering",
    sku: "TRX-STG-1198"
  },
  {
    id: 3,
    title: "Extreme Bash Kit",
    make: "Traxxas",
    model: "X-Maxx",
    year: "2022",
    price: "$149.99",
    stock: "Low Stock",
    category: "Bundle",
    sku: "TRX-XMX-7742"
  },
  {
    id: 4,
    title: "Race Tuned Shock Package",
    make: "Arrma",
    model: "Kraton 6S",
    year: "2024",
    price: "$119.99",
    stock: "In Stock",
    category: "Suspension",
    sku: "ARM-K6S-3014"
  },
  {
    id: 5,
    title: "Street & Track Upgrade Pack",
    make: "Arrma",
    model: "Typhon 3S",
    year: "2023",
    price: "$74.99",
    stock: "In Stock",
    category: "Handling",
    sku: "ARM-T3S-2217"
  },
  {
    id: 6,
    title: "Crawler Essentials Bundle",
    make: "Axial",
    model: "SCX10 III",
    year: "2022",
    price: "$64.99",
    stock: "Backorder",
    category: "Bundle",
    sku: "AXL-SCX-8420"
  },
  {
    id: 7,
    title: "Mini Trail Performance Kit",
    make: "Axial",
    model: "SCX24",
    year: "2024",
    price: "$39.99",
    stock: "In Stock",
    category: "Drivetrain",
    sku: "AXL-M24-9011"
  },
  {
    id: 8,
    title: "Rustler Handling Upgrade Set",
    make: "Traxxas",
    model: "Rustler 4x4",
    year: "2024",
    price: "$58.99",
    stock: "In Stock",
    category: "Handling",
    sku: "TRX-RUS-4166"
  },
  {
    id: 9,
    title: "Desert Power Bundle",
    make: "Arrma",
    model: "Mojave 4S",
    year: "2024",
    price: "$129.99",
    stock: "Low Stock",
    category: "Power",
    sku: "ARM-M4S-5108"
  }
];
