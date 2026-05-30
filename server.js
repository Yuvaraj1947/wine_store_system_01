const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware setups 
app.use(express.json());
app.use(express.static(__dirname));

// Read helper file operations matrix safely
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error reading JSON system logs data state matrix:", error);
    return [];
  }
}

// Write helper file matrix safely
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Critical fault executing database IO sequence serialization writing step:", error);
  }
}

// API Routes maps mapping exactly to client requirements logic
app.get('/api/brands', (req, res) => {
  res.json(readData());
});

app.post('/api/brands', (req, res) => {
  const brands = readData();
  const newBrand = {
    id: brands.length > 0 ? Math.max(...brands.map(b => b.id)) + 1 : 1,
    brand: req.body.brand || "Unnamed Brand Asset",
    ml: req.body.ml || "750ml",
    ob: parseInt(req.body.ob) || 0,
    received: parseInt(req.body.received) || 0,
    sale: parseInt(req.body.sale) || 0,
    rate: parseFloat(req.body.rate) || 0
  };
  
  brands.push(newBrand);
  writeData(brands);
  res.status(201).json(newBrand);
});

app.put('/api/brands/:id', (req, res) => {
  const brands = readData();
  const targetId = parseInt(req.params.id);
  const idx = brands.findIndex(b => b.id === targetId);
  
  if (idx !== -1) {
    brands[idx] = { 
      ...brands[idx], 
      ...req.body,
      id: targetId // Guardrails against corrupting key mutations
    };
    writeData(brands);
    return res.json(brands[idx]);
  }
  res.status(404).json({ error: 'Target tracking record catalog item index path not found.' });
});

app.delete('/api/brands/:id', (req, res) => {
  let brands = readData();
  const targetId = parseInt(req.params.id);
  const indexCheck = brands.findIndex(b => b.id === targetId);

  if (indexCheck === -1) {
    return res.status(404).json({ error: 'Target deletion element index path pointer unavailable.' });
  }

  brands = brands.filter(b => b.id !== targetId);
  writeData(brands);
  res.json({ success: true });
});

// Primary UI Dashboard Routing Endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// App Initiation Entry Loop Setup listeners
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Wine Matrix Control Server Live: http://localhost:${PORT}`);
  console.log(` Database Pipeline Bind Profile Target: ${DATA_FILE}`);
  console.log(`=======================================================`);
});

// // new Add alongside your other file paths
// const REPORTS_FILE = path.join(__dirname, 'daily_reports.json');

// // Read helper for historical reports
// function readReports() {
//   if (!fs.existsSync(REPORTS_FILE)) {
//     fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2));
//     return [];
//   }
//   return JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8'));
// }

// // Write helper for historical reports
// function writeReports(data) {
//   fs.writeFileSync(REPORTS_FILE, JSON.stringify(data, null, 2), 'utf8');
// }

// /**
//  * API Endpoint: Commit Daily Status Snapshot Report Ledger
//  */
// app.post('/api/reports/close-day', (req, res) => {
//   const reports = readReports();
//   const brands = readData(); // Pulls current active stock metrics
  
//   if (brands.length === 0) {
//     return res.status(400).json({ error: 'Cannot compile report records from an empty stock matrix.' });
//   }

//   // Calculate high-level summary metadata matrix values
//   let totalSalesValuation = 0;
//   let totalBottlesSold = 0;
  
//   const snapshotData = brands.map(b => {
//     const totalQty = (parseInt(b.ob) || 0) + (parseInt(b.received) || 0);
//     const closingBalance = totalQty - (parseInt(b.sale) || 0);
//     const salesRevenue = (parseInt(b.sale) || 0) * (parseFloat(b.rate) || 0);
    
//     totalSalesValuation += salesRevenue;
//     totalBottlesSold += (parseInt(b.sale) || 0);

//     return {
//       id: b.id,
//       brand: b.brand,
//       ml: b.ml,
//       opening_balance: b.ob,
//       received: b.received,
//       sold: b.sale,
//       closing_balance: closingBalance,
//       rate: b.rate,
//       total_revenue: salesRevenue
//     };
//   });

//   const newReport = {
//     date: new Date().toISOString().split('T')[0],
//     timestamp: new Date().toLocaleString(),
//     summary: {
//       total_sales_revenue: totalSalesValuation,
//       total_bottles_sold: totalBottlesSold,
//       unique_items_tracked: brands.length
//     },
//     snapshot: snapshotData
//   };

//   // Prevent double entries for the same date track profile if needed
//   const existingIdx = reports.findIndex(r => r.date === newReport.date);
//   if (existingIdx !== -1) {
//     reports[existingIdx] = newReport; // Overwrites if re-ran on same operational date window
//   } else {
//     reports.push(newReport);
//   }

//   writeReports(reports);
//   res.status(201).json({ success: true, report: newReport });
// });

// /**
//  * API Endpoint: Fetch historic Daily Reports index logs
//  */
// app.get('/api/reports', (req, res) => {
//   res.json(readReports());
// });

// // Dispatches network sequence snapshot tracking logic to our Node API core pipeline layer
// async function executeDayClosingReport() {
//   if (!confirm("Are you sure you want to capture current status variables as today's standard snapshot layout row? This resets nothing but saves historical track layers.")) return;
  
//   try {
//     const response = await api('POST', '/api/reports/close-day');
//     toast('Daily status framework logged and frozen successfully!', 'success');
//     await loadHistoricalSummaryLog(); // Refresh local interface panels
//   } catch (err) {
//     console.error(err);
//     toast('Failed to process closing status framework sequences.', 'danger');
//   }
// }

// // Loads historical status files context data metrics on system execution bootstrapping loops
// async function loadHistoricalSummaryLog() {
//   try {
//     const historicalLogs = await api('GET', '/api/reports');
//     if (historicalLogs && historicalLogs.length > 0) {
//       const latestReport = historicalLogs[historicalLogs.length - 1];
//       const statsBox = document.getElementById('historical-summary-box');
//       const statsContent = document.getElementById('report-quick-stats');
      
//       statsBox.style.display = 'block';
//       statsContent.innerHTML = `
//         <strong>Date:</strong> ${latestReport.date}<br>
//         <strong>Revenue:</strong> ₹${latestReport.summary.total_sales_revenue.toLocaleString('en-IN')}<br>
//         <strong>Items Dispatched:</strong> ${latestReport.summary.total_bottles_sold} btls
//       `;
//     }
//   } catch(e) {
//     console.warn("Could not load historical log summaries.", e);
//   }
// }

// // Inside your existing 'window.addEventListener("DOMContentLoaded", ...)' logic,
// // append this execution caller line at the end of your operational chain:
// loadHistoricalSummaryLog();