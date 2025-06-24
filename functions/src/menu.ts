import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Joi from 'joi';

const db = admin.firestore();
const storage = admin.storage();

// Schema for creating a menu item
const createMenuItemSchema = Joi.object({
  emri: Joi.string().required(),
  pershkrimi: Joi.string().allow('', null),
  cmimi: Joi.number().integer().min(0).required(), // Price in cents
  kategoria: Joi.string().required(),
  nenkategoria: Joi.string().allow('', null),
  imazhi: Joi.string().uri().allow('', null),
  allergenat: Joi.array().items(Joi.string()).allow(null),
  eshteVegan: Joi.boolean().default(false),
  eshteVegetarian: Joi.boolean().default(false),
  eshteIGatshem: Joi.boolean().default(true),
  kohaPergatitjes: Joi.number().integer().min(0).allow(null),
  rradhaRenditjes: Joi.number().integer().min(0).default(0)
});

// Schema for updating menu item availability
const updateMenuItemAvailabilitySchema = Joi.object({
  menuItemId: Joi.string().required(),
  eshteIGatshem: Joi.boolean().required()
});

/**
 * Create a new menu item for a venue
 * 
 * @private Requires authentication with venue staff role
 */
export const createMenuItem = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to create menu items'
    );
  }

  // Check user claims for venue staff role
  const { venueId, role } = context.auth.token;
  
  if (!venueId || !['admin', 'manager', 'staff'].includes(role)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'You do not have permission to create menu items'
    );
  }

  try {
    // Validate input data
    const { error, value } = createMenuItemSchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // Check if venue exists
    const venueRef = db.collection('venues').doc(venueId);
    const venueDoc = await venueRef.get();
    
    if (!venueDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Venue not found'
      );
    }

    // Create the menu item document
    const menuItemData = {
      ...value,
      krijuarNe: admin.firestore.FieldValue.serverTimestamp(),
      perditesuesNe: admin.firestore.FieldValue.serverTimestamp()
    };

    const menuItemRef = await venueRef.collection('menuItems').add(menuItemData);
    
    return {
      menuItemId: menuItemRef.id,
      ...menuItemData
    };
  } catch (error) {
    console.error('Error creating menu item:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Something went wrong while creating the menu item'
    );
  }
});

/**
 * Update the availability of a menu item
 * 
 * @private Requires authentication with venue staff role
 */
export const updateMenuItemAvailability = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to update menu items'
    );
  }

  // Check user claims for venue staff role
  const { venueId, role } = context.auth.token;
  
  if (!venueId || !['admin', 'manager', 'staff'].includes(role)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'You do not have permission to update menu items'
    );
  }

  try {
    // Validate input data
    const { error, value } = updateMenuItemAvailabilitySchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // Get the menu item reference
    const menuItemRef = db
      .collection('venues')
      .doc(venueId)
      .collection('menuItems')
      .doc(value.menuItemId);

    const menuItemDoc = await menuItemRef.get();
    
    if (!menuItemDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Menu item not found'
      );
    }

    // Update the menu item availability
    await menuItemRef.update({
      eshteIGatshem: value.eshteIGatshem,
      perditesuesNe: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      menuItemId: value.menuItemId,
      eshteIGatshem: value.eshteIGatshem
    };
  } catch (error) {
    console.error('Error updating menu item availability:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Something went wrong while updating the menu item'
    );
  }
});