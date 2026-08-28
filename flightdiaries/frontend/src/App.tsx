import { useState, useEffect } from 'react';
import axios from 'axios';
import type { DiaryEntry, Weather, Visibility } from './types';
import diaryService from './services/diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [visibility, setVisibility] = useState<Visibility>('great');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    diaryService.getAll().then(data => {
      setDiaries(data);
    });
  }, []);

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();
    diaryService
      .create({ date, weather, visibility, comment })
      .then(newDiary => {
        setDiaries(diaries.concat(newDiary));
        setDate('');
        setWeather('sunny');
        setVisibility('great');
        setComment('');
        setErrorMessage('');
      })
      .catch(error => {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            setErrorMessage(JSON.stringify(error.response.data));
          } else {
            setErrorMessage('Something went wrong');
          }
        } else {
          setErrorMessage('Unknown error occurred');
        }
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      });
  };

  return (
    <div>
      <h1>Flight diaries</h1>

      {errorMessage && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}

      <h2>Add new entry</h2>
      <form onSubmit={addDiary}>
        <div>
          date
          <input
            type="text"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          weather
          <input
            type="text"
            value={weather}
            onChange={(event) => setWeather(event.target.value as Weather)}
          />
        </div>
        <div>
          visibility
          <input
            type="text"
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as Visibility)}
          />
        </div>
        <div>
          comment
          <input
            type="text"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map(diary => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>visibility: {diary.visibility}</p>
          <p>weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
