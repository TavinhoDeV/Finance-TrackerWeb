export interface User {
  userId: string
  name: string
  email: string
  token: string
}

export interface Account {
  id: string
  name: string
  type: number
  balance: number
  currency: string
  createdAt: string
}

export const AccountTypeLabel: Record<number, string> = {
  1: "Conta Corrente", 2: "Poupança", 3: "Cartão de Crédito", 4: "Investimento",
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: number
  category: number
  date: string
  notes?: string
  accountId: string
  createdAt: string
}

export const CategoryLabel: Record<number, string> = {
  1: "Salário", 2: "Alimentação", 3: "Transporte", 4: "Saúde",
  5: "Educação", 6: "Lazer", 7: "Moradia", 8: "Utilidades",
  9: "Compras", 10: "Investimento", 99: "Outros",
}

export interface PagedTransactions {
  items: Transaction[]
  totalCount: number
  page: number
  pageSize: number
}

export interface MonthlySummary {
  year: number
  month: number
  totalIncome: number
  totalExpenses: number
  netBalance: number
  byCategory: CategorySummary[]
}

export interface CategorySummary {
  category: string
  amount: number
  count: number
}
