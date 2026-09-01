import { Entry, Diagnosis } from "../../types";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const findDiagnosisName = (diagnoses: Diagnosis[], code: string): string => {
  const diagnosis = diagnoses.find(d => d.code === code);
  return diagnosis ? diagnosis.name : code;
};

const EntryDetails = ({ entry, diagnoses }: Props) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <div style={{ border: "1px solid black", borderRadius: "5px", padding: "0.5em", marginTop: "0.5em" }}>
          <p>{entry.date} <LocalHospitalIcon /></p>
          <p><i>{entry.description}</i></p>
          <ul>
            {entry.diagnosisCodes?.map(code => (
              <li key={code}>{code} {findDiagnosisName(diagnoses, code)}</li>
            ))}
          </ul>
          <p>discharge: {entry.discharge.date} - {entry.discharge.criteria}</p>
          <p>specialist: {entry.specialist}</p>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div style={{ border: "1px solid black", borderRadius: "5px", padding: "0.5em", marginTop: "0.5em" }}>
          <p>{entry.date} <WorkIcon /> {entry.employerName}</p>
          <p><i>{entry.description}</i></p>
          <ul>
            {entry.diagnosisCodes?.map(code => (
              <li key={code}>{code} {findDiagnosisName(diagnoses, code)}</li>
            ))}
          </ul>
          {entry.sickLeave && (
            <p>sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</p>
          )}
          <p>specialist: {entry.specialist}</p>
        </div>
      );
    case "HealthCheck":
      return (
        <div style={{ border: "1px solid black", borderRadius: "5px", padding: "0.5em", marginTop: "0.5em" }}>
          <p>{entry.date} <FavoriteIcon /></p>
          <p><i>{entry.description}</i></p>
          <p>health check rating: {entry.healthCheckRating}</p>
          <p>specialist: {entry.specialist}</p>
        </div>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
