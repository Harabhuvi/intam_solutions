const Product = require('../models/Product');
const Category = require('../models/Category');
const ContactQuery = require('../models/ContactQuery');
const Admin = require('../models/Admin');

const collectPlanDetails = (stageNode, stages = [], indexesUsed = new Set()) => {
  if (!stageNode || typeof stageNode !== 'object') return { stages, indexesUsed };
  if (stageNode.stage) stages.push(stageNode.stage);
  if (stageNode.indexName) indexesUsed.add(stageNode.indexName);
  if (stageNode.inputStage) collectPlanDetails(stageNode.inputStage, stages, indexesUsed);
  if (Array.isArray(stageNode.inputStages)) {
    stageNode.inputStages.forEach((child) => collectPlanDetails(child, stages, indexesUsed));
  }
  if (stageNode.queryPlan) collectPlanDetails(stageNode.queryPlan, stages, indexesUsed);
  return { stages, indexesUsed };
};

const explainQuery = async (mongooseQuery, label) => {
  const result = await mongooseQuery.explain('executionStats');
  const stats = result.executionStats || {};
  const winningPlan = result.queryPlanner?.winningPlan || {};
  const { stages, indexesUsed } = collectPlanDetails(winningPlan);

  return {
    label,
    executionTimeMillis: stats.executionTimeMillis ?? 0,
    totalKeysExamined: stats.totalKeysExamined ?? 0,
    totalDocsExamined: stats.totalDocsExamined ?? 0,
    nReturned: stats.nReturned ?? 0,
    stages,
    indexesUsed: [...indexesUsed],
    isCollectionScan: stages.includes('COLLSCAN'),
  };
};

const profileAllQueries = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const sampleProduct = await Product.findOne().sort({ createdAt: -1, _id: -1 }).lean();
  const sampleCategory = sampleProduct?.category || 'cctv';
  const sampleAdmin = await Admin.findOne().select('email').lean();

  const checks = [
    explainQuery(
      Product.find().sort({ createdAt: -1, _id: -1 }).limit(20),
      'products.list.cursor'
    ),
    explainQuery(
      Product.find({ category: sampleCategory }).sort({ createdAt: -1, _id: -1 }).limit(20),
      'products.byCategory.cursor'
    ),
    explainQuery(
      Product.find({ $text: { $search: 'camera' } }).limit(20),
      'products.search.textIndex'
    ),
    explainQuery(
      Category.find({ slug: sampleCategory }),
      'categories.bySlug'
    ),
    explainQuery(
      ContactQuery.find({ status: 'pending' }).sort({ createdAt: -1, _id: -1 }).limit(20),
      'enquiries.byStatus.cursor'
    ),
    explainQuery(
      ContactQuery.find({ createdAt: { $gte: startOfDay } }),
      'enquiries.todayCount'
    ),
    explainQuery(
      ContactQuery.find({ $text: { $search: 'security' } }).sort({ createdAt: -1, _id: -1 }).limit(20),
      'enquiries.search.textIndex'
    ),
  ];

  if (sampleAdmin?.email) {
    checks.push(
      explainQuery(
        Admin.findOne({ email: sampleAdmin.email, isActive: true }),
        'admin.login.lookup'
      )
    );
  }

  return Promise.all(checks);
};

module.exports = {
  explainQuery,
  profileAllQueries,
};
