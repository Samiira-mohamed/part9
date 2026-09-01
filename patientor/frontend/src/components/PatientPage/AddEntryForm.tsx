import { useState } from "react";
import { TextField, Button, Alert } from '@mui/material';
import { NewEntry, HealthCheckRating } from "../../types";

interface Props {
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

const AddEntryForm = ({ onSubmit, error }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('0');

  const submit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newEntry: NewEntry = {
      type: "HealthCheck",
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes
        ? diagnosisCodes.split(',').map(code => code.trim())
        : undefined,
      healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
    };
    onSubmit(newEntry);
  };

  return (
    <div style={{ border: "1px dashed black", borderRadius: "5px", padding: "1em", marginTop: "1em" }}>
      <h3>New HealthCheck entry</h3>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={submit}>
        <TextField
          label="Description"
          fullWidth
          margin="dense"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Date"
          placeholder="YYYY-MM-DD"
          fullWidth
          margin="dense"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          margin="dense"
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <TextField
          label="Diagnosis codes (comma separated)"
          fullWidth
          margin="dense"
          value={diagnosisCodes}
          onChange={({ target }) => setDiagnosisCodes(target.value)}
        />
        <TextField
          label="Health check rating (0-3)"
          fullWidth
          margin="dense"
          value={healthCheckRating}
          onChange={({ target }) => setHealthCheckRating(target.value)}
        />
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: "1em" }}
          type="submit"
        >
          Add
        </Button>
      </form>
    </div>
  );
};

export default AddEntryForm;
