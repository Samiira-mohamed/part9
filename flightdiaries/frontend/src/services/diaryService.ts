import axios from 'axios';
import type { DiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;

const getAll = () => {
  return axios
    .get<DiaryEntry[]>(baseUrl)
    .then(response => response.data);
};

const create = (object: NewDiaryEntry) => {
  return axios
    .post<DiaryEntry>(baseUrl, object)
    .then(response => response.data);
};

export default { getAll, create };
