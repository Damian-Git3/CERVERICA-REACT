
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

export interface IReceta {
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

export interface Receta {
  id: number;
  litrosEstimados: number;
  precioUnitarioMinimoMayoreo?: number;
  precioUnitarioBaseMayoreo?: number;
  porcentajeDescuento?: number;
  precioLitro?: number;
  precioPaquete1?: number;
  precioPaquete6?: number;
  precioPaquete12?: number;
  precioPaquete24?: number;
  lotesMinimos?: number;
  lotesMaximos?: number;
  puntuacion?: number;
  especificaciones?: string;
  descripcion?: string;
  nombre: string;
  costoProduccion: number;
  imagen: string;
  rutaFondo?: string;
  tiempoVida: number;
  activo: boolean;
  fechaRegistrado: string;
  fecha_registrado: string;
  favorito: boolean;
  nuevo: boolean;
  cantidadEnStock: number;
  estaEnCarrito: boolean;
};

