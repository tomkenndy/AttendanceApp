// firebase.js
import { initializeApp } from 'firebase/app';
import { query,where,getFirestore,getDocs,doc,updateDoc, collection, addDoc, getDoc, arrayUnion,setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Your Firebase config object
const firebaseConfig = {
  apiKey: 'AIzaSyBBGI-7fY6i438u6WPOqABRDuj_VejFcsI',
  authDomain: 'attendanceapp-2d6a9.firebaseapp.com',
  projectId: 'attendanceapp-2d6a9',
  storageBucket: 'attendanceapp-2d6a9.appspot.com',
  messagingSenderId: '398596319257',
  appId: '1:398596319257:web:3f77c27f1b4331b9f6e288',
  measurementId: 'G-MEASUREMENT_ID', // Optional: Only if using Google Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the authentication service
const auth = getAuth(app);

// Function to create a new user with email and password
const signUpWithEmailAndPassword = async (email, password) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredentials.user;
    console.log('User registered with:', user.email);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Function to save user details in Firestore
const saveUserDetails = async (userId, firstName, lastName, email, userType, regNo = null) => {
  try {
    const db = getFirestore(app);
    const userRef = collection(db, 'users');
    await addDoc(userRef, {
      userId,
      firstName,
      lastName,
      email,
      userType,
      reg_no: regNo, // Include the reg_no field with the provided value or null
      course:regNo,
      year:regNo,
      unit_codes:regNo,
    });
    console.log('User details saved successfully');
  } catch (error) {
    console.error('Error saving user details:', error);
  }
};// Function to update student details in Firestore
const updateStudentDetails = async (userId, reg_no, course, year, unit_codes) => {
  try {
    const db = getFirestore(app);
    const userRef = collection(db, 'users');
    const userQuery = query(userRef, where('userId', '==', userId));
    const userDocs = await getDocs(userQuery);

    if (userDocs.size === 1) {
      const docId = userDocs.docs[0].id;
      const docRef = doc(db, 'users', docId);

      // Convert unit_codes array to an object with counts
      const updatedUnitCodes = unit_codes.reduce((acc, unit_code) => {
        acc[unit_code] = (acc[unit_code] || 0) + 1;
        return acc;
      }, {});

      await updateDoc(docRef, {
        reg_no,
        course,
        year,
        unit_codes: updatedUnitCodes,
      });

      alert('Student details updated successfully');
    } else {
      console.error('Error updating student details: User not found');
      // Handle the case where the user is not found
    }
  } catch (error) {
    console.error('Error updating student details:', error);
    throw error;
  }
};

// Function to update teacher details in Firestore
const updateTeacherDetails = async (userId, reg_no, unit_codes) => {
  try {
    const db = getFirestore(app);
    const userRef = collection(db, 'users');
    const userQuery = query(userRef, where('userId', '==', userId));
    const userDocs = await getDocs(userQuery);

    if (userDocs.size === 1) {
      const docId = userDocs.docs[0].id;
      const docRef = doc(db, 'users', docId);

      // Convert unit_codes array to an object with counts
      const updatedUnitCodes = unit_codes.reduce((acc, unit_code) => {
        acc[unit_code] = (acc[unit_code] || 0) + 1;
        return acc;
      }, {});

      await updateDoc(docRef, {
        reg_no,
        unit_codes: updatedUnitCodes,
      });

      console.log('Teacher details updated successfully');
    } else {
      console.error('Error updating teacher details: User not found');
      // Handle the case where the user is not found
    }
  } catch (error) {
    console.error('Error updating teacher details:', error);
    throw error;
  }
};

// Function to fetch user details from Firestore
// Modify fetchDetails to return unit_codes as an array
const fetchDetails = async (userId) => {
  try {
    const db = getFirestore(app);
    const userRef = collection(db, 'users');
    const userQuery = query(userRef, where('userId', '==', userId));
    const userDocs = await getDocs(userQuery);

    if (userDocs.size === 1) {
      const userDetails = userDocs.docs[0].data();
      // Convert unit_codes object to an array
      const unit_codes = userDetails.unit_codes ? Object.keys(userDetails.unit_codes) : [];
      return { ...userDetails, userType: userDetails.userType, unit_codes };
    } else {
      console.error('User document not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};


// Fetch units from database
const fetchUnitsFromFirestore = async () => {
  try {
    const db = getFirestore(app);
    const unitsRef = collection(db, 'units'); // Assuming your collection name is 'units'
    const unitsSnapshot = await getDocs(unitsRef);

    const unitsData = [];
    unitsSnapshot.forEach((doc) => {
      const unit = doc.data();
      unitsData.push(unit);
    });

    return unitsData;
  } catch (error) {
    console.error('Error fetching units from Firestore:', error);
    throw error;
  }
};


const createAttendanceRecord = async (unit_code) => {
  try {
    const db = getFirestore(app);
    const userRef = collection(db, 'attendance');
    
    // Get the current date without time
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Add a new document with date, unit_code, present, and start fields
    await addDoc(userRef, {
      date: currentDate,
      unit_code,
      present: [],
      start: true,
    });

    alert('Class has started');
  } catch (error) {
    console.error('Error creating attendance record:', error);
  }
};


// Function to update an attendance record
// ... (previous code)

const updateAttendanceRecord = async (unit_code, reg_no) => {
  try {
    const db = getFirestore(app);

    // Update attendance record in the 'attendance' collection
    const attendanceRef = collection(db, 'attendance');
    const attendanceQuery = query(attendanceRef, where('unit_code', '==', unit_code));
    const attendanceDocs = await getDocs(attendanceQuery);

    if (attendanceDocs.size === 1) {
      const docId = attendanceDocs.docs[0].id;
      const docRef = doc(db, 'attendance', docId);

      // Update the attendance record by adding reg_no to the present array
      await updateDoc(docRef, {
        present: arrayUnion(reg_no),
      });

      alert('Attended successfully');

      // Update unit_codes field in the 'users' collection
      const userRef = collection(db, 'users');
      const userQuery = query(userRef, where('reg_no', '==', reg_no));
      const userDocs = await getDocs(userQuery);

      if (userDocs.size === 1) {
        const userDocId = userDocs.docs[0].id;
        const userDocRef = doc(db, 'users', userDocId);

        // Update the unit_codes field by increasing the value for the specific unit_code
        const existingUnitCodes = userDocs.docs[0].data().unit_codes || {};
        const updatedUnitCodes = {
          ...existingUnitCodes,
          [unit_code]: (existingUnitCodes[unit_code] || 0) + 1,
        };

        await updateDoc(userDocRef, {
          unit_codes: updatedUnitCodes,
        });
      } else {
        console.error('Error updating unit_codes: User not found');
        // Handle the case where the user is not found
      }
    } else {
      alert('Class has not yet started');
    }
  } catch (error) {
    console.error('Error updating attendance record:', error);
  }
};

const updateUnitInFirebase = async (unit_code, updatedUnitDetails) => {
  try {
    const db = getFirestore(app);
    const unitRef = collection(db, 'units');
    
    // Query to check if a document with the specified unit_code exists
    const unitQuery = query(unitRef, where('unit_code', '==', unit_code));
    const unitDocs = await getDocs(unitQuery);

    if (unitDocs.size === 1) {
      // If the document exists, update it
      const docId = unitDocs.docs[0].id;
      const docRef = doc(unitRef, docId);

      await updateDoc(docRef, updatedUnitDetails);
      alert(`Unit ${unit_code} updated successfully`);
    } else {
      // If the document does not exist, create a new one with the provided details
      await addDoc(unitRef, { ...updatedUnitDetails, unit_code });
      console.log(`Unit ${unit_code} does not exist`);
    }
  } catch (error) {
    console.error('Error updating unit in Firestore:', error);
    throw error;
  }
};

const fetchDetails2 = async (userId) => {
  try {
    const db = getFirestore(app);
    const userRef = collection(db, 'users');
    const userQuery = query(userRef, where('userId', '==', userId));
    const userDocs = await getDocs(userQuery);

    if (userDocs.size === 1) {
      const userData = userDocs.docs[0].data();
      const unit_codes = userData.unit_codes || {};
      
      return { ...userData, userType: userData.userType, unit_codes: unit_codes };
    } else {
      console.error('User document not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};
const fetchAttendanceDetail = async (unit_code) => {
  try {
    const db = getFirestore(app);
    const attendanceRef = collection(db, 'attendance');
    const attendanceQuery = query(
      attendanceRef,
      where('unit_code', '==', unit_code)
    );
    const attendanceDocs = await getDocs(attendanceQuery);

    if (attendanceDocs.size === 1) {
      const attendanceData = attendanceDocs.docs[0].data();
      return attendanceData;
    } else {
      // console.error('Attendance details not found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching attendance details:', error);
    throw error;
  }
};



 
export {  app,
          auth, 
          signUpWithEmailAndPassword, 
          signInWithEmailAndPassword, 
          saveUserDetails,
          updateTeacherDetails,
          updateStudentDetails,
          fetchDetails,
          fetchDetails2,
          createAttendanceRecord,
          updateAttendanceRecord,
          updateUnitInFirebase,
          fetchAttendanceDetail,
          fetchUnitsFromFirestore };
