import express from 'express';
import type { Response } from 'express';
import patientService from '../services/patientService.ts';
import type { NonSensitivePatient, Patient } from '../types.ts';
import parseNewPatientEntry from '../utils.ts';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.post('/', (req, res: Response<Patient | { error: string }>) => {
  try {
    const newPatientEntry = parseNewPatientEntry(req.body);
    const addedPatient = patientService.addPatient(newPatientEntry);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send({ error: errorMessage });
  }
});

export default router;