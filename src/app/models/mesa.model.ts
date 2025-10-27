export interface Mesa {
  id?: string;
  salonId: string;
  numero: number;
  sillas: number;
  forma: 'redonda' | 'cuadrada' | 'rectangular';
  estado: 'disponible' | 'reservada';
}
