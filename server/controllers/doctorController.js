import Doctor from '../models/Doctor.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single doctor by ID (handles both mongo ObjectId and string custom ids)
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { id: req.params.id }
      ].filter(Boolean)
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a doctor (Admin only)
// @route   POST /api/doctors
// @access  Private/Admin
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      department,
      qualification,
      experience,
      image,
      availableDays,
      availableTime,
      consultationFee,
      description,
      role,
      departmentId,
      departmentName,
      education,
      bio,
      specialties
    } = req.body;

    // Create a unique id for frontend routing if not provided
    const id = req.body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const doctor = await Doctor.create({
      id,
      name,
      specialization,
      department,
      qualification,
      experience,
      image,
      availableDays,
      availableTime,
      consultationFee,
      description,
      role: role || specialization,
      departmentId: departmentId || department?.toLowerCase().replace(/\s+/g, '-'),
      departmentName: departmentName || department,
      education: education || qualification,
      bio: bio || description,
      specialties: specialties || [specialization],
      availability: {
        days: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        hours: availableTime || '09:00 AM - 05:00 PM'
      }
    });

    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update a doctor (Admin only)
// @route   PUT /api/doctors/:id
// @access  Private/Admin
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { id: req.params.id }
      ].filter(Boolean)
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Update fields
    const fieldsToUpdate = [
      'name', 'specialization', 'department', 'qualification', 'experience',
      'image', 'availableDays', 'availableTime', 'consultationFee', 'description',
      'role', 'departmentId', 'departmentName', 'education', 'bio', 'specialties'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    });

    if (req.body.availableDays) {
      doctor.availability.days = req.body.availableDays;
    }
    if (req.body.availableTime) {
      doctor.availability.hours = req.body.availableTime;
    }

    const updatedDoctor = await doctor.save();
    res.json({ success: true, data: updatedDoctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a doctor (Admin only)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
export const deleteDoctor = async (req, res) => {
  try {
    const result = await Doctor.deleteOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { id: req.params.id }
      ].filter(Boolean)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Seed doctors function
export const seedDefaultDoctors = async () => {
  try {
    const count = await Doctor.countDocuments();
    if (count === 0) {
      const initialDoctors = [
        {
          id: 'dr-elizabeth-vance',
          name: 'Dr. Elizabeth Vance',
          role: 'Chief of Cardiology',
          specialization: 'Preventive Cardiology',
          department: 'Cardiology',
          departmentId: 'cardiology',
          departmentName: 'Cardiology',
          experience: '16 Years',
          qualification: 'MD, FACC - Johns Hopkins University School of Medicine',
          education: 'MD, FACC - Johns Hopkins University School of Medicine',
          rating: 4.9,
          patientsServed: 8400,
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
          description: 'Dr. Elizabeth Vance is a board-certified cardiologist specializing in preventive cardiology and non-invasive cardiac imaging. She is deeply passionate about empowering her patients with healthy lifestyle modifications alongside cutting-edge clinical therapies.',
          bio: 'Dr. Elizabeth Vance is a board-certified cardiologist specializing in preventive cardiology and non-invasive cardiac imaging. She is deeply passionate about empowering her patients with healthy lifestyle modifications alongside cutting-edge clinical therapies.',
          specialties: ['Preventive Cardiology', 'Echocardiography', 'Heart Failure Management', 'Women’s Heart Health'],
          availableDays: ['Monday', 'Tuesday', 'Thursday'],
          availableTime: '09:00 AM - 01:00 PM',
          consultationFee: 800,
          availability: {
            days: ['Monday', 'Tuesday', 'Thursday'],
            hours: '09:00 AM - 01:00 PM'
          }
        },
        {
          id: 'dr-robert-chen',
          name: 'Dr. Robert Chen',
          role: 'Senior Interventional Cardiologist',
          specialization: 'Coronary Angioplasty',
          department: 'Cardiology',
          departmentId: 'cardiology',
          departmentName: 'Cardiology',
          experience: '12 Years',
          qualification: 'MD - Harvard Medical School',
          education: 'MD - Harvard Medical School',
          rating: 4.8,
          patientsServed: 5900,
          image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
          description: 'Dr. Robert Chen is a leading expert in minimally invasive coronary procedures. He has performed thousands of successful angioplasties and has extensive experience treating complex coronary artery blockages and structural heart diseases.',
          bio: 'Dr. Robert Chen is a leading expert in minimally invasive coronary procedures. He has performed thousands of successful angioplasties and has extensive experience treating complex coronary artery blockages and structural heart diseases.',
          specialties: ['Coronary Angioplasty', 'Transcatheter Valve Therapy', 'Cardiac Catheterization', 'Hypertension Treatment'],
          availableDays: ['Wednesday', 'Thursday', 'Friday'],
          availableTime: '01:00 PM - 05:00 PM',
          consultationFee: 700,
          availability: {
            days: ['Wednesday', 'Thursday', 'Friday'],
            hours: '01:00 PM - 05:00 PM'
          }
        },
        {
          id: 'dr-sarah-jenkins',
          name: 'Dr. Sarah Jenkins',
          role: 'Senior Consultant Neurologist',
          specialization: 'Cognitive Disorders',
          department: 'Neurology',
          departmentId: 'neurology',
          departmentName: 'Neurology',
          experience: '14 Years',
          qualification: 'MD, PhD in Neurobiology - Stanford University',
          education: 'MD, PhD in Neurobiology - Stanford University',
          rating: 4.9,
          patientsServed: 6200,
          image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
          description: 'Dr. Sarah Jenkins is renowned for her research and clinical excellence in neurology. She specializes in cognitive neurology, particularly early onset Alzheimer’s disease, epilepsy, and multi-system neurological disorders.',
          bio: 'Dr. Sarah Jenkins is renowned for her research and clinical excellence in neurology. She specializes in cognitive neurology, particularly early onset Alzheimer’s disease, epilepsy, and multi-system neurological disorders.',
          specialties: ['Cognitive Disorders', 'Epilepsy & EEG Analysis', 'Neurodegenerative Disease', 'Migraine Care'],
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          availableTime: '09:00 AM - 12:30 PM',
          consultationFee: 900,
          availability: {
            days: ['Monday', 'Wednesday', 'Friday'],
            hours: '09:00 AM - 12:30 PM'
          }
        },
        {
          id: 'dr-david-kael',
          name: 'Dr. David Kael',
          role: 'Neurologist & Stroke Specialist',
          specialization: 'Stroke Management',
          department: 'Neurology',
          departmentId: 'neurology',
          departmentName: 'Neurology',
          experience: '9 Years',
          qualification: 'MD - Columbia University College of Physicians and Surgeons',
          education: 'MD - Columbia University College of Physicians and Surgeons',
          rating: 4.7,
          patientsServed: 3400,
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
          description: 'Dr. David Kael focuses on acute neurological care, specifically stroke interventions and peripheral neuropathies. He is an advocate for rapid clinical response systems in treating vascular neurological emergencies.',
          bio: 'Dr. David Kael focuses on acute neurological care, specifically stroke interventions and peripheral neuropathies. He is an advocate for rapid clinical response systems in treating vascular neurological emergencies.',
          specialties: ['Stroke Management', 'Neuropathy & Neuromuscular Medicine', 'Sleep Disorders', 'Therapeutic Botox'],
          availableDays: ['Tuesday', 'Thursday'],
          availableTime: '02:00 PM - 06:00 PM',
          consultationFee: 650,
          availability: {
            days: ['Tuesday', 'Thursday'],
            hours: '02:00 PM - 06:00 PM'
          }
        },
        {
          id: 'dr-marcus-thorne',
          name: 'Dr. Marcus Thorne',
          role: 'Chief Orthopedic Surgeon',
          specialization: 'Robotic Joint Replacement',
          department: 'Orthopedics',
          departmentId: 'orthopedics',
          departmentName: 'Orthopedics',
          experience: '18 Years',
          qualification: 'MD - Perelman School of Medicine, University of Pennsylvania',
          education: 'MD - Perelman School of Medicine, University of Pennsylvania',
          rating: 4.9,
          patientsServed: 9500,
          image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=400',
          description: 'Dr. Marcus Thorne is a nationally recognized specialist in joint preservation and robotic-assisted total hip and knee reconstructions. He believes in creating active, personalized rehabilitation goals for every surgical patient.',
          bio: 'Dr. Marcus Thorne is a nationally recognized specialist in joint preservation and robotic-assisted total hip and knee reconstructions. He believes in creating active, personalized rehabilitation goals for every surgical patient.',
          specialties: ['Robotic Joint Replacement', 'Hip & Knee Preservation', 'Complex Skeletal Trauma', 'Osteoarthritis'],
          availableDays: ['Monday', 'Tuesday', 'Wednesday'],
          availableTime: '08:00 AM - 12:00 PM',
          consultationFee: 850,
          availability: {
            days: ['Monday', 'Tuesday', 'Wednesday'],
            hours: '08:00 AM - 12:00 PM'
          }
        },
        {
          id: 'dr-emily-ross',
          name: 'Dr. Emily Ross',
          role: 'Sports Medicine Specialist',
          specialization: 'Sports Injury Prevention',
          department: 'Orthopedics',
          departmentId: 'orthopedics',
          departmentName: 'Orthopedics',
          experience: '11 Years',
          qualification: 'MD - University of California, San Francisco',
          education: 'MD - University of California, San Francisco',
          rating: 4.8,
          patientsServed: 4800,
          image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=400',
          description: 'Dr. Emily Ross is a specialized sports medicine surgeon who works closely with professional and recreational athletes. She specializes in minimally invasive arthroscopic repair of shoulder, knee, and ankle injuries.',
          bio: 'Dr. Emily Ross is a specialized sports medicine surgeon who works closely with professional and recreational athletes. She specializes in minimally invasive arthroscopic repair of shoulder, knee, and ankle injuries.',
          specialties: ['Arthroscopic Shoulder Repair', 'Ligament Reconstruction (ACL/MCL)', 'Sports Injury Prevention', 'Platelet-Rich Plasma Therapy'],
          availableDays: ['Thursday', 'Friday'],
          availableTime: '01:00 PM - 05:00 PM',
          consultationFee: 600,
          availability: {
            days: ['Thursday', 'Friday'],
            hours: '01:00 PM - 05:00 PM'
          }
        },
        {
          id: 'dr-alan-patel',
          name: 'Dr. Alan Patel',
          role: 'Senior Pediatrician',
          specialization: 'Newborn Healthcare',
          department: 'Pediatrics',
          departmentId: 'pediatrics',
          departmentName: 'Pediatrics',
          experience: '15 Years',
          qualification: 'MD - Yale School of Medicine',
          education: 'MD - Yale School of Medicine',
          rating: 4.9,
          patientsServed: 11200,
          image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
          description: 'Dr. Alan Patel has spent over 15 years dedicating his practice to early childhood healthcare. Known for his cheerful exam room presence, Dr. Patel is an expert in developmental landmarks, pediatric immunization, and asthma management.',
          bio: 'Dr. Alan Patel has spent over 15 years dedicating his practice to early childhood healthcare. Known for his cheerful exam room presence, Dr. Patel is an expert in developmental landmarks, pediatric immunization, and asthma management.',
          specialties: ['Newborn Healthcare', 'Pediatric Asthma & Allergies', 'Childhood Developmental Tracking', 'Nutrition Counseling'],
          availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
          availableTime: '09:00 AM - 01:00 PM',
          consultationFee: 500,
          availability: {
            days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
            hours: '09:00 AM - 01:00 PM'
          }
        }
      ];
      await Doctor.insertMany(initialDoctors);
      console.log('Seeded initial doctors list to MongoDB');
    }
  } catch (error) {
    console.error('Failed to seed doctors:', error.message);
  }
};
