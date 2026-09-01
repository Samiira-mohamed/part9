import { useState } from "react";
import {
  TextField, Button, Alert, Select, MenuItem, InputLabel,
  FormControl, OutlinedInput, Chip
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { NewEntry, HealthCheckRating, Diagnosis } from "../../types";

interface Props {
  onSubmit: (values: NewEntry) => void;
  error?: string;
  diagnoses: Diagnosis[];
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const AddEntryForm = ({ onSubmit, error, diagnoses }: Props) => {
  const [type, setType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setType(event.target.value as EntryType);
  };

  const handleDiagnosisCodesChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const { value } = event.target;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const submit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    let newEntry: NewEntry;

    if (type === "HealthCheck") {
      newEntry = {
        type: "HealthCheck",
        description,
        date,
        specialist,
        diagnosisCodes,
        healthCheckRating,
      };
    } else if (type === "Hospital") {
      newEntry = {
        type: "Hospital",
        description,
        date,
        specialist,
        diagnosisCodes,
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
        diagnosisCodes,
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
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
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

        <FormControl fullWidth margin="dense">
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisCodesChange}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </div>
            )}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                {diagnosis.code} {diagnosis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {type === "HealthCheck" && (
          <FormControl fullWidth margin="dense">
            <InputLabel>Health check rating</InputLabel>
            <Select
              value={healthCheckRating}
              label="Health check rating"
              onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}
            >
              <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>Critical Risk</MenuItem>
            </Select>
          </FormControl>
        )}

        {type === "Hospital" && (
          <>
            <TextField
              label="Discharge date"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
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
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
            />
            <TextField
              label="Sick leave end"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
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
