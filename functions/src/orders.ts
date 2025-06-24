import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as Joi from 'joi';

const db = admin.firestore();

// Schema for creating an order
const createOrderSchema = Joi.object({
  venueId: Joi.string().required(),
  tableId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      menuItemId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      specialInstructions: Joi.string().allow('', null)
    })
  ).min(1).required(),
  customerInfo: Joi.object({
    name: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    phone: Joi.string().allow('', null)
  }).allow(null),
  specialInstructions: Joi.string().allow('', null),
  paymentMethod: Joi.string().valid('kesh', 'karte', 'digital').required()
});

// Schema for updating order status
const updateOrderStatusSchema = Joi.object({
  orderId: Joi.string().required(),
  status: Joi.string().valid('pranuar', 'duke_u_pergatitur', 'gati', 'sherbyer', 'anuluar').required(),
  cancellationReason: Joi.string().when('status', {
    is: 'anuluar',
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null)
  })
});

// Schema for getting an order by number
const getOrderByNumberSchema = Joi.object({
  orderNumber: Joi.string().required()
});

/**
 * Create a new order
 * 
 * @public No auth required, validates inputs extensively
 */
export const createOrder = functions.https.onCall(async (data, context) => {
  try {
    // Validate input data
    const { error, value } = createOrderSchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // Fetch the venue to make sure it exists and is active
    const venueDoc = await db.collection('venues').doc(value.venueId).get();
    
    if (!venueDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Venue not found'
      );
    }

    const venue = venueDoc.data();
    if (venue && !venue.eshteAktiv) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'This venue is currently not accepting orders'
      );
    }

    // Fetch the table to make sure it exists
    const tableDoc = await db
      .collection('venues')
      .doc(value.venueId)
      .collection('tables')
      .doc(value.tableId)
      .get();

    if (!tableDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Table not found'
      );
    }

    const table = tableDoc.data();
    
    if (table && !table.eshteAktive) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'This table is currently not available'
      );
    }

    // Calculate the total amount by fetching each menu item's price from the database
    let totalAmount = 0;
    const orderItems = [];

    // Process each item in the order
    for (const item of value.items) {
      const menuItemDoc = await db
        .collection('venues')
        .doc(value.venueId)
        .collection('menuItems')
        .doc(item.menuItemId)
        .get();

      if (!menuItemDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          `Menu item with ID ${item.menuItemId} not found`
        );
      }

      const menuItem = menuItemDoc.data();

      if (menuItem && !menuItem.eshteIGatshem) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `Menu item "${menuItem.emri}" is currently not available`
        );
      }

      // Calculate the item's total price
      const itemTotalPrice = (menuItem?.cmimi || 0) * item.quantity;
      totalAmount += itemTotalPrice;

      // Add the item to the order with price info
      orderItems.push({
        menuItemId: item.menuItemId,
        emriArtikulli: menuItem?.emri || 'Unknown Item',
        sasia: item.quantity,
        cmimiNjesi: menuItem?.cmimi || 0,
        cmimiTotal: itemTotalPrice,
        instruksioneSpeciale: item.specialInstructions || null
      });
    }

    // Generate a unique, user-friendly order number
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const orderNumber = `UR-${random}`;

    // Create the order document
    const orderData = {
      numriPorosise: orderNumber,
      restorantiId: value.venueId, // Using the Albanian field name from the interface
      tavolinaId: value.tableId,
      emriTavolines: table?.emriPerShfaqje || `Tavolina ${tableDoc.id}`,
      klienti: value.customerInfo || null,
      artikujt: orderItems,
      instruksioneSpeciale: value.specialInstructions || null,
      shumaTotale: totalAmount,
      statusi: 'e_re', // Initial status is 'new'
      krijuarNe: admin.firestore.FieldValue.serverTimestamp(),
      metodaPageses: value.paymentMethod,
      eshtePagetuar: false,
      burimiPorosise: 'qr_code',
      versioni: 1
    };

    const orderRef = await db.collection('orders').add(orderData);
    
    // Generate tracking URL
    const baseUrl = functions.config().app?.url || 'https://urdhero.app';
    const trackingUrl = `${baseUrl}/order/${orderNumber}`;

    // Set temporary custom claim for the anonymous user if they exist
    if (context.auth) {
      await admin.auth().setCustomUserClaims(context.auth.uid, {
        orderNumber
      });
    }

    return {
      orderId: orderRef.id,
      orderNumber,
      totalAmount,
      estimatedPreparationTime: 20, // Estimated time in minutes
      trackingUrl
    };
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Something went wrong while creating your order'
    );
  }
});

/**
 * Update the status of an existing order
 * 
 * @private Requires authentication with venue staff role
 */
export const updateOrderStatus = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to update an order status'
    );
  }

  // Check user claims for venue staff role
  const { venueId, role } = context.auth.token;
  
  if (!venueId || !['admin', 'manager', 'staff'].includes(role)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'You do not have permission to update order status'
    );
  }

  try {
    // Validate input data
    const { error, value } = updateOrderStatusSchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // Get the order
    const orderRef = db.collection('orders').doc(value.orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Order not found'
      );
    }

    const order = orderDoc.data();
    
    // Check if the user has permission to update this order
    if (order && order.restorantiId !== venueId) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'You do not have permission to update orders for this venue'
      );
    }

    // Create field name based on status for timestamp
    // This translates English status names to the Albanian field names
    const statusToField: Record<string, string> = {
      'pranuar': 'pranusNe',
      'duke_u_pergatitur': 'duke_u_pergatitNe',
      'gati': 'gatiNe',
      'sherbyer': 'sherbyeNe',
      'anuluar': 'anuluarNe'
    };

    // Prepare update data
    const updateData: Record<string, any> = {
      statusi: value.status,
      perditesuesNe: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add the appropriate timestamp field
    if (statusToField[value.status]) {
      updateData[statusToField[value.status]] = admin.firestore.FieldValue.serverTimestamp();
    }

    // Add cancellation reason if status is cancelled
    if (value.status === 'anuluar' && value.cancellationReason) {
      updateData.arsyejaAnulimit = value.cancellationReason;
    }

    // Update the order
    await orderRef.update(updateData);

    return {
      success: true,
      newStatus: value.status
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Something went wrong while updating the order status'
    );
  }
});

/**
 * Get an order by its order number for tracking
 * 
 * @public No auth required
 */
export const getOrderByNumber = functions.https.onCall(async (data, context) => {
  try {
    // Validate input data
    const { error, value } = getOrderByNumberSchema.validate(data);
    if (error) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Validation error: ${error.message}`
      );
    }

    // Query for the order by orderNumber
    const ordersSnapshot = await db
      .collection('orders')
      .where('numriPorosise', '==', value.orderNumber)
      .limit(1)
      .get();

    if (ordersSnapshot.empty) {
      throw new functions.https.HttpsError(
        'not-found',
        'Order not found'
      );
    }

    const orderDoc = ordersSnapshot.docs[0];
    const order = orderDoc.data();

    // Fetch venue information
    const venueRef = db.collection('venues').doc(order.restorantiId);
    const venueDoc = await venueRef.get();
    
    if (!venueDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'Venue information not found'
      );
    }
    
    const venue = venueDoc.data();

    // Fetch table information
    const tableRef = venueRef.collection('tables').doc(order.tavolinaId);
    const tableDoc = await tableRef.get();
    
    const table = tableDoc.exists ? tableDoc.data() : { emriPerShfaqje: order.emriTavolines };

    // Format timestamps
    const formatTimestamp = (timestamp: admin.firestore.Timestamp | undefined) => {
      return timestamp ? timestamp.toDate().toISOString() : null;
    };

    // Format response
    return {
      orderId: orderDoc.id,
      orderNumber: order.numriPorosise,
      status: order.statusi,
      totalAmount: order.shumaTotale,
      items: order.artikujt,
      specialInstructions: order.instruksioneSpeciale,
      paymentMethod: order.metodaPageses,
      isPaid: order.eshtePagetuar,
      timestamps: {
        created: formatTimestamp(order.krijuarNe),
        accepted: formatTimestamp(order.pranusNe),
        preparing: formatTimestamp(order.duke_u_pergatitNe),
        ready: formatTimestamp(order.gatiNe),
        served: formatTimestamp(order.sherbyeNe),
        cancelled: formatTimestamp(order.anuluarNe)
      },
      venueInfo: {
        id: venueDoc.id,
        name: venue?.emri,
        slug: venue?.slug,
        type: venue?.venueType
      },
      tableInfo: {
        id: order.tavolinaId,
        name: table?.emriPerShfaqje || order.emriTavolines,
        description: table?.pershkrimi,
        zone: table?.pozicioni?.zona
      }
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Something went wrong while fetching the order'
    );
  }
});