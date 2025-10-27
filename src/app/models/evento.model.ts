export interface Evento {
  id?: string;
  titulo: string;
  fecha: string;     
  salonId: string;
  aforoMax: number; 
  descripcion?: string;
  publicado: boolean; 
  portadaUrl?: string;
}
