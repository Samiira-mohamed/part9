import { useState } from "react";
import { TextField, Button, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { NewEntry, HealthCheckRating } from "../../types";

interface Props {
  onSubmit: (values: NewEntry) => void;
  error?: string;
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const AddEntryForm = ({ onSubmit, error }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  const [healthCheckRating, setHealthCheckRating] = useState('0');

  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setType(event.target.value as EntryType);
  };

  const submit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const codes = diagnosisCodes
      ? diagnosisCodes.split(',').map(code => code.trim())
      : undefined;

    let newEntry: NewEntry;

    if (type === "HealthCheck") {
      newEntry = {
        type: "HealthCheck",
        description,
        date,
        specialist,
        diagnosisCodes: codes,
        healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
      };
    } else if (type === "Hospital") {
      newEntry = {
        type: "Hospital",
        description,
        date,
        specialist,
        diagnosisCodes: codes,
        discharge: {
          date: dischargeDate,
          criteria: dischargeCriteria,
        },
      };
    } else {
      newEntry = {
        type: "OccupationalHealthcare",
        description,
        date,
        specialist,
        diagnosisCodes: codes,
        employerName,
        sickLeave: sickLeaveStart && sickLeaveEnd
          ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
          : undefined,
      };
    }

    onSubmit(newEntry);
  };

  return (
    <div style={{ border: "1px dashed black", borderRadius: "5px", padding: "1em", marginTop: "1em" }}>
      <h3>New entry</h3>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={submit}>
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type" onChange={handleTypeChange}>
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          </Select>
        </FormControl>

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

        {type === "HealthCheck" && (
          <TextField
            label="Health check rating (0-3)"
            fullWidth
            margin="dense"
            value={healthCheckRating}
            onChange={({ target }) => setHealthCheckRating(target.value)}
          />
        )}

        {type === "Hospital" && (
          <>
            <TextField
              label="Discharge date"
              placeholder="YYYY-MM-DD"
              fullWidth
              margin="dense"
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              label="Discharge criteria"
              fullWidth
              margin="dense"
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer name"
              fullWidth
              margin="dense"
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              label="Sick leave start"
              placeholder="YYYY-MM-DD"
              fullWidth
              margin="dense"
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
            />
            <TextField
              label="Sick leave end"
              placeholder="YYYY-MM-DD"
              fullWidth
              margin="dense"
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
            />
          </>
        )}

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
