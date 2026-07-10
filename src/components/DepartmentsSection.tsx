/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeartPulse, Brain, Bone, Baby, Eye, ArrowLeft, Star, ChevronRight, Stethoscope, Briefcase, Calendar, Activity, ChevronDown, CheckCircle, Award, Shield, Sparkles } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { Department, Doctor } from '../types';

interface DepartmentsSectionProps {
  onBookWithDoctor: (doctorId: string, departmentId: string) => void;
  onNavigateToDoctors: () => void;
  departments?: Department[];
  doctors?: Doctor[];
}

// Icon Mapping helper
const IconMap: { [key: string]: React.ComponentType<any> } = {
  HeartPulse: HeartPulse,
  Brain: Brain,
  Bone: Bone,
  Baby: Baby,
  Eye: Eye,
  Activity: Activity,
};

const DEPT_EXTRA_DETAILS: {
  [key: string]: {
    stats: { label: string; value: string; desc: string }[];
    technology: { name: string; desc: string }[];
    visitSteps: { title: string; desc: string }[];
    faqs: { q: string; a: string }[];
  }
} = {
  cardiology: {
    stats: [
      { label: 'Success Rate', value: '98.6%', desc: 'For coronary angioplasty' },
      { label: 'Cath Labs', value: '2 Units', desc: 'Fully equipped 24/7 cardiac labs' },
      { label: 'Annual Procedures', value: '4,500+', desc: 'High-volume clinical mastery' },
      { label: 'Emergency Triage', value: '<15 Min', desc: 'Door-to-balloon time benchmark' }
    ],
    technology: [
      { name: 'Phillips Azurion Clarity IQ', desc: 'Low-dose high-resolution coronary angiography system' },
      { name: '3D Echocardiography', desc: 'Advanced real-time spatial imaging of heart valves and chambers' },
      { name: 'Intravascular Ultrasound (IVUS)', desc: 'Precision visual assessment of arterial blockages' }
    ],
    visitSteps: [
      { title: 'Vitals & ECG Check', desc: 'Our clinical staff notes your BP, blood oxygen levels, and performs a rapid 12-lead ECG screening.' },
      { title: 'Specialist Consultation', desc: 'The senior cardiologist evaluates your clinical history, symptoms, and previous diagnostic reports.' },
      { title: 'Diagnostic Recommendations', desc: 'If necessary, immediate stress tests or high-resolution echocardiograms are scheduled in-house.' },
      { title: 'Customized Treatment Log', desc: 'A custom medication and diet guide is formulated and uploaded to your digital patient dashboard.' }
    ],
    faqs: [
      { q: 'What is the difference between a screening ECG and an Echocardiogram?', a: 'An ECG measures the electrical activity of your heart, while an Echocardiogram uses ultrasound waves to capture live images of your heart’s physical valves and pumping action.' },
      { q: 'Should I fast before coming in for my cardiac consultation?', a: 'Standard consultation does not require fasting. However, if a lipid profile, blood sugar, or stress test is planned, we advise fasting for 8-12 hours beforehand.' }
    ]
  },
  neurology: {
    stats: [
      { label: 'Stroke Recovery', value: '94.2%', desc: 'Successful stroke emergency intervention' },
      { label: 'EEG Labs', value: 'Digital', desc: 'Fully computerized neuro-physiological centers' },
      { label: 'Patients Managed', value: '12,000+', desc: 'Extensive care for chronic neural syndromes' },
      { label: 'Critical Response', value: '24/7', desc: 'Dedicated hyper-acute stroke response team' }
    ],
    technology: [
      { name: 'Siemens Magnetom 3T MRI', desc: 'High-tesla neuroimaging for unparalleled brain and spinal detail' },
      { name: 'Computerized Video EEG', desc: 'Continuous multi-hour cortical activity mapping' },
      { name: 'Spectral CT Angiography', desc: 'Rapid diagnostic imaging of cranial blood vessels' }
    ],
    visitSteps: [
      { title: 'Neurological Examination', desc: 'The specialist performs detailed reflexes, motor strength, sensory balance, and cognitive assessments.' },
      { title: 'EHR Profile Evaluation', desc: 'A thorough review of your medication history, sleep parameters, and chronic symptoms is completed.' },
      { title: 'Advanced Diagnostics Mapping', desc: 'Scheduling high-field MRI or automated nerve conduction studies if neurological indicators require validation.' },
      { title: 'Therapeutic Strategy Design', desc: 'Custom prescription pathways, rehabilitation exercises, and specialized care logs are published on your portal.' }
    ],
    faqs: [
      { q: 'When should I consult a neurologist for chronic headaches?', a: 'If headaches are severe, increasing in frequency, accompanied by double vision, dizziness, numbness, or fail to respond to standard painkillers, you should consult a neurologist promptly.' },
      { q: 'What is a nerve conduction study (NCS)?', a: 'It is a safe diagnostic test that measures how fast electrical impulses move through your nerves, helping diagnose nerve damage, carpal tunnel, or sciatica.' }
    ]
  },
  orthopedics: {
    stats: [
      { label: 'Joint Success', value: '99.1%', desc: 'Perfect recovery index for hip & knee replacements' },
      { label: 'Robotic Units', value: 'Mako', desc: 'Industry-leading robotic joint replacement assistants' },
      { label: 'Annual Surgeries', value: '3,800+', desc: 'Unmatched volume in ligament & trauma repairs' },
      { label: 'Physical Rehab', value: 'In-house', desc: 'Integrated post-op physiotherapy and recovery clinics' }
    ],
    technology: [
      { name: 'Stryker Mako SmartRobotics', desc: 'Unmatched precision in robotic hip and knee implants' },
      { name: 'High-Definition Arthroscopy', desc: 'Minimally invasive keyhole joint surgery visualizations' },
      { name: 'Dual-Energy X-Ray (DEXA)', desc: 'High-accuracy bone mineral density screening systems' }
    ],
    visitSteps: [
      { title: 'Physical Mobility Assessment', desc: 'The orthopedic expert examines your range of motion, joint stability, and local muscle pain points.' },
      { title: 'High-Resolution Radiology', desc: 'Immediate digital x-rays or CT scans are performed in our integrated radiology wing.' },
      { title: 'Surgical or Conservative Planning', desc: 'Discussion of treatment pathways, ranging from physical therapy and joint injections to advanced keyhole surgery.' },
      { title: 'Rehabilitation Co-ordination', desc: 'A tailored plan is created in collaboration with our physical therapy team to ensure your rapid recovery.' }
    ],
    faqs: [
      { q: 'How long does recovery take after a robotic knee replacement?', a: 'With our advanced robotic-assisted surgery and immediate physical therapy, most patients can walk with support on the same day and return to normal activities within 4 to 6 weeks.' },
      { q: 'What are the benefits of arthroscopic (keyhole) joint surgery?', a: 'Keyhole surgery utilizes tiny incisions, resulting in significantly less post-operative pain, minimized tissue scarring, lower infection risk, and faster healing times.' }
    ]
  },
  pediatrics: {
    stats: [
      { label: 'Child Care Rating', value: '99.8%', desc: 'Consistently rated by parents for child comfort' },
      { label: 'NICU Capacity', value: '15 Beds', desc: 'Level-3 neonatal intensive care support systems' },
      { label: 'Immunized Kids', value: '25,000+', desc: 'Comprehensive safe immunization program' },
      { label: 'Emergency Care', value: '24/7', desc: 'Dedicated pediatric emergency response rooms' }
    ],
    technology: [
      { name: 'Hypoallergenic Exam Rooms', desc: 'Specially structured, child-friendly sterile consulting chambers' },
      { name: 'Low-Dose Pediatric Imaging', desc: 'Specialized radiology protocols minimizing children’s radiation exposure' },
      { name: 'Advanced Neonatal Incubators', desc: 'Micro-climate controlled survival chambers for premature infants' }
    ],
    visitSteps: [
      { title: 'Fun-First Warmup Check', desc: 'Our pediatric nurses measure height, weight, and check vitals in an engaging, anxiety-free manner.' },
      { title: 'Expert Milestone Tracking', desc: 'The senior pediatrician checks motor skills, speech development, nutrition, and psychological milestones.' },
      { title: 'Vaccination Verification', desc: 'Your child’s immunization logs are cross-checked and updated using international pediatric guidelines.' },
      { title: 'Parent Guidance Counseling', desc: 'Receive tailored pediatric nutrition advice, sleep tips, and developmental resources on your app portal.' }
    ],
    faqs: [
      { q: 'What is your standard pediatric immunization schedule?', a: 'Our schedule strictly aligns with WHO and AAP recommendations. We offer complete tracking alerts and reminder notifications directly inside your patient portal.' },
      { q: 'What should I do if my child gets a sudden high fever at night?', a: 'We have a dedicated 24/7 pediatric emergency triage wing. You can walk in directly or request an urgent online video consult via our telehealth module.' }
    ]
  },
  ophthalmology: {
    stats: [
      { label: 'Vision Restored', value: '99.5%', desc: 'Successful cataract and correction surgery' },
      { label: 'Laser Systems', value: 'Femto', desc: 'Advanced bladeless femtosecond eye surgery lasers' },
      { label: 'Scans Performed', value: '8,000+', desc: 'High-resolution optical coherence scans' },
      { label: 'Procedure Time', value: '15 Mins', desc: 'Average surgical duration for cataract removal' }
    ],
    technology: [
      { name: 'Alcon Centurion Vision System', desc: 'The gold standard platform for highly precise cataract extraction' },
      { name: 'Femtosecond Bladeless Laser', desc: 'Ultra-precise corneal incisions for refractive laser correction' },
      { name: 'Heidelberg Spectralis OCT', desc: 'High-definition cross-sectional retina and nerve head scans' }
    ],
    visitSteps: [
      { title: 'Visual Acuity Testing', desc: 'Detailed computer-guided refraction screening and reading charts assess current vision.' },
      { title: 'Slit-Lamp Examination', desc: 'The eye surgeon evaluates internal lens clarity, corneal health, and intraocular pressures.' },
      { title: 'Pupillary Dilation Exam', desc: 'Specialized drops are applied to thoroughly view the macular health and retinal blood vessels.' },
      { title: 'Correction & Treatment Guide', desc: 'A customized laser surgery strategy, prescription lens recommendation, or eyedrop log is drafted.' }
    ],
    faqs: [
      { q: 'Is cataract surgery painful or require hospitalization?', a: 'No, modern cataract surgery is completely painless, uses local anesthetic drops, takes only about 15 minutes, and is performed as an outpatient day-care procedure.' },
      { q: 'How often should I have a comprehensive eye exam?', a: 'Healthy adults should schedule an eye exam every 2 years. Individuals over 50, diabetic patients, or those with family histories of glaucoma should receive annual scans.' }
    ]
  },
  oncology: {
    stats: [
      { label: 'Remission Rate', value: '96.8%', desc: 'Targeted therapeutics success index' },
      { label: 'Infusion Beds', value: '18 Bays', desc: 'Private, relaxing chemotherapy suites' },
      { label: 'Tumor Boards', value: 'Weekly', desc: 'Collaborative analysis by multidisciplinary specialists' },
      { label: 'Patient Support', value: '100%', desc: 'Integrated emotional, nutritional, and pain management' }
    ],
    technology: [
      { name: 'Varian TrueBeam Linear Accelerator', desc: 'Advanced image-guided radiotherapy that targets tumors with sub-millimeter precision' },
      { name: 'Fully Automated Clean Infusion Bay', desc: 'Sterile chambers with localized HEPA filters for chemotherapy safety' },
      { name: 'Next-Generation Gene Sequencers', desc: 'Identifies specific tumor mutations for tailored clinical immunotherapy' }
    ],
    visitSteps: [
      { title: 'Multidisciplinary Intake', desc: 'The oncology nurse reviews prior biopsy reports, molecular biomarkers, and medical imaging logs.' },
      { title: 'Tumor Board Review', desc: 'A team of medical, surgical, and radiation oncologists collaborate to evaluate your tumor profile.' },
      { title: 'Therapeutic Pathway Design', desc: 'A precise plan combining targeted infusions, immunotherapy, or surgery is detailed and explained.' },
      { title: 'Patient Navigator Assignment', desc: 'A dedicated navigator is assigned to coordinate your schedules, nutrition logs, and continuous home care.' }
    ],
    faqs: [
      { q: 'What is immunotherapy and how does it differ from chemotherapy?', a: 'Chemotherapy uses drugs to directly target and destroy rapidly dividing cancer cells. Immunotherapy empowers your body’s own immune system to recognize and fight the cancer cells naturally, often with fewer systemic side effects.' },
      { q: 'How is a personalized cancer treatment plan designed here?', a: 'Every oncology patient’s case is analyzed by our integrated multidisciplinary tumor board. We incorporate genomic testing, physical health biomarkers, and lifestyle factors to tailor a therapeutic path unique to you.' }
    ]
  }
};

