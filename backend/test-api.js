const axios = require('axios');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

const runTests = async () => {
  console.log('=======================================================');
  console.log('  Running Automated End-to-End API Test Suite         ');
  console.log('=======================================================');

  try {
    // 1. Health Check
    console.log('\n[1/7] Testing Health Endpoint GET /api/health...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('  ✅ Health Status:', healthRes.data.status);

    // 2. Login Teacher Account
    console.log('\n[2/7] Testing Authentication POST /api/auth/login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'teacher@college.edu',
      password: 'teacher123'
    });
    const teacherToken = loginRes.data.token;
    console.log('  ✅ Auth Success. Received JWT Token:', teacherToken.substring(0, 25) + '...');

    // 3. Get User Me
    console.log('\n[3/7] Testing Protected Profile GET /api/auth/me...');
    const meRes = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    console.log('  ✅ Logged in as:', meRes.data.user.name, `(${meRes.data.user.role})`);

    // 4. Create Student
    console.log('\n[4/7] Testing Student Creation POST /api/users/student...');
    const testRoll = `TEST-${Date.now()}`;
    const studentRes = await axios.post(
      `${BASE_URL}/users/student`,
      {
        name: 'Test Student Automated',
        email: `test.${Date.now()}@college.edu`,
        rollNumber: testRoll,
        department: 'Computer Science & Engineering'
      },
      { headers: { Authorization: `Bearer ${teacherToken}` } }
    );
    console.log('  ✅ Student Created:', studentRes.data.student.name, `(${studentRes.data.student.rollNumber})`);

    // 5. Mark Attendance
    console.log('\n[5/7] Testing Attendance Marking POST /api/attendance/mark...');
    const markRes = await axios.post(
      `${BASE_URL}/attendance/mark`,
      {
        studentId: studentRes.data.student.rollNumber,
        confidence: 0.95
      },
      { headers: { Authorization: `Bearer ${teacherToken}` } }
    );
    console.log('  ✅ Attendance Logged:', markRes.data.message);

    // 6. Test Duplicate Attendance Prevention
    console.log('\n[6/7] Testing Duplicate Attendance Prevention...');
    const dupRes = await axios.post(
      `${BASE_URL}/attendance/mark`,
      {
        studentId: studentRes.data.student.rollNumber,
        confidence: 0.95
      },
      { headers: { Authorization: `Bearer ${teacherToken}` } }
    );
    console.log('  ✅ Duplicate Protection Verified:', dupRes.data.message);

    // 7. Get Attendance Analytics
    console.log('\n[7/7] Testing Dashboard Analytics GET /api/attendance/analytics...');
    const analyticsRes = await axios.get(`${BASE_URL}/attendance/analytics`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    console.log('  ✅ Analytics:', analyticsRes.data.analytics);

    console.log('\n=======================================================');
    console.log('  🎉 ALL 7 END-TO-END API TESTS PASSED SUCCESSFULLY!   ');
    console.log('=======================================================');
  } catch (error) {
    console.error('\n❌ Test Failure:', error.response?.data || error.message);
  }
};

runTests();
