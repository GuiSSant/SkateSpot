import axios from 'axios';

const api = axios.create({
  baseURL: 'http://34.231.200.200:8000',
});

export const getModalities = () => api.get('/modalities/');
export const getModality = (id: number) => api.get(`/modalities/${id}/`);
export const createModality = (data: { name: string; description?: string }) => 
  api.post('/modalities/', data);
export const updateModality = (id: number, data: { name: string; description?: string }) =>
  api.put(`/modalities/${id}/`, data);
export const deleteModality = (id: number) => api.delete(`/modalities/${id}/`);

export const getStructures = () => api.get('/structures/');
export const getStructure = (id: number) => api.get(`/structures/${id}/`);
export const createStructure = (data: {
  name: string;
  description?: string;
  skatespot_id?: number[];
  modality_id?: number[];
}) => api.post('/structures/', data);
export const updateStructure = (
  id: number,
  data: {
    name: string;
    description?: string;
    skatespot_id?: number[];
    modality_id?: number[];
  }
) => api.put(`/structures/${id}/`, data);
export const deleteStructure = (id: number) => api.delete(`/structures/${id}/`);
export const getEvents = () => api.get('/events/');
export const createEvents = (data: {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string ;
  create_date:  string;
  location_id: number;
}) => api.post('/events/', data);
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
) => api.put(`/events/${id}/`, data);
export const deleteEvent = (id: number) => api.delete(`/events/${id}/`);


export default api;
