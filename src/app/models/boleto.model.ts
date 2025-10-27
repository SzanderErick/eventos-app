export interface Boleto {
  id?: string;
  eventoId: string;
  comprador: string;   
  precio: number;
  qrPayload: string;  
  usado: boolean;     
  creadoEn: string;   
}
