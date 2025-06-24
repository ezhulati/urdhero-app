import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Joi from 'joi';

const db = admin.firestore();
const auth = admin.auth();

// Schema for venue registration
const registerVenueSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  description: Joi.string().allow('', null)
});

/**
 * Creates a new venue and its admin user
 * 
 * @public No auth required, but validation is strict
 */
export const registerVenue = functions.https.onCall(async (data, context) => {
  try {
    // Validate input data
    const { error, value } = registerVenueSchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: value.email,
      password: value.password,
      displayName: `${value.name} Admin`,
      emailVerified: false
    });

    // Generate a slug from the venue name
    const slug = value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Create venue document in Firestore
    const venueDoc = {
      emri: value.name,
      slug,
      venueType: value.type,
      email: value.email,
      telefoni: value.phone || null,
      adresa: value.address || null,
      pershkrimi: value.description || null,
      eshteAktiv: true,
      status: 'pending_approval',
      krijuarNe: admin.firestore.FieldValue.serverTimestamp(),
      perditesuesNe: admin.firestore.FieldValue.serverTimestamp()
    };

    const venueRef = await db.collection('venues').add(venueDoc);

    // Set custom claims for the user
    await auth.setCustomUserClaims(userRecord.uid, {
      venueId: venueRef.id,
      role: 'admin'
    });

    // Return the new venue ID and admin user ID
    return {
      venueId: venueRef.id,
      slug,
      adminUserId: userRecord.uid
    };
  } catch (error) {
    console.error('Error registering venue:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Check for Firebase Auth errors
    if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError(
        'already-exists',
        'An account with this email already exists'
      );
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Something went wrong while registering your venue'
    );
  }
});