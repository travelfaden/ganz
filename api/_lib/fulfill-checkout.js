const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Resend } = require('resend');
const { FROM_EMAIL, CONTACT_EMAIL } = require('./email-config');
const {
  isSupabaseConfigured,
  getOrderConsentByConsentId,
  getNextOrderNumber,
  updateOrderConsentByConsentId,
} = require('./supabase');
const {
  createPurchaseConfirmationEmail,
  createPurchaseConfirmationPlainText,
  createServicePurchaseConfirmationEmail,
  createServicePurchaseConfirmationPlainText,
  buildPurchaseConfirmationSubject,
  buildServicePurchaseConfirmationSubject,
  isReisevorschlagDesTagesOrder,
} = require('./purchase-email');
const { sendAdminNewOrderEmail } = require('./admin-form-email');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendEmail(to, subject, html, text = null) {
  if (!resend) {
    return { success: false, error: 'Resend nicht konfiguriert' };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      reply_to: CONTACT_EMAIL,
      subject,
      html,
      text: text || subject,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Po udanej płatności: numer TF-xxx w Supabase + maile do klienta i admina.
 * Idempotentne — bezpieczne do wywołania z webhooka i verify-session.
 */
async function fulfillCheckoutSession(sessionId) {
  const sessionDetails = await stripe.checkout.sessions.retrieve(String(sessionId), {
    expand: ['customer', 'customer_details'],
  });

  if (sessionDetails.payment_status !== 'paid') {
    return { ok: false, reason: 'not_paid' };
  }

  const amount = sessionDetails.metadata?.voucher_amount || sessionDetails.amount_total / 100;
  const currency = sessionDetails.metadata?.voucher_currency || sessionDetails.currency || 'eur';
  const customerEmail = sessionDetails.customer_details?.email || sessionDetails.customer_email;
  const customerName = sessionDetails.customer_details?.name || null;
  const consentId = sessionDetails.metadata?.consent_id || null;
  let reisevorschlagId = sessionDetails.metadata?.reisevorschlag_id || null;

  let voucherNumber = null;
  let productName = null;
  let storedFormData = null;
  let alreadyFulfilled = false;

  if (consentId && isSupabaseConfigured()) {
    const existing = await getOrderConsentByConsentId(consentId);
    productName = existing?.product_name || null;
    storedFormData = existing?.form_data || null;
    voucherNumber = existing?.voucher_number || null;

    if (!reisevorschlagId && existing?.reisevorschlag_id) {
      reisevorschlagId = existing.reisevorschlag_id;
    }

    if (existing?.payment_status === 'paid' && voucherNumber) {
      alreadyFulfilled = true;
    } else {
      if (!voucherNumber) {
        voucherNumber = await getNextOrderNumber();
      }

      await updateOrderConsentByConsentId(consentId, {
        stripe_session_id: sessionDetails.id,
        customer_email: customerEmail || null,
        payment_status: 'paid',
        voucher_number: voucherNumber,
      });
    }
  }

  if (alreadyFulfilled) {
    return {
      ok: true,
      alreadyFulfilled: true,
      voucherNumber,
      reisevorschlagId,
      customerEmail,
    };
  }

  const isRdT = isReisevorschlagDesTagesOrder(reisevorschlagId, productName);
  let customerEmailSent = false;
  let adminEmailSent = false;

  if (customerEmail && voucherNumber) {
    let emailSubject;
    let emailHtml;
    let emailText;

    if (isRdT) {
      emailSubject = buildPurchaseConfirmationSubject(voucherNumber, reisevorschlagId);
      emailHtml = createPurchaseConfirmationEmail(
        voucherNumber,
        amount,
        currency,
        customerEmail,
        customerName,
        reisevorschlagId
      );
      emailText = createPurchaseConfirmationPlainText(
        voucherNumber,
        customerEmail,
        customerName,
        reisevorschlagId
      );
    } else {
      emailSubject = buildServicePurchaseConfirmationSubject(voucherNumber);
      emailHtml = createServicePurchaseConfirmationEmail(
        voucherNumber,
        customerEmail,
        customerName
      );
      emailText = createServicePurchaseConfirmationPlainText(
        voucherNumber,
        customerEmail,
        customerName
      );
    }

    const emailResult = await sendEmail(customerEmail, emailSubject, emailHtml, emailText);
    customerEmailSent = emailResult.success;
  }

  if (voucherNumber) {
    const adminResult = await sendAdminNewOrderEmail({
      productName,
      voucherNumber,
      customerEmail,
      customerName,
      amount,
      currency,
      reisevorschlagId,
      isRdT,
      formData: storedFormData,
    });
    adminEmailSent = adminResult.success;
  }

  return {
    ok: true,
    voucherNumber,
    reisevorschlagId,
    customerEmail,
    customerEmailSent,
    adminEmailSent,
  };
}

module.exports = { fulfillCheckoutSession };
