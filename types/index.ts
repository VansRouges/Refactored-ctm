export interface CopyTradingOption {
  $id: string;
  trade_title: string;
  trade_token: string;
  full_name?: string;
  trade_duration?: number;
  trade_token_address?: string;
  initial_investment: number;
  trade_current_value: number;
  trade_roi_min?: number,
  trade_roi_max?: number,
  isProfit: boolean;
  user_id?: string;
  trade_profit_loss: number;
  trade_win_rate: number;
  trade_risk: string;
  copiedSince?: string;
  $createdAt?: string;
  trade_status: string;
}

export interface Live{
  name: string;
  price: number
}

export interface Testimonial {
    name: string;
    role: string;
    content: string;
    avatar: string;
  }
  
  export interface Stocks {
    $id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    isMinus: boolean;
  }
  
export interface User {
  id: string;
  username: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  emailAddresses: string[];
  publicMetadata?: {
    role?: string;
    currentValue?: number;
    totalInvestment?: number;
    roi?: number;
    accountStatus?: boolean;
    kycStatus?: boolean;
  };
  lastSignInAt?: string;
  createdAt: string;
}
export interface SelectedUser {
  id: string;
  username: string;
  imageUrl: string;
  name: string;
  email: string;
  role: string;
  currentValue: number;
  totalInvestment: number;
  roi: number;
  accountStatus?: boolean;
  kycStatus?: boolean;
  lastSeen?: string;
  joinDate: string;
}

  export interface Transaction {
    id: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
    date: string;
  }
  
  export interface Cryptocurrency {
    $id: string;
    token_name: string;
    token_symbol: string;
    token_address: string;
    user_id: string;
    user_name: string;
  }
  
  export interface DepositCryptocurrency {
    id: string;
    name: string;
    value: string;
    address: string;
  }
  
  export interface Profile {
    id: null;
    full_name: string;
    phone_number: string;
    user_name: string;
    avatar_url: string;
    copy_trader: null;
    account_status: null;
    total_investment: null;
    current_value: null;
    roi: null;
    kyc_status: boolean;
    isAdmin: boolean;
    user_id: string;
  }
  
  export interface Stock {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    isMinus: boolean;
  }

  export interface AdminStock {
    $id: string;
    stock_status: string;
    full_name: string;
    stock_symbol: string;
    stock_quantity: number;
    stock_initial_value_pu: number;
    stock_current_value: number;
    stock_change: number;
    isProfit: boolean;
    stock_profit_loss: number;
    isMinus: boolean;
    stock_token: string;
    stock_name: string;
    stock_initial_value: number;
    stock_value_entered: number;
    stock_token_address: string;
  }