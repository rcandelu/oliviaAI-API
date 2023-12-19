const express = require('express');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 3012;

// Inizializzazione dell'admin SDK di Firebase con le credenziali
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Ottieni il database firestore
const db = admin.firestore();

// Endpoint per /patient-info
app.get('/patient-info/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL

    // Puoi aggiungere autenticazione e controlli di sicurezza qui
    const documentSnapshot = await db.collection('User').doc(userId).get();
    
    if (documentSnapshot.exists) {
      // Se il documento esiste, invia i dati al client
      res.json(documentSnapshot.data());
    } else {
      // Se il documento non esiste, invia un messaggio di errore
      res.status(404).send('Patient not found');
    }
  } catch (error) {
    // In caso di errore nel database, inviare una risposta di errore
    console.error('Error fetching patient information:', error);
    res.status(500).send('Error fetching patient information');
  }
});

// Endpoint per /history_7d
app.get('/history_7d/:userId', async (req, res) => {
  try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Imposta la data a 7 giorni fa
  
      const historyRef = db.collection('User').doc(userId).collection('History');
      const snapshot = await historyRef.where('date', '>=', sevenDaysAgo).orderBy('date', 'desc').get();
  
      if (snapshot.empty) {
        res.status(404).send('No history found for the last 7 days');
        return;
      }
  
      const historyData = [];
      snapshot.forEach(doc => {
        historyData.push(doc.data());
      });
  
      res.json(historyData);
    } catch (error) {
      console.error('Error retrieving history:', error);
      res.status(500).send('Error retrieving history');
    }
  });
  
  // Endpoint per /history_30d
app.get('/history_30d/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // Imposta la data a 30 giorni fa
  
      const historyRef = db.collection('User').doc(userId).collection('History');
      const snapshot = await historyRef.where('date', '>=', thirtyDaysAgo).orderBy('date', 'desc').get();
  
      if (snapshot.empty) {
        res.status(404).send('No history found for the last 30 days');
        return;
      }
  
      const historyData = [];
      snapshot.forEach(doc => {
        historyData.push(doc.data());
      });
  
      res.json(historyData);
    } catch (error) {
      console.error('Error retrieving history:', error);
      res.status(500).send('Error retrieving history');
    }
  });
  
  // Endpoint per ottenere l'ultima lettura dell'orologio
app.get('/latest-reading/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
      const historyRef = db.collection('User').doc(userId).collection('History');
      const snapshot = await historyRef.orderBy('date', 'desc').limit(1).get();
  
      if (snapshot.empty) {
        res.status(404).send('No latest reading found');
        return;
      }
  
      const latestReading = snapshot.docs[0].data();
      res.json(latestReading);
    } catch (error) {
      console.error('Error retrieving the latest reading:', error);
      res.status(500).send('Error retrieving the latest reading');
    }
  });
  
 // Endpoint per /sleep_7d
app.get('/sleep_7d/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Imposta la data a 7 giorni fa
  
      const sleepHistoryRef = db.collection('User').doc(userId).collection('SleepHistory');
      const snapshot = await sleepHistoryRef.where('dateSleepTotal', '>=', sevenDaysAgo).orderBy('dateSleepTotal', 'desc').get();
  
      if (snapshot.empty) {
        res.status(404).send('No sleep history found for the last 7 days');
        return;
      }
  
      const sleepHistoryData = [];
      snapshot.forEach(doc => {
        sleepHistoryData.push(doc.data());
      });
  
      res.json(sleepHistoryData);
    } catch (error) {
      console.error('Error retrieving sleep history:', error);
      res.status(500).send('Error retrieving sleep history');
    }
  });
  
  // Endpoint per /sleep_30d
app.get('/sleep_30d/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // Imposta la data a 30 giorni fa
  
      const sleepHistoryRef = db.collection('User').doc(userId).collection('SleepHistory');
      const snapshot = await sleepHistoryRef.where('dateSleepTotal', '>=', thirtyDaysAgo).orderBy('dateSleepTotal', 'desc').get();
  
      if (snapshot.empty) {
        res.status(404).send('No sleep history found for the last 30 days');
        return;
      }
  
      const sleepHistoryData = [];
      snapshot.forEach(doc => {
        sleepHistoryData.push(doc.data());
      });
  
      res.json(sleepHistoryData);
    } catch (error) {
      console.error('Error retrieving sleep history:', error);
      res.status(500).send('Error retrieving sleep history');
    }
  });

  // Endpoint per ottenere l'ultima lettura del sonno
app.get('/latest-sleep-reading/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
      const sleepHistoryRef = db.collection('User').doc(userId).collection('SleepHistory');
      const snapshot = await sleepHistoryRef.orderBy('dateSleepTotal', 'desc').limit(1).get();
  
      if (snapshot.empty) {
        res.status(404).send('No latest sleep reading found');
        return;
      }
  
      const latestSleepReading = snapshot.docs[0].data();
      res.json(latestSleepReading);
    } catch (error) {
      console.error('Error retrieving the latest sleep reading:', error);
      res.status(500).send('Error retrieving the latest sleep reading');
    }
  });
  
// Endpoint per /sport_7d
app.get('/sport_7d/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // Imposta la data a 7 giorni fa
  
      const sportHistoryRef = db.collection('User').doc(userId).collection('SportHistory');
      const snapshot = await sportHistoryRef.where('createAt', '>=', sevenDaysAgo).orderBy('createAt', 'desc').get();
  
      if (snapshot.empty) {
        res.status(404).send('No sport history found for the last 7 days');
        return;
      }
  
      const sportHistoryData = [];
      snapshot.forEach(doc => {
        sportHistoryData.push(doc.data());
      });
  
      res.json(sportHistoryData);
    } catch (error) {
      console.error('Error retrieving sport history:', error);
      res.status(500).send('Error retrieving sport history');
    }
  });
  
  // Endpoint per /sport_30d
app.get('/sport_30d/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // Imposta la data a 30 giorni fa
  
      const sportHistoryRef = db.collection('User').doc(userId).collection('SportHistory');
      const snapshot = await sportHistoryRef.where('createAt', '>=', thirtyDaysAgo).orderBy('createAt', 'desc').get();
  
      if (snapshot.empty) {
        res.status(404).send('No sport history found for the last 30 days');
        return;
      }
  
      const sportHistoryData = [];
      snapshot.forEach(doc => {
        sportHistoryData.push(doc.data());
      });
  
      res.json(sportHistoryData);
    } catch (error) {
      console.error('Error retrieving sport history:', error);
      res.status(500).send('Error retrieving sport history');
    }
  });

  // Endpoint per ottenere l'ultima lettura dello sport
app.get('/latest-sport-reading/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
      const sportHistoryRef = db.collection('User').doc(userId).collection('SportHistory');
      const snapshot = await sportHistoryRef.orderBy('createAt', 'desc').limit(1).get();
  
      if (snapshot.empty) {
        res.status(404).send('No latest sport reading found');
        return;
      }
  
      const latestSportReading = snapshot.docs[0].data();
      res.json(latestSportReading);
    } catch (error) {
      console.error('Error retrieving the latest sport reading:', error);
      res.status(500).send('Error retrieving the latest sport reading');
    }
  });
  
  // Endpoint per /setting
app.get('/setting/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Ottieni l'ID utente dal parametro URL
  
      const settingsRef = db.collection('User').doc(userId).collection('Bracelet').doc('setting');
      const snapshot = await settingsRef.get();
  
      if (!snapshot.exists) {
        res.status(404).send('Settings not found');
        return;
      }
  
      const settingsData = snapshot.data();
      res.json(settingsData);
    } catch (error) {
      console.error('Error retrieving settings:', error);
      res.status(500).send('Error retrieving settings');
    }
  });
  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
