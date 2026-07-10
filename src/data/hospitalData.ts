/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department, Doctor } from '../types';

export const DEPARTMENTS: Department[] = [
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
    bannerImage: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'oncology',
    name: 'Oncology',
    iconName: 'Activity',
    description: 'Advanced diagnosis, compassionate therapy, and comprehensive care for cancer and hematology patients.',
    detailedDescription: 'Our Oncology Department provides comprehensive cancer care, integrating cutting-edge medical oncology, targeted immunotherapy, and advanced radiation therapy. Guided by a multidisciplinary tumor board, our experts focus on personalized treatment plans designed for high clinical efficacy and compassionate support throughout your healing journey.',
    services: [
      'Chemotherapy & Targeted Infusions',
      'Cancer Immunotherapy & Hormone Therapy',
      'Radiation Oncology Planning & Consultation',
      'Early Cancer Screening & Genetic Risk Assessment',
      'Hematological Oncology & Blood Disorders Care',
      'Pain Management & Supportive Palliative Care'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1579154204601-01588f351167?auto=format&fit=crop&q=80&w=1200'
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 'dr-elizabeth-vance',
    name: 'Dr. Elizabeth Vance',
    role: 'Chief of Cardiology',
    departmentId: 'cardiology',
    departmentName: 'Cardiology',
    experience: '16 Years',
    education: 'MD, FACC - Johns Hopkins University School of Medicine',
    rating: 4.9,
    patientsServed: 8400,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Elizabeth Vance is a board-certified cardiologist specializing in preventive cardiology and non-invasive cardiac imaging. She is deeply passionate about empowering her patients with healthy lifestyle modifications alongside cutting-edge clinical therapies.',
    specialties: ['Preventive Cardiology', 'Echocardiography', 'Heart Failure Management', 'Women’s Heart Health'],
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday'],
      hours: '09:00 AM - 01:00 PM'
    }
  },
  {
    id: 'dr-robert-chen',
    name: 'Dr. Robert Chen',
    role: 'Senior Interventional Cardiologist',
    departmentId: 'cardiology',
    departmentName: 'Cardiology',
    experience: '12 Years',
    education: 'MD - Harvard Medical School',
    rating: 4.8,
    patientsServed: 5900,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Robert Chen is a leading expert in minimally invasive coronary procedures. He has performed thousands of successful angioplasties and has extensive experience treating complex coronary artery blockages and structural heart diseases.',
    specialties: ['Coronary Angioplasty', 'Transcatheter Valve Therapy', 'Cardiac Catheterization', 'Hypertension Treatment'],
    availability: {
      days: ['Wednesday', 'Thursday', 'Friday'],
      hours: '01:00 PM - 05:00 PM'
    }
  },
  {
    id: 'dr-sarah-jenkins',
    name: 'Dr. Sarah Jenkins',
    role: 'Senior Consultant Neurologist',
    departmentId: 'neurology',
    departmentName: 'Neurology',
    experience: '14 Years',
    education: 'MD, PhD in Neurobiology - Stanford University',
    rating: 4.9,
    patientsServed: 6200,
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Sarah Jenkins is renowned for her research and clinical excellence in neurology. She specializes in cognitive neurology, particularly early onset Alzheimer’s disease, epilepsy, and multi-system neurological disorders.',
    specialties: ['Cognitive Disorders', 'Epilepsy & EEG Analysis', 'Neurodegenerative Disease', 'Migraine Care'],
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: '09:00 AM - 12:30 PM'
    }
  },
  {
    id: 'dr-david-kael',
    name: 'Dr. David Kael',
    role: 'Neurologist & Stroke Specialist',
    departmentId: 'neurology',
    departmentName: 'Neurology',
    experience: '9 Years',
    education: 'MD - Columbia University College of Physicians and Surgeons',
    rating: 4.7,
    patientsServed: 3400,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. David Kael focuses on acute neurological care, specifically stroke interventions and peripheral neuropathies. He is an advocate for rapid clinical response systems in treating vascular neurological emergencies.',
    specialties: ['Stroke Management', 'Neuropathy & Neuromuscular Medicine', 'Sleep Disorders', 'Therapeutic Botox'],
    availability: {
      days: ['Tuesday', 'Thursday'],
      hours: '02:00 PM - 06:00 PM'
    }
  },
  {
    id: 'dr-marcus-thorne',
    name: 'Dr. Marcus Thorne',
    role: 'Chief Orthopedic Surgeon',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics',
    experience: '18 Years',
    education: 'MD - Perelman School of Medicine, University of Pennsylvania',
    rating: 4.9,
    patientsServed: 9500,
    image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Marcus Thorne is a nationally recognized specialist in joint preservation and robotic-assisted total hip and knee reconstructions. He believes in creating active, personalized rehabilitation goals for every surgical patient.',
    specialties: ['Robotic Joint Replacement', 'Hip & Knee Preservation', 'Complex Skeletal Trauma', 'Osteoarthritis'],
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday'],
      hours: '08:00 AM - 12:00 PM'
    }
  },
  {
    id: 'dr-emily-ross',
    name: 'Dr. Emily Ross',
    role: 'Sports Medicine Specialist',
    departmentId: 'orthopedics',
    departmentName: 'Orthopedics',
    experience: '11 Years',
    education: 'MD - University of California, San Francisco',
    rating: 4.8,
    patientsServed: 4800,
    image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Emily Ross is a specialized sports medicine surgeon who works closely with professional and recreational athletes. She specializes in minimally invasive arthroscopic repair of shoulder, knee, and ankle injuries.',
    specialties: ['Arthroscopic Shoulder Repair', 'Ligament Reconstruction (ACL/MCL)', 'Sports Injury Prevention', 'Platelet-Rich Plasma Therapy'],
    availability: {
      days: ['Thursday', 'Friday'],
      hours: '01:00 PM - 05:00 PM'
    }
  },
  {
    id: 'dr-alan-patel',
    name: 'Dr. Alan Patel',
    role: 'Senior Pediatrician',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics',
    experience: '15 Years',
    education: 'MD - Yale School of Medicine',
    rating: 4.9,
    patientsServed: 11200,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Alan Patel has spent over 15 years dedicating his practice to early childhood healthcare. Known for his cheerful exam room presence, Dr. Patel is an expert in developmental landmarks, pediatric immunization, and asthma management.',
    specialties: ['Newborn Healthcare', 'Pediatric Asthma & Allergies', 'Childhood Developmental Tracking', 'Nutrition Counseling'],
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      hours: '09:00 AM - 01:00 PM'
    }
  },
  {
    id: 'dr-jessica-sterling',
    name: 'Dr. Jessica Sterling',
    role: 'Consultant Pediatrician',
    departmentId: 'pediatrics',
    departmentName: 'Pediatrics',
    experience: '8 Years',
    education: 'MD - NYU Grossman School of Medicine',
    rating: 4.8,
    patientsServed: 4100,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Jessica Sterling specializes in pediatric emergency medicine and juvenile infectious diseases. She maintains an active community advisory role focused on promoting adolescent mental health and physical fitness.',
    specialties: ['Pediatric Emergencies', 'Infectious Diseases', 'Adolescent Healthcare', 'Immunization Counsel'],
    availability: {
      days: ['Wednesday', 'Thursday'],
      hours: '02:00 PM - 06:00 PM'
    }
  },
  {
    id: 'dr-arthur-pendelton',
    name: 'Dr. Arthur Pendelton',
    role: 'Ophthalmic Surgeon & Retina Specialist',
    departmentId: 'ophthalmology',
    departmentName: 'Ophthalmology',
    experience: '20 Years',
    education: 'MD - University of Chicago Pritzker School of Medicine',
    rating: 4.9,
    patientsServed: 12500,
    image: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Arthur Pendelton is a senior ophthalmic surgeon with expertise in complex cataract extractions and advanced retinal surgeries. He is passionate about utilising high-magnification ophthalmic lasers to preserve eyesight.',
    specialties: ['Micro-incisional Cataract Surgery', 'Vitreo-Retinal Disorders', 'Laser Therapy for Retinopathy', 'Glaucoma Surgery'],
    availability: {
      days: ['Tuesday', 'Wednesday', 'Friday'],
      hours: '08:30 AM - 12:30 PM'
    }
  },
  {
    id: 'dr-clara-mendel',
    name: 'Dr. Clara Mendel',
    role: 'Chief Oncologist',
    departmentId: 'oncology',
    departmentName: 'Oncology',
    experience: '17 Years',
    education: 'MD, PhD - Johns Hopkins University School of Medicine',
    rating: 4.9,
    patientsServed: 7200,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Clara Mendel is a world-class medical oncologist specializing in immunotherapies and breast cancer management. She leads our multidisciplinary tumor board, collaborating with global teams to formulate personalized cancer care plans.',
    specialties: ['Immunotherapy', 'Targeted Cancer Therapy', 'Breast & Lung Oncology', 'Clinical Trial Leadership'],
    availability: {
      days: ['Monday', 'Wednesday', 'Thursday'],
      hours: '09:00 AM - 01:00 PM'
    }
  }
];

