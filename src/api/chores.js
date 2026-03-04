import { db } from "../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";


//function to submit chore proof (image URL aka) and update assignment status
export const submitChoreProof = async (assignmentId, imageUrl) => {
  const assignmentRef = doc(db, "assignments", assignmentId);

  try {
    await updateDoc(assignmentRef, {
      proof_image_url: imageUrl,
      status: "submitted",
      submitted_at: serverTimestamp()
    });
  } catch (error) {
    console.error("Critical submission error:", error);
  }
};

//database will be handled seperately. This file is just for the chore related functions.