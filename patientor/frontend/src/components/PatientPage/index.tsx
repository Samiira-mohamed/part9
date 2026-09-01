import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Button } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Patient, Gender, Diagnosis, NewEntry } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patientData = await patientService.getPatient(id);
        setPatient(patientData);
      }
    };
    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const genderIcon = () => {
    switch (patient.gender) {
      case Gender.Male:
        return <MaleIcon />;
      case Gender.Female:
        return <FemaleIcon />;
      case Gender.Other:
        return <TransgenderIcon />;
      default:
        return null;
    }
  };

  const submitNewEntry = async (values: NewEntry) => {
    if (!id) return;
    try {
      const newEntry = await patientService.addEntry(id, values);
      setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
      setShowForm(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data) {
          setError(JSON.stringify(e.response.data));
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <Typography variant="h4">
        {patient.name} {genderIcon()}
      </Typography>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>

      {showForm && (
        <AddEntryForm onSubmit={submitNewEntry} error={error} diagnoses={diagnoses} />
      )}
      <Button
        variant="contained"
        style={{ marginTop: "1em" }}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add New Entry"}
      </Button>

      <Typography variant="h6" sx={{ marginTop: "1em" }}>
        entries
      </Typography>
      {patient.entries.map(entry => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </div>
  );
};

export default PatientPage;
