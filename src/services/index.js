/**
 * Punto de entrada centralizado para todos los servicios
 * Facilita las importaciones en los componentes
 */

export { default as colorShifterService } from './colorShifterService';
export { default as languageDetectorService } from './languageDetectorService';
export { default as wordFluxService } from './wordFluxService';

// Exportar también las utilidades y configuraciones si se necesitan
export { default as axiosInstance } from './api/interceptors';
export { ENDPOINTS } from './api/endpoints';
export * from './utils/apiHelpers';
