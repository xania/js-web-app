export interface Order {
  title: string;
  count: number;
  options: OrderOption[];
}

export interface OrderOption {
  title: string;
  price: number;
}
