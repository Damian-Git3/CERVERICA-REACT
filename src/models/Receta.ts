export interface IngredienteReceta {
  id: number;
  cantidad: number;
  nombre: string;
  unidadMedida: string;
  fijo: boolean;
}

export interface PasoReceta {
  id: number;
  descripcion: string;
  orden: number;
  tiempo: number;
}

export interface Receta {
  id: number;
  litrosEstimados: number;
  precioLitro: number;
  especificaciones: string;
  precioPaquete1: number;
  precioPaquete6: number;
  precioPaquete12: number;
  precioPaquete24: number;
  precioBaseMayoreo: number;
  puntuacion: number;
  descripcion: string;
  nombre: string;
  costoProduccion: number;
  imagen: string;
  tiempoVida: number;
  rutaFondo: string;
  activo: boolean;
  ingredientesReceta: IngredienteReceta[];
  pasosReceta: PasoReceta[];
}
