import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Joi from 'joi';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

const db = admin.firestore();
const storage = admin.storage();

// Schema for creating a table
const createTableSchema = Joi.object({
  emriPerShfaqje: Joi.string().required(),
  kodi: Joi.string().required(),
  pershkrimi: Joi.string().allow('', null),
  pozicioni: Joi.object({
    x: Joi.number(),
    y: Joi.number(),
    zona: Joi.string()
  }).allow(null),
  eshteAktive: Joi.boolean().default(true)
});

// Schema for generating a table QR code
const generateTableQRSchema = Joi.object({
  tableId: Joi.string().required(),
  size: Joi.number().integer().min(100).max(1000).default(512)
});

/**
 * Create a new table for a venue
 * 
 * @private Requires authentication with venue manager/admin role
 */
export const createTable = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to create tables'
    );
  }

  // Check user claims for venue role
  const { venueId, role } = context.auth.token;
  
  if (!venueId || !['admin', 'manager'].includes(role)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'You do not have permission to create tables'
    );
  }

  try {
    // Validate input data
    const { error, value } = createTableSchema.validate(data);
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

    // Check if table code is unique for this venue
    const existingTablesSnapshot = await venueRef
      .collection('tables')
      .where('kodi', '==', value.kodi)
      .limit(1)
      .get();

    if (!existingTablesSnapshot.empty) {
      throw new functions.https.HttpsError(
        'already-exists',
        `A table with the code "${value.kodi}" already exists`
      );
    }

    // Create the table document
    const tableData = {
      ...value,
      krijuarNe: admin.firestore.FieldValue.serverTimestamp()
    };

    const tableRef = await venueRef.collection('tables').add(tableData);
    
    return {
      tableId: tableRef.id,
      ...tableData
    };
  } catch (error) {
    console.error('Error creating table:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Something went wrong while creating the table'
    );
  }
});

/**
 * Generate a QR code for a table
 * 
 * @private Requires authentication with venue staff role
 */
export const generateTableQR = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to generate QR codes'
    );
  }

  // Check user claims for venue staff role
  const { venueId, role } = context.auth.token;
  
  if (!venueId || !['admin', 'manager', 'staff'].includes(role)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'You do not have permission to generate QR codes'
    );
  }

  try {
    // Validate input data
    const { error, value } = generateTableQRSchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // Get venue and table information
    const venueRef = db.collection('venues').doc(venueId);
    const venueDoc = await venueRef.get();
    
    if (!venueDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Venue not found'
      );
    }

    const venue = venueDoc.data();
    if (!venue) {
      throw new functions.https.HttpsError(
        'not-found',
        'Venue data not found'
      );
    }

    const tableRef = venueRef.collection('tables').doc(value.tableId);
    const tableDoc = await tableRef.get();
    
    if (!tableDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Table not found'
      );
    }

    const table = tableDoc.data();
    if (!table) {
      throw new functions.https.HttpsError(
        'not-found',
        'Table data not found'
      );
    }

    // Generate QR code data URL
    const baseUrl = functions.config().app?.url || 'https://urdhero.app';
    const qrCodeUrl = `${baseUrl}/qr-landing?r=${venue.slug}&t=${table.kodi}`;
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
      width: value.size,
      margin: 1,
      color: {
        dark: '#1d4ed8', // Blue
        light: '#ffffff' // White
      },
      errorCorrectionLevel: 'H' // High - allows for more customization/logo
    });

    // Convert data URL to buffer
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');

    // Create a unique filename
    const filename = `${venue.slug}-table-${table.kodi}-${uuidv4()}.png`;
    const filePath = `qr-codes/${venueId}/${filename}`;

    // Upload to Firebase Storage
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    
    await file.save(qrCodeBuffer, {
      metadata: {
        contentType: 'image/png',
        metadata: {
          venueId,
          tableId: value.tableId,
          tableCode: table.kodi
        }
      }
    });

    // Set file to be publicly accessible
    await file.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    // Update the table with QR code URL
    await tableRef.update({
      qrCodeUrl: publicUrl,
      perditesuesNe: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      qrCodeUrl: publicUrl,
      downloadUrl: publicUrl,
      tableCode: table.kodi,
      tableName: table.emriPerShfaqje
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Something went wrong while generating the QR code'
    );
  }
});