const Department = require('../models/Department');
const Task = require('../models/Task');

// Create new department
exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if already exists
    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const department = new Department({ name, description });
    await department.save();

    res.status(201).json({ success: true, data: department });
  } catch (err) {
    console.error('Create department error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json({ success: true, data: departments });
  } catch (err) {
    console.error('Get departments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('leads', 'name email role');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ success: true, data: department });
  } catch (err) {
    console.error('Get department error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update department by ID
exports.updateDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ success: true, data: department });
  } catch (err) {
    console.error('Update department error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete department by ID
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ success: true, message: 'Department deleted' });
  } catch (err) {
    console.error('Delete department error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignLeads = async (req, res) => {
  try {
    const { departmentId, leads } = req.body; // leads = array of user IDs

    const department = await Department.findById(departmentId);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    // Optional: Validate all leads exist as users here before assignment

    // Update leads array
    department.leads = leads;
    await department.save();

    // Populate leads for response
    await department.populate('leads', 'name email role');

    res.json({ success: true, data: department });
  } catch (err) {
    console.error('Assign leads error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssignLeadsPage = async (req, res) => {
  try {
    // Fetch departments and their leads or whatever data you need
    // Example:
    const departments = await Department.find().populate('lead'); // or your schema
    res.json({ success: true, data: departments });
  } catch (err) {
    console.error('Get assign leads error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHierarchy = async (req, res) => {
  try {
    // Fetch all departments with their parent info if any
    const departments = await Department.find()
      .populate('parentDepartment', 'name') // adjust if you have parentDepartment
      .lean();

    // If you want to build a tree structure in-memory
    const map = {};
    const roots = [];

    departments.forEach(dept => {
      dept.children = [];
      map[dept._id] = dept;
    });

    departments.forEach(dept => {
      if (dept.parentDepartment) {
        map[dept.parentDepartment._id].children.push(dept);
      } else {
        roots.push(dept);
      }
    });

    // roots now contains the top-level departments with nested children

    res.json({ success: true, data: roots });
  } catch (err) {
    console.error('Get hierarchy error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const buildTree = (departments, parentId = null) => {
  const tree = [];
  departments.forEach(dept => {
    if ((dept.parent && dept.parent.toString()) === (parentId ? parentId.toString() : null)) {
      const children = buildTree(departments, dept._id);
      tree.push({
        _id: dept._id,
        name: dept.name,
        description: dept.description,
        children,
      });
    }
  });
  return tree;
};

exports.getDepartmentHierarchy = async (req, res) => {
  try {
    const allDepts = await Department.find().lean();

    const tree = buildTree(allDepts);

    res.json({ success: true, data: tree });
  } catch (err) {
    console.error('Get department hierarchy error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDepartmentPerformance = async (req, res) => {
  try {
    // Aggregate tasks grouped by department and status
    const performance = await Task.aggregate([
      {
        $group: {
          _id: { department: "$department", status: "$status" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id.department',
          foreignField: '_id',
          as: 'department'
        }
      },
      { $unwind: '$department' },
      {
        $group: {
          _id: '$department._id',
          name: { $first: '$department.name' },
          taskCounts: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          }
        }
      }
    ]);

    res.json({ success: true, data: performance });
  } catch (err) {
    console.error('Get department performance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({}, 'name location');
    res.status(200).json({ success: true, data: departments });
  } catch (err) {
    console.error('Department fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};