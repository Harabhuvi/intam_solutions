require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { profileAllQueries } = require('../utils/queryProfiler');

const run = async () => {
  await connectDB();
  const profiles = await profileAllQueries();
  console.table(
    profiles.map((p) => ({
      Query: p.label,
      'Time (ms)': p.executionTimeMillis,
      KeysExamined: p.totalKeysExamined,
      DocsExamined: p.totalDocsExamined,
      Returned: p.nReturned,
      Stages: p.stages.join(' -> '),
      Indexes: p.indexesUsed.join(', ') || 'NONE',
      COLLSCAN: p.isCollectionScan ? 'YES' : 'NO',
    }))
  );
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Profiling failed:', err.message);
  process.exit(1);
});