export default function DepartmentsSection({ 
  onBookWithDoctor, 
  onNavigateToDoctors,
  departments = DEPARTMENTS,
  doctors = DOCTORS
}: DepartmentsSectionProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [openDetailFaq, setOpenDetailFaq] = useState<number | null>(null);

  const handleDeptClick = (id: string) => {
    setSelectedDeptId(id);
    setOpenDetailFaq(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedDeptId(null);
    setOpenDetailFaq(null);
  };

  // Get current department detail
  const currentDept = departments.find(d => d.id === selectedDeptId);

  // Get doctors belonging to current department
  const deptDoctors = doctors.filter(doc => doc.departmentId === selectedDeptId);

  return (
    <div id="departments-section" className="py-12 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full Departments Catalog */}
        {!selectedDeptId ? (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block mb-2">Our Divisions</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Specialized Centers of Excellence</h2>
              <p className="text-sm text-slate-500 mt-2">
                Our clinical departments are staffed with award-winning consultants and equipped with advanced technologies to offer standard clinical safety and high efficacy.
              </p>
            </div>

            <div id="departments-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept) => {
                const SpecificIcon = IconMap[dept.iconName] || HeartPulse;
                const docCount = doctors.filter(doc => doc.departmentId === dept.id).length;
                
                return (
                  <div
                    key={dept.id}
                    id={`dept-card-${dept.id}`}
                    onClick={() => handleDeptClick(dept.id)}
                    className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer flex flex-col overflow-hidden"
                  >
                    {/* Top Photo section of the Department */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={dept.bannerImage}
                        alt={dept.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Doctor Count Badge absolute-positioned on image */}
                      <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-sm border border-slate-100">
                        {docCount} Specialists
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col justify-between flex-grow min-h-[190px]">
                      <div>
                        {/* Title and Icon inside a row */}
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                            <SpecificIcon className="h-5 w-5 stroke-[2.5]" />
                          </div>
                          <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                            {dept.name}
                          </h3>
                        </div>

                        {/* Live Telemetry Pill */}
                        <div className="flex items-center space-x-1.5 mb-3 bg-slate-50/80 border border-slate-100 rounded-lg px-2.5 py-1 w-fit">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 tracking-wide uppercase font-mono">
                            Live Wait: <span className="text-blue-600 font-extrabold">{dept.id === 'cardiology' ? '12 Mins' : dept.id === 'neurology' ? '35 Mins' : dept.id === 'orthopedics' ? '22 Mins' : dept.id === 'pediatrics' ? '5 Mins' : dept.id === 'ophthalmology' ? '18 Mins' : '8 Mins'}</span>
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                          {dept.description}
                        </p>

                        {/* Quick View Details Badge */}
                        {DEPT_EXTRA_DETAILS[dept.id] && (
                          <div className="mt-4 pt-3 border-t border-slate-100/60 space-y-2">
                            {/* Key Stat Badge */}
                            <div className="flex items-center space-x-1.5">
                              <Award className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                              <span className="text-[10px] font-bold text-slate-600">
                                {DEPT_EXTRA_DETAILS[dept.id].stats[0].label}: <span className="text-blue-600">{DEPT_EXTRA_DETAILS[dept.id].stats[0].value}</span>
                              </span>
                            </div>
                            {/* Key Equipment Badge */}
                            <div className="flex items-center space-x-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                              <span className="text-[10px] text-slate-500 font-medium truncate">
                                Tech: <span className="text-slate-800 font-semibold">{DEPT_EXTRA_DETAILS[dept.id].technology[0].name}</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer CTA */}
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider pt-3 border-t border-slate-50 group-hover:text-blue-700 mt-4">
                        <span>Explore treatments</span>
                        <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Department Detailed Inspection View */
          <div id="department-detail-view" className="space-y-10 animate-in fade-in duration-300">
            {/* Header Back Button */}
            <button
              id="back-to-departments"
              onClick={handleBack}
              className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Departments</span>
            </button>

            {currentDept && (() => {
              const extraDetails = DEPT_EXTRA_DETAILS[currentDept.id];
              return (
                <div className="space-y-10">
                  {/* Stats Grid Banner */}
                  {extraDetails?.stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
                      {extraDetails.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="text-center md:text-left space-y-1 p-2 md:border-r last:border-0 border-slate-100">
                          <span className="text-2xl sm:text-3xl font-black text-blue-600 font-mono tracking-tight block">
                            {stat.value}
                          </span>
                          <span className="text-xs font-bold text-slate-800 block">
                            {stat.label}
                          </span>
                          <span className="text-[10px] text-slate-400 block leading-tight">
                            {stat.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Details & Services */}
                    <div className="lg:col-span-7 space-y-8">
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                          Department of {currentDept.name}
                        </h1>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {currentDept.detailedDescription}
                        </p>
                      </div>

                      {/* Services List Card */}
                      <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-4 border-b border-slate-50 pb-3">
                          Specialized Clinical Treatments & Services
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentDept.services.map((service, idx) => (
                            <li key={idx} className="flex items-start text-xs text-slate-600 space-x-2.5">
                              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technology Showcase Card */}
                      {extraDetails?.technology && (
                        <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-8 shadow-sm">
                          <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2 flex items-center space-x-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <span>Advanced Diagnostic Equipment & Technology</span>
                          </h3>
                          <p className="text-xs text-slate-400 mb-6">Our equipment conforms to rigorous safety ratings, enabling our specialists to deliver highly precise clinical results.</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {extraDetails.technology.map((tech, idx) => (
                              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 tracking-tight">{tech.name}</h4>
                                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{tech.desc}</p>
                                </div>
                                <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-3 w-fit border border-emerald-100 font-extrabold uppercase tracking-wide">
                                  Operational
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Visit Steps Pathway */}
                      {extraDetails?.visitSteps && (
                        <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-8 shadow-sm">
                          <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2 flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            <span>First Consultation Pathway & What to Expect</span>
                          </h3>
                          <p className="text-xs text-slate-400 mb-6">A clear step-by-step guideline of your clinical flow during your physical visit.</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {extraDetails.visitSteps.map((step, idx) => (
                              <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
                                <div className="flex items-center space-x-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                                    0{idx + 1}
                                  </span>
                                  <h4 className="text-xs font-bold text-slate-900 tracking-tight">{step.title}</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Local FAQs list */}
                      {extraDetails?.faqs && (
                        <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-8 shadow-sm">
                          <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">
                            Division FAQs
                          </h3>
                          <p className="text-xs text-slate-400 mb-6">Common questions regarding patient pre-registration guidelines, clinical scans, and preparation.</p>
                          <div className="space-y-3">
                            {extraDetails.faqs.map((faq, idx) => {
                              const isOpen = openDetailFaq === idx;
                              return (
                                <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden transition-all">
                                  <button
                                    onClick={() => setOpenDetailFaq(isOpen ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left transition-all"
                                  >
                                    <span className="text-xs font-bold text-slate-800">{faq.q}</span>
                                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                  </button>
                                  {isOpen && (
                                    <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                                      {faq.a}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Right Side Banner & Quick CTA */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="rounded-[32px] overflow-hidden border border-slate-100 shadow-md">
                        <img
                          src={currentDept.bannerImage}
                          alt={`${currentDept.name} Department Banner`}
                          referrerPolicy="no-referrer"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      
                      <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-[32px] p-6 border border-blue-100 flex flex-col justify-between">
                        <div>
                          <h4 className="text-base font-bold text-blue-800 tracking-tight mb-1">Need a Consultation?</h4>
                          <p className="text-xs text-blue-700 leading-relaxed mb-4">
                            Schedule a visit with any of our department specialists today. We offer flexible times, online pre-registration, and insurance coverage integration.
                          </p>
                        </div>
                        <button
                          id="dept-general-book-btn"
                          onClick={() => onBookWithDoctor('', currentDept.id)}
                          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10"
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Book Department Appointment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Department Doctors Listing (Crucial Goal Met: "each department has multiple doctors") */}
            <div id="department-doctors-catalog" className="border-t border-slate-200/60 pt-10">
              <div className="mb-8">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block mb-1">Our Team</span>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {currentDept?.name} Consultants & Specialists
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Consult directly with our certified, experienced department specialists. Click booking to secure your appointment immediately.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deptDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    id={`dept-doc-${doc.id}`}
                    className="bg-white rounded-[32px] border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 tracking-tight">{doc.name}</h4>
                          <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full block w-fit mt-0.5">
                            {doc.role}
                          </span>
                          <div className="flex items-center mt-1 space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-slate-700 font-mono">{doc.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 border-t border-slate-50 pt-3">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                          <span>Experience: <strong>{doc.experience}</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                          <span className="truncate">Education: <strong>{doc.education.split('-')[0]}</strong></span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic line-clamp-2 mt-2">
                          "{doc.bio}"
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center space-x-2">
                      <button
                        id={`dept-doc-book-${doc.id}`}
                        onClick={() => onBookWithDoctor(doc.id, doc.departmentId)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all text-center flex items-center justify-center space-x-1.5"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Book Visit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
