import axios from 'axios';

const api = axios.create({
  baseURL: 'http://34.231.200.200:8000',
});

// Modalidades
//    GETS
export const getModalities = () => api.get('/modalities/');
export const getModality = (id: number) => api.get(`/modalities/${id}/`);
//    POST
export const createModality = (data: { name: string; description?: string }) => 
  api.post('/modalities/', data);
//    PUT
export const updateModality = (id: number, data: { name: string; description?: string }) =>
  api.put(`/modalities/${id}/`, data);
//  DELETE
export const deleteModality = (id: number) => api.delete(`/modalities/${id}/`);

// Estruturas
//  GETS
export const getStructures = () => api.get('/structures/');
export const getStructure = (id: number) => api.get(`/structures/${id}/`);
//  POST
export const createStructure = (data: {
  name: string;
  description?: string;
  skatespot_id?: number[];
  modality_id?: number[];
}) => api.post('/structures/', data);
//  PUT
export const updateStructure = (
  id: number,
  data: {
    name: string;
    description?: string;
    skatespot_id?: number[];
    modality_id?: number[];
  }
) => api.put(`/structures/${id}/`, data);
//  DELETE
export const deleteStructure = (id: number) => api.delete(`/structures/${id}/`);

// Eventos
//  GETS
export const getEvents = () => api.get('/skate-events/');
export const getEvent = (id: number) => api.get(`/skate-events/${id}`);
//  POST
export const createEvents = (data: {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string ;
  create_date:  string;
  location_id: number;
}) => api.post('/events/', data);
//  PUT
export const updateEvent= (
  id: number,
  data: {
    id: number;
    name: string;
    description: string;
    start_date: string;
   end_date: string ;
   create_date:  string;
   location_id: number;
  }
) => api.put(`/skate-events/${id}/`, data);
//  DELETE
export const deleteEvent = (id: number) => api.delete(`/skate-events/${id}/`);

// Pistas
//  GETS
export const getSpots = () => api.get("/skate-spots/");
export const getSpot = (id: number) => api.get(`/skate-spots/${id}/`);

// Lojas
export const getShops = () => api.get("/skate-shops")

export default api;
