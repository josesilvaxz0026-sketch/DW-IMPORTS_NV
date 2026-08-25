export type JerseyCategory = 
  | 'brasileirao' 
  | 'europeu' 
  | 'selecoes' 
  | 'retro' 
  | 'outros';

export type JerseyType = 'normal' | 'retro' | 'selecao';

export type JerseySize = 'P' | 'M' | 'G' | 'GG' | 'XGG';

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
  season: string;
  basePrice: number; // 150 for normal/selecao, 170 for retro
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
  defaultNumber?: string;
  defaultPlayerName?: string;
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
