import mongoose from 'mongoose';

// Initialize the global in-memory database store
global.__inMemoryDb = global.__inMemoryDb || {};
global.useInMemoryDB = false;

const generateId = () => {
  return 'mem_' + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
};

const matchQuery = (item, query) => {
  if (!query || Object.keys(query).length === 0) return true;
  
  if (query.$or && Array.isArray(query.$or)) {
    return query.$or.some(subQuery => matchQuery(item, subQuery));
  }
  
  for (const [key, val] of Object.entries(query)) {
    if (key.startsWith('$')) continue; // skip operators
    
    // Direct matching or key comparison
    const itemVal = item[key];
    
    if (val && typeof val === 'object') {
      if ('$in' in val && Array.isArray(val.$in)) {
        if (!val.$in.map(String).includes(String(itemVal))) return false;
        continue;
      }
      if ('$ne' in val) {
        if (String(itemVal) === String(val.$ne)) return false;
        continue;
      }
    }
    
    if (String(itemVal) !== String(val)) {
      return false;
    }
  }
  return true;
};

// Helper to wrap array/object in a thenable Mongoose-like Query object
const makeQuery = (data) => {
  const promise = Promise.resolve(data);
  const chain = {
    then: (onSuccess, onFailure) => promise.then(onSuccess, onFailure),
    catch: (onFailure) => promise.catch(onFailure),
    select: () => chain,
    sort: (sortCriteria) => {
      if (Array.isArray(data) && sortCriteria) {
        const sorted = [...data];
        const [field, direction] = Object.entries(sortCriteria)[0] || [];
        if (field) {
          sorted.sort((a, b) => {
            const valA = a[field];
            const valB = b[field];
            if (valA < valB) return direction === -1 ? 1 : -1;
            if (valA > valB) return direction === -1 ? -1 : 1;
            return 0;
          });
          return makeQuery(sorted);
        }
      }
      return chain;
    },
    limit: () => chain,
    skip: () => chain,
    populate: () => chain,
    exec: () => promise,
  };
  return chain;
};

const wrapDoc = (modelName, doc) => {
  if (!doc) return null;
  
  // Return an object that mirrors a mongoose document instance
  const wrapped = {
    ...doc,
    save: async function() {
      const collection = global.__inMemoryDb[modelName];
      const idx = collection.findIndex(item => String(item._id) === String(this._id));
      
      const { save, ...pureData } = this;
      
      if (idx !== -1) {
        collection[idx] = { ...collection[idx], ...pureData };
        return wrapDoc(modelName, collection[idx]);
      } else {
        collection.push(pureData);
        return wrapDoc(modelName, pureData);
      }
    },
    toObject: function() { return { ...this }; },
    toJSON: function() { return { ...this }; },
  };
  
  return wrapped;
};

