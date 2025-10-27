export interface Mantel {
  id?: string;
  nombre: string;
  color: string;
  tipo: 'tela' | 'plástico' | 'papel';
  stockTotal: number;
  activo: boolean;
}
