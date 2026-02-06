export type ScreenType = 'HOME' | 'RESERVATION' | 'WAITLIST' | 'MENU' | 'CART' | 'PAYMENT' | 'CONFIRMATION_RESERVATION' | 'CONFIRMATION_WAITLIST' | 'CONFIRMATION_ORDER' | 'DASHBOARD' | 'SIGN_IN' | 'REGISTER' | 'HELP' | 'CONTACT' | 'ABOUT' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizers' | 'Entrees' | 'Desserts' | 'Beverages';
  image: string;
  badges: ('Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Spicy')[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  instructions?: string;
}

export interface ReservationData {
  name: string;
  phone: string;
  date: Date;
  time: string;
  partySize: number;
}

export interface WaitlistData {
  name: string;
  phone: string;
  partySize: number;
}
