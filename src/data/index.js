import products from './products.json'
import customers from './customers.json'
import categories from './categories.json'
import { generateOrders } from './generateOrders.js'

export const orders = generateOrders()
export { products, customers, categories }
