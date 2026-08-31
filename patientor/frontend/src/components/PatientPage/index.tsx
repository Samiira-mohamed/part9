import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Patient, Gender, Entry } from "../../types";
import patientService from "../../services/patients";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

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

  return (
    <div>
      <Typography variant="h4">
        {patient.name} {genderIcon()}
      </Typography>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>

      <Typography variant="h6" sx={{ marginTop: "1em" }}>
        entries
      </Typography>
      {patient.entries.map((entry: Entry) => (
        <div key={entry.id} style={{ border: "1px solid black", borderRadius: "5px", padding: "0.5em", marginTop: "0.5em" }}>
          <p>{entry.date} <i>{entry.description}</i></p>
          <ul>
            {entry.diagnosisCodes?.map(code => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