export const TIME_SLOTS: string[] = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM'
];

export const TESTIMONIALS = [
  {
    quote: "My experience at WeCare Hospitals was exceptional. The cardiology staff took the time to answer every question I had, and the booking process was completely stress-free.",
    name: "Thomas Higgins",
    type: "Cardiology Patient"
  },
  {
    quote: "Dr. Thorne and the orthopedic team restored my freedom of movement. Their professional rehabilitation planning post-knee-surgery got me back on my bicycle in no time.",
    name: "Genevieve Vance",
    type: "Joint Replacement Patient"
  },
  {
    quote: "Finding a pediatrician who can make children laugh while administering vaccine shots is a miracle. Dr. Alan Patel is simply the best pediatrician in town.",
    name: "Robert Henderson",
    type: "Parent of 5-year-old clinic patient"
  }
];

export const FAQS = [
  {
    question: "How do I schedule an appointment with a specialist?",
    answer: "You can book directly using our online Appointment Booking system, where you can select your preferred department, choice of doctor, and convenient date and time slot. Alternatively, you can contact our 24/7 registration desk."
  },
  {
    question: "What items should I bring for my first clinical consultation?",
    answer: "Please bring a government-issued photo ID, your active medical insurance card, a referral letter if required by your insurance provider, and any relevant prior medical records, prescriptions, or imaging files."
  },
  {
    question: "Do you offer emergency medical services?",
    answer: "Yes, WeCare Hospitals features a fully-staffed, level-1 Emergency and Trauma Center open 24 hours a day, 365 days a year, with on-call specialists in cardiology, orthopedics, and neurology."
  },
  {
    question: "Can I manage or cancel my appointment online?",
    answer: "Absolutely! Go to the 'My Appointments' tab in the navigation menu to view your active bookings, download booking summaries, or safely cancel your appointment."
  }
];
