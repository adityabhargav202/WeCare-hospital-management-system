import Department from '../models/Department.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a department (Admin only)
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = async (req, res) => {
  try {
    const { name, description, image, iconName, detailedDescription, services } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    const depExists = await Department.findOne({ name });
    if (depExists) {
      return res.status(400).json({ success: false, message: 'Department with this name already exists' });
    }

    const id = name.toLowerCase().replace(/\s+/g, '-');

    const department = await Department.create({
      id,
      name,
      description,
      image,
      iconName: iconName || 'Activity',
      detailedDescription: detailedDescription || description,
      services: services || [],
      bannerImage: image
    });

    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update a department (Admin only)
// @route   PUT /api/departments/:id
// @access  Private/Admin
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { id: req.params.id }
      ].filter(Boolean)
    });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const fields = ['name', 'description', 'image', 'iconName', 'detailedDescription', 'services'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        department[field] = req.body[field];
      }
    });

    if (req.body.name) {
      department.id = req.body.name.toLowerCase().replace(/\s+/g, '-');
    }

    const updated = await department.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a department (Admin only)
// @route   DELETE /api/departments/:id
// @access  Private/Admin
export const deleteDepartment = async (req, res) => {
  try {
    const result = await Department.deleteOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { id: req.params.id }
      ].filter(Boolean)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Seed departments function
export const seedDefaultDepartments = async () => {
  try {
    const count = await Department.countDocuments();
    if (count === 0) {
      const initialDepartments = [
        {
          id: 'cardiology',
          name: 'Cardiology',
          iconName: 'HeartPulse',
          description: 'Expert care for your heart and cardiovascular system, offering advanced diagnostics and clinical management.',
          detailedDescription: 'WeCare Cardiology delivers premier cardiac care using state-of-the-art diagnostics and patient-centered clinical management. From preventive heart health screening to advanced coronary interventions and rehabilitation, our cardiovascular team is dedicated to protecting and restoring your heart health.',
          services: [
            'Electrocardiogram (ECG & EKG)',
            'Echocardiography & Stress Testing',
            'Coronary Angiography & Angioplasty',
            'Heart Failure & Valve Management',
            'Pacemaker & ICD Implantation Services',
            'Hypertension & Cholesterol Clinics'
          ],
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
          bannerImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: 'neurology',
          name: 'Neurology',
          iconName: 'Brain',
          description: 'Specialized diagnosis and treatment of complex neurological disorders affecting the brain, spine, and nerves.',
          detailedDescription: 'The Neurology Department at WeCare specializes in diagnosing, treating, and managing disorders of the nervous system. Our highly-trained neurologists employ cutting-edge neuroimaging and therapeutic pathways to address acute and chronic conditions, helping patients achieve optimal neurological function and quality of life.',
          services: [
            'Comprehensive Stroke Management',
            'Epilepsy & Seizure Care',
            'Alzheimer’s & Dementia Diagnostics',
            'Parkinson’s & Movement Disorder Therapy',
            'Migraine & Chronic Headache Management',
            'Electromyography (EMG) & EEG Testing'
          ],
          image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200',
          bannerImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: 'orthopedics',
          name: 'Orthopedics',
          iconName: 'Bone',
          description: 'Advanced care for joint, bone, and muscle injuries to help restore full movement and active lifestyles.',
          detailedDescription: 'WeCare Orthopedics provides comprehensive orthopedic services, from pediatric bone care to advanced adult joint replacements and sports medicine. Our team utilizes minimally invasive techniques and coordinates closely with dedicated physical therapists to help you regain full mobility, reduce pain, and get back to doing what you love.',
          services: [
            'Total Hip & Knee Replacements',
            'Arthroscopic Keyhole Surgery',
            'Sports Injury & Ligament Reconstruction (ACL/MCL)',
            'Spine & Back Pain Management',
            'Fracture & Complex Trauma Care',
            'Osteoarthritis Clinical Management'
          ],
          image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
          bannerImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: 'pediatrics',
          name: 'Pediatrics',
          iconName: 'Baby',
          description: 'Compassionate, friendly, and complete healthcare tailored to infants, children, and young adults.',
          detailedDescription: 'Our Pediatrics team is dedicated to fostering the health and development of children from birth through adolescence. We offer a supportive, friendly environment that alleviates the fear of clinical visits, combining exceptional expertise with empathetic guidance for parents on nutrition, growth, and preventive healthcare.',
          services: [
            'Well-Child Preventive Exams & Growth Monitoring',
            'Childhood Immunization & Vaccine Programs',
            'Pediatric Emergency & Allergy Care',
            'Developmental & Behavioral Screenings',
            'Infectious Disease Treatment',
            'Neonatal Consultation Services'
          ],
          image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200',
          bannerImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200'
        },
        {
          id: 'ophthalmology',
          name: 'Ophthalmology',
          iconName: 'Eye',
          description: 'Comprehensive vision care and advanced eye surgeries to protect and sharpen your eyesight.',
          detailedDescription: 'WeCare Ophthalmology delivers advanced eye care services ranging from routine sight testing to delicate microsurgical procedures. Armed with state-of-the-art diagnostic imaging, our ophthalmic surgeons specialize in preserving and restoring vision for patients experiencing vision loss, cataracts, glaucoma, and retina disorders.',
          services: [
            'Advanced Cataract Surgery (Phacoemulsification)',
            'Glaucoma Screening & Surgical Management',
            'Retinal Disease Treatment & Laser Therapy',
            'Diabetic Retinopathy Management',
            'Refractive Vision Correction & Eye Exams',
            'Pediatric Vision Screenings'
          ],
          image: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=1200',
          bannerImage: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=1200'
        }
      ];
      await Department.insertMany(initialDepartments);
      console.log('Seeded initial departments list to MongoDB');
    }
  } catch (error) {
    console.error('Failed to seed departments:', error.message);
  }
};
