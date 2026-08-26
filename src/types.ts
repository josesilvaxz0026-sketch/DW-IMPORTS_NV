export type JerseyCategory = 
  | 'brasileirao' 
  | 'europeu' 
  | 'selecoes' 
  | 'retro' 
  | 'outros';

export type JerseyType = 'normal' | 'retro' | 'selecao';

export type JerseySize = 'P' | 'M' | 'G' | 'GG' | 'XGG';

export type StockStatus = 'in_stock' | 'pre_order' | 'out_of_stock';

export interface CompetitionPatch {
  id: string;
  name: string;
  price: number; // R$ 20
  iconUrl?: string;
}

export interface Jersey {
  id: string;
  name: string;
  team: string;
  league: string;
  category: JerseyCategory;
  type: JerseyType;
  season: string; // e.g. "2025/26", "2024/25", "1981"
  year?: string; // specific year or season
  modelType?: string; // "Titular (1)", "Reserva (2)", "3º Uniforme", "Especial", "Retrô", "Treino", "Goleiro"
  basePrice: number; // 150 for normal/selecao, 170 for retro
  promoPrice?: number; // optional discount price
  imageFront: string;
  imageBack?: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  fontColor: string;
  fontStrokeColor?: string;
  availablePatches: CompetitionPatch[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean; // True by default
  stockStatus?: StockStatus; // 'in_stock' | 'pre_order' | 'out_of_stock'
  availableSizes?: JerseySize[]; // ['P', 'M', 'G', 'GG', 'XGG']
  defaultNumber?: string;
  defaultPlayerName?: string;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCity?: string;
  customerAddress?: string;
  items: CartItem[];
  totalAmount: number;
  discountApplied?: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface CustomizationOptions {
  hasCustomNameNumber: boolean;
  customName: string;
  customNumber: string;
  hasSponsor: boolean;
  selectedPatch?: string; // patch id
  size: JerseySize;
}

export interface CartItem {
  cartItemId: string;
  jersey: Jersey;
  customization: CustomizationOptions;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'bot';
  text: string;
  timestamp: string;
  quickAction?: {
    label: string;
    actionType: 'whatsapp' | 'faq' | 'category' | 'size_guide';
    payload?: string;
  };
}