const patchModel = (modelClass, name) => {
  if (modelClass._patchedForInMemory) return;
  modelClass._patchedForInMemory = true;
  
  // Ensure the internal collection array is initialized and persists in memory
  global.__inMemoryDb[name] = global.__inMemoryDb[name] || [];
  
  // Store original methods
  const origFind = modelClass.find;
  const origFindOne = modelClass.findOne;
  const origFindById = modelClass.findById;
  const origCreate = modelClass.create;
  const origCountDocuments = modelClass.countDocuments;
  const origDeleteOne = modelClass.deleteOne;
  const origDeleteMany = modelClass.deleteMany;
  const origInsertMany = modelClass.insertMany;
  const origUpdateOne = modelClass.updateOne;
  const origFindByIdAndUpdate = modelClass.findByIdAndUpdate;
  const origFindOneAndUpdate = modelClass.findOneAndUpdate;
  
  const bypass = () => {
    return global.useInMemoryDB || mongoose.connection.readyState !== 1;
  };
  
  // Override static methods
  modelClass.find = function(query) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const results = collection.filter(item => matchQuery(item, query));
      return makeQuery(results.map(doc => wrapDoc(name, doc)));
    }
    return origFind ? origFind.apply(this, arguments) : makeQuery([]);
  };
  
  modelClass.findOne = function(query) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const result = collection.find(item => matchQuery(item, query));
      return makeQuery(result ? wrapDoc(name, result) : null);
    }
    return origFindOne ? origFindOne.apply(this, arguments) : makeQuery(null);
  };
  
  modelClass.findById = function(id) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const result = collection.find(item => String(item._id) === String(id) || String(item.id) === String(id));
      return makeQuery(result ? wrapDoc(name, result) : null);
    }
    return origFindById ? origFindById.apply(this, arguments) : makeQuery(null);
  };
  
  modelClass.countDocuments = function(query) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const count = collection.filter(item => matchQuery(item, query)).length;
      return makeQuery(count);
    }
    return origCountDocuments ? origCountDocuments.apply(this, arguments) : makeQuery(0);
  };
  
  modelClass.create = function(docOrDocs) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const createOne = (data) => {
        const idHex = generateId();
        const newDoc = {
          _id: data._id || idHex,
          id: data.id || data._id || idHex,
          createdAt: new Date().toISOString(),
          ...data,
        };
        collection.push(newDoc);
        return wrapDoc(name, newDoc);
      };
      
      if (Array.isArray(docOrDocs)) {
        return Promise.resolve(docOrDocs.map(createOne));
      } else {
        return Promise.resolve(createOne(docOrDocs));
      }
    }
    return origCreate ? origCreate.apply(this, arguments) : Promise.reject(new Error("Mongoose original create missing"));
  };
  
  modelClass.insertMany = function(docs) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const created = docs.map(doc => {
        const idHex = generateId();
        const newDoc = {
          _id: doc._id || idHex,
          id: doc.id || doc._id || idHex,
          createdAt: new Date().toISOString(),
          ...doc,
        };
        collection.push(newDoc);
        return wrapDoc(name, newDoc);
      });
      return Promise.resolve(created);
    }
    return origInsertMany ? origInsertMany.apply(this, arguments) : Promise.reject(new Error("Mongoose original insertMany missing"));
  };
  
  modelClass.deleteOne = function(query) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const beforeCount = collection.length;
      global.__inMemoryDb[name] = collection.filter(item => !matchQuery(item, query));
      const deletedCount = beforeCount - global.__inMemoryDb[name].length;
      return makeQuery({ deletedCount });
    }
    return origDeleteOne ? origDeleteOne.apply(this, arguments) : makeQuery({ deletedCount: 0 });
  };
  
  modelClass.deleteMany = function(query) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const beforeCount = collection.length;
      global.__inMemoryDb[name] = collection.filter(item => !matchQuery(item, query));
      const deletedCount = beforeCount - global.__inMemoryDb[name].length;
      return makeQuery({ deletedCount });
    }
    return origDeleteMany ? origDeleteMany.apply(this, arguments) : makeQuery({ deletedCount: 0 });
  };
  
  modelClass.updateOne = function(query, update) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const item = collection.find(item => matchQuery(item, query));
      if (item) {
        const updateData = update.$set || update;
        Object.assign(item, updateData);
        return makeQuery({ nModified: 1, n: 1, ok: 1 });
      }
      return makeQuery({ nModified: 0, n: 0, ok: 1 });
    }
    return origUpdateOne ? origUpdateOne.apply(this, arguments) : makeQuery({ nModified: 0, n: 0, ok: 1 });
  };
  
  modelClass.findByIdAndUpdate = function(id, update, options) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const query = typeof id === 'object' ? id : { _id: id };
      const idx = collection.findIndex(item => matchQuery(item, query));
      if (idx !== -1) {
        const updateData = update.$set || update;
        const oldDoc = { ...collection[idx] };
        Object.assign(collection[idx], updateData);
        const newDoc = wrapDoc(name, collection[idx]);
        return makeQuery(options && options.new ? newDoc : oldDoc);
      }
      return makeQuery(null);
    }
    return origFindByIdAndUpdate ? origFindByIdAndUpdate.apply(this, arguments) : makeQuery(null);
  };
  
  modelClass.findOneAndUpdate = function(query, update, options) {
    if (bypass()) {
      const collection = global.__inMemoryDb[name] || [];
      const idx = collection.findIndex(item => matchQuery(item, query));
      if (idx !== -1) {
        const updateData = update.$set || update;
        const oldDoc = { ...collection[idx] };
        Object.assign(collection[idx], updateData);
        const newDoc = wrapDoc(name, collection[idx]);
        return makeQuery(options && options.new ? newDoc : oldDoc);
      }
      return makeQuery(null);
    }
    return origFindOneAndUpdate ? origFindOneAndUpdate.apply(this, arguments) : makeQuery(null);
  };
};

// Intercept mongoose.model creation to mock methods when global.useInMemoryDB is active
const originalModel = mongoose.model;
mongoose.model = function(name, schema) {
  const modelClass = originalModel.apply(this, arguments);
  
  // Initialize in-memory collection array
  global.__inMemoryDb[name] = global.__inMemoryDb[name] || [];
  
  patchModel(modelClass, name);
  
  return modelClass;
};

const connectDB = async () => {
  // Configure Mongoose to error out fast instead of waiting indefinitely
  mongoose.set('bufferCommands', false);

  // Patch any models that were registered before db.js was executed
  for (const modelName of mongoose.modelNames()) {
    const modelClass = mongoose.model(modelName);
    patchModel(modelClass, modelName);
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn('Warning: MONGO_URI is not set. Activating Resilient In-Memory database.');
      global.useInMemoryDB = true;
      return;
    }
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useInMemoryDB = false;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}. Switching to Resilient In-Memory database.`);
    global.useInMemoryDB = true;
  }
};

export default connectDB;
