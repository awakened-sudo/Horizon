////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    function generateRandomProductData(id: number): Product {
      const categories = [
        'Electronics',
        'Furniture',
        'Clothing',
        'Toys',
        'Groceries',
        'Books',
        'Jewelry',
        'Beauty Products'
      ];

      return {
        id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProducts.push(generateRandomProductData(i));
    }

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();

// Define the shape of Investment data
export type Investment = {
  id: number;
  symbol: string;
  name: string;
  type: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  market_value: number;
  gain_loss: number;
  gain_loss_percentage: number;
  purchase_date: string;
  updated_at: string;
};

// Mock investment data store
export const fakeInvestments = {
  records: [] as Investment[],

  // Initialize with sample data
  initialize() {
    const sampleInvestments: Investment[] = [
      {
        id: 1,
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'Stock',
        quantity: 50,
        purchase_price: 150.0,
        current_price: 175.5,
        market_value: 8775.0,
        gain_loss: 1275.0,
        gain_loss_percentage: 17.0,
        purchase_date: '2024-01-15',
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        type: 'Stock',
        quantity: 25,
        purchase_price: 2800.0,
        current_price: 2950.0,
        market_value: 73750.0,
        gain_loss: 3750.0,
        gain_loss_percentage: 5.36,
        purchase_date: '2024-02-10',
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        symbol: 'SPY',
        name: 'SPDR S&P 500 ETF',
        type: 'ETF',
        quantity: 100,
        purchase_price: 420.0,
        current_price: 445.5,
        market_value: 44550.0,
        gain_loss: 2550.0,
        gain_loss_percentage: 6.07,
        purchase_date: '2024-03-05',
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        symbol: 'BTC',
        name: 'Bitcoin',
        type: 'Cryptocurrency',
        quantity: 0.5,
        purchase_price: 45000.0,
        current_price: 52000.0,
        market_value: 26000.0,
        gain_loss: 3500.0,
        gain_loss_percentage: 15.56,
        purchase_date: '2024-04-20',
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        type: 'Stock',
        quantity: 30,
        purchase_price: 220.0,
        current_price: 195.5,
        market_value: 5865.0,
        gain_loss: -735.0,
        gain_loss_percentage: -11.14,
        purchase_date: '2024-05-15',
        updated_at: new Date().toISOString()
      },
      {
        id: 6,
        symbol: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        type: 'ETF',
        quantity: 75,
        purchase_price: 240.0,
        current_price: 255.75,
        market_value: 19181.25,
        gain_loss: 1181.25,
        gain_loss_percentage: 6.56,
        purchase_date: '2024-06-01',
        updated_at: new Date().toISOString()
      },
      {
        id: 7,
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        type: 'Stock',
        quantity: 40,
        purchase_price: 340.0,
        current_price: 365.25,
        market_value: 14610.0,
        gain_loss: 1010.0,
        gain_loss_percentage: 7.43,
        purchase_date: '2024-07-10',
        updated_at: new Date().toISOString()
      },
      {
        id: 8,
        symbol: 'ETH',
        name: 'Ethereum',
        type: 'Cryptocurrency',
        quantity: 5,
        purchase_price: 2800.0,
        current_price: 3200.0,
        market_value: 16000.0,
        gain_loss: 2000.0,
        gain_loss_percentage: 14.29,
        purchase_date: '2024-08-05',
        updated_at: new Date().toISOString()
      }
    ];

    this.records = sampleInvestments;
  },

  // Get all investments with optional filtering and search
  async getAll({ types = [], search }: { types?: string[]; search?: string }) {
    let investments = [...this.records];

    // Filter investments based on selected types
    if (types.length > 0) {
      investments = investments.filter((investment) =>
        types.includes(investment.type)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      investments = matchSorter(investments, search, {
        keys: ['symbol', 'name', 'type']
      });
    }

    return investments;
  },

  // Get paginated results with optional filtering and search
  async getInvestments({
    page = 1,
    limit = 10,
    types,
    search
  }: {
    page?: number;
    limit?: number;
    types?: string;
    search?: string;
  }) {
    await delay(1000);
    const typesArray = types ? types.split('.') : [];
    const allInvestments = await this.getAll({
      types: typesArray,
      search
    });
    const totalInvestments = allInvestments.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedInvestments = allInvestments.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Investment data for portfolio tracking',
      total_investments: totalInvestments,
      offset,
      limit,
      investments: paginatedInvestments
    };
  },

  // Get a specific investment by its ID
  async getInvestmentById(id: number) {
    await delay(1000);

    const investment = this.records.find((investment) => investment.id === id);

    if (!investment) {
      return {
        success: false,
        message: `Investment with ID ${id} not found`
      };
    }

    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Investment with ID ${id} found`,
      investment
    };
  }
};

// Initialize sample investments
fakeInvestments.initialize();
