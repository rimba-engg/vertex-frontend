export interface TableData {
  headers: string[];
  rows: string[][];
}

export const demoTables = {
  initial: {
    headers: ['Product', 'Price'],
    rows: [
      ['Laptop Pro X', ''],
      ['Wireless Mouse', ''],
      ['USB-C Cable', ''],
    ]
  },
  selected: {
    headers: ['Product', 'Price'],
    rows: [
      ['Laptop Pro X', 'FILL'],
      ['Wireless Mouse', 'FILL'],
      ['USB-C Cable', 'FILL'],
    ]
  },
  completed: {
    headers: ['Product', 'Price'],
    rows: [
      ['Laptop Pro X', '$1,299.99'],
      ['Wireless Mouse', '$29.99'],
      ['USB-C Cable', '$14.99'],
    ]
  }
} as const;