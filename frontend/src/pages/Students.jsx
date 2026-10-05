import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../services/apiClient';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, UserPlus, Camera, Search, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // New Student Form state
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    course: 'B.Tech',
    year: '4th Year',
    section: 'A'
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Webcam Capture state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [faceStatus, setFaceStatus] = useState('');
  const [registeringFace, setRegisteringFace] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/users?role=STUDENT');
      if (res.data.success) {
        setStudents(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle New Student Submit
  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const res = await apiClient.post('/users/student', newStudent);
      if (res.data.success) {
        setIsAddModalOpen(false);
        setNewStudent({
          name: '',
          email: '',
          rollNumber: '',
          department: 'Computer Science & Engineering',
          course: 'B.Tech',
          year: '4th Year',
          section: 'A'
        });
        fetchStudents();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add student.');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Face Enrollment Camera Modal
  const openFaceModal = (student) => {
    setSelectedStudent(student);
    setIsFaceModalOpen(true);
    setFaceStatus('');
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Webcam access error:', err);
      setFaceStatus('Camera access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const closeFaceModal = () => {
    stopCamera();
    setIsFaceModalOpen(false);
    setSelectedStudent(null);
  };

  // Capture frame & register face vector
  const captureAndEnrollFace = async () => {
    if (!videoRef.current || !canvasRef.current || !selectedStudent) return;

    setRegisteringFace(true);
    setFaceStatus('Capturing frame & extracting facial vector...');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBase64 = canvas.toDataURL('image/jpeg', 0.9);

    try {
      const res = await apiClient.post('/face/register', {
        studentId: selectedStudent._id,
        imageBase64
      });

      if (res.data.success) {
        setFaceStatus(`✅ ${res.data.message}`);
        setTimeout(() => {
          closeFaceModal();
          fetchStudents();
        }, 1500);
      } else {
        setFaceStatus(`❌ ${res.data.message}`);
      }
    } catch (err) {
      setFaceStatus(`❌ ${err.response?.data?.message || 'Face enrollment failed. Ensure single face is clear.'}`);
    } finally {
      setRegisteringFace(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(search.toLowerCase())) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            Students Directory
          </h2>
          <p className="text-xs text-slate-400">Manage enrolled students & facial vector registration</p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add New Student
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, roll number, or email..."
          className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Student List Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Roll Number</th>
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Face Enrollment Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-xs text-slate-400">
                  Loading students...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-xs text-slate-400">
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30 text-xs">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div>{s.name}</div>
                      <div className="text-[11px] text-slate-500">{s.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{s.rollNumber || '-'}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{s.department}</td>
                  <td className="px-6 py-4">
                    {s.isFaceRegistered ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Face Registered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                        <AlertCircle className="h-3.5 w-3.5" /> Not Enrolled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openFaceModal(s)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-semibold text-blue-400 border border-blue-500/30 hover:bg-blue-600/30"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      {s.isFaceRegistered ? 'Re-enroll Face' : 'Enroll Face'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD STUDENT MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Student">
        {formError && (
          <div className="mb-4 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
            {formError}
          </div>
        )}
        <form onSubmit={handleAddStudentSubmit} className="space-y-3">
          <Input
            label="Full Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            placeholder="Anand Kushwaha"
            required
          />
          <Input
            label="Roll Number"
            value={newStudent.rollNumber}
            onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
            placeholder="2026-CS-042"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={newStudent.email}
            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
            placeholder="anand@college.edu"
            required
          />
          <Button type="submit" loading={submitting} className="w-full mt-2">
            Save Student Profile
          </Button>
        </form>
      </Modal>

      {/* FACE ENROLLMENT WEBCAM MODAL */}
      <Modal isOpen={isFaceModalOpen} onClose={closeFaceModal} title={`Enroll Face - ${selectedStudent?.name}`}>
        <div className="space-y-4 text-center">
          <div className="relative mx-auto h-64 w-full max-w-sm overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {faceStatus && (
            <p className="text-xs font-semibold text-blue-400 bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
              {faceStatus}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={closeFaceModal}>
              Cancel
            </Button>
            <Button onClick={captureAndEnrollFace} loading={registeringFace}>
              Capture & Register Vector
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Students;
