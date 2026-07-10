import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Department from '../models/Department.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      departmentId,
      patientName,
      email,
      phone,
      patientAge,
      appointmentDate,
      appointmentTime,
      symptoms,
      reason,
      date,
      timeSlot
    } = req.body;

    const aptDate = appointmentDate || date;
    const aptTime = appointmentTime || timeSlot;
    const aptSymptoms = symptoms || reason || '';

    if (!doctorId || !departmentId || !patientName || !email || !phone || !aptDate || !aptTime) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    // Attempt to fetch doctor name and department name to save in appointment for convenience
    let docName = req.body.doctorName || 'General Specialist';
    let depName = req.body.departmentName || 'General Ward';

    const doctor = await Doctor.findOne({
      $or: [{ id: doctorId }, { _id: doctorId.match(/^[0-9a-fA-F]{24}$/) ? doctorId : null }].filter(Boolean)
    });
    if (doctor) {
      docName = doctor.name;
    }

    const dept = await Department.findOne({
      $or: [{ id: departmentId }, { _id: departmentId.match(/^[0-9a-fA-F]{24}$/) ? departmentId : null }].filter(Boolean)
    });
    if (dept) {
      depName = dept.name;
    }

    // Create a client-side friendly custom readable code (e.g., APT-4821)
    const codeId = 'APT-' + Math.floor(1000 + Math.random() * 9000);

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      departmentId,
      patientName,
      email,
      phone,
      appointmentDate: aptDate,
      appointmentTime: aptTime,
      symptoms: aptSymptoms,
      status: 'Pending', // Default
      patientAge: patientAge || '30',
      reason: aptSymptoms,
      departmentName: depName,
      doctorName: docName,
      date: aptDate,
      timeSlot: aptTime,
      id: codeId, // Custom readable id
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    console.error('Book Appointment Error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get logged in user's appointments
// @route   GET /api/appointments/my
// @access  Private (Patient)
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/admin/appointments
// @access  Private/Admin
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update appointment status (Admin or patient cancellation)
// @route   PUT /api/admin/appointments/:id
// @access  Private
export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    // Find appointment by mongo _id or custom id field
    const appointment = await Appointment.findOne({
      $or: [
        { _id: appointmentId },
        { id: appointmentId }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Authorization: If not admin, patient can only update status to 'Cancelled' (or 'cancelled') for their own appointment
    if (req.user.role !== 'admin' && appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to change this appointment' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide status' });
    }

    appointment.status = status;
    const updated = await appointment.save();

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
