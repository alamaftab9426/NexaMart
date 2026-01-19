import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};


const STATUS_THEME = {
  pending: { color: "#f59e0b", label: "PENDING" },
  confirmed: { color: "#16a34a", label: "CONFIRMED" },
  shipped: { color: "#2563eb", label: "SHIPPED" },
  delivered: { color: "#15803d", label: "DELIVERED" },
  cancelled: { color: "#dc2626", label: "CANCELLED" },
};


const generateEmailTemplate = (name, orderId, status, items = []) => {
  const theme = STATUS_THEME[status] || STATUS_THEME.pending;
  const BASE_URL = process.env.BACKEND_URL; 

  let grandTotal = 0;

  const rows = items
    .map((item) => {
      const finalPrice = item.discount
        ? item.price - (item.price * item.discount) / 100
        : item.price;

      const total = finalPrice * item.quantity;
      grandTotal += total;

      return `
      <tr>
        <!-- IMAGE -->
        <td style="border:1px solid #e5e7eb;padding:10px;text-align:center;">
          <img 
            src="${BASE_URL}${item.image}" 
            alt="${item.title}"
            width="70"
            style="border-radius:6px;display:block;margin:auto;"
          />
        </td>

        <!-- PRODUCT NAME -->
        <td style="border:1px solid #e5e7eb;padding:10px;">
          <b>${item.title}</b>
        </td>

        <!-- COLOR -->
        <td style="border:1px solid #e5e7eb;padding:10px;">
          ${item.variant?.color || "-"}
        </td>

        <!-- SIZE -->
        <td style="border:1px solid #e5e7eb;padding:10px;">
          ${item.variant?.size || "-"}
        </td>

        <!-- PRICE -->
        <td style="border:1px solid #e5e7eb;padding:10px;">
         
          <b>₹${item.price}</b>
        </td>

        <!-- QTY -->
        <td style="border:1px solid #e5e7eb;padding:10px;text-align:center;">
          ${item.quantity}
        </td>

        <!-- TOTAL -->
        <td style="border:1px solid #e5e7eb;padding:10px;font-weight:bold;">
          ₹${total}
        </td>
      </tr>
      `;
    })
    .join("");

  return `
  <div style="background:#f3f4f6;padding:30px;font-family:Arial,sans-serif;">
    <div style="max-width:900px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden;">

      <!-- HEADER -->
      <div style="background:${theme.color};padding:20px;text-align:center;color:white;">
        <h2 style="margin:0;">Evalue Store</h2>
        <p style="margin:5px 0 0;">Order Status Update</p>
      </div>

      <!-- BODY -->
      <div style="padding:20px;">
        <p style="font-size:16px;">Hello <b>${name}</b>,</p>
        <p>
          Your order <b>#${orderId}</b> is now
          <span style="color:${theme.color};font-weight:bold;">
            ${theme.label}
          </span>
        </p>

        <!-- PRODUCT TABLE -->
        <table width="100%" cellspacing="0" cellpadding="0"
          style="border-collapse:collapse;margin-top:20px;font-size:14px;">

          <thead>
            <tr style="background:#f9fafb;">
              <th style="border:1px solid #e5e7eb;padding:10px;">Image</th>
              <th style="border:1px solid #e5e7eb;padding:10px;">Product Name</th>
              <th style="border:1px solid #e5e7eb;padding:10px;">Color</th>
              <th style="border:1px solid #e5e7eb;padding:10px;">Size</th>
              <th style="border:1px solid #e5e7eb;padding:10px;">Price</th>
              <th style="border:1px solid #e5e7eb;padding:10px;">Qty</th>
              <th style="border:1px solid #e5e7eb;padding:10px;">Total</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>

          <!-- GRAND TOTAL -->
          <tfoot>
            <tr>
              <td colspan="6"
                style="border:1px solid #e5e7eb;padding:14px;
                       text-align:right;font-weight:bold;">
                Grand Total
              </td>
              <td
                style="border:1px solid #e5e7eb;padding:14px;
                       font-weight:bold;">
                ₹${grandTotal}
              </td>
            </tr>
          </tfoot>

        </table>

        <div style="text-align:center;margin:30px 0;">
          <a href="#"
            style="background:${theme.color};color:white;
                   padding:12px 26px;border-radius:6px;
                   text-decoration:none;font-weight:bold;">
            View Order Details
          </a>
        </div>

        <p style="font-size:14px;color:#555;">
          Thank you for shopping with <b>Evalue Store</b> ❤️
        </p>
      </div>

      <!-- FOOTER -->
      <div style="background:#f9fafb;padding:15px;
                  text-align:center;font-size:12px;color:#777;">
        © ${new Date().getFullYear()} Evalue Store. All rights reserved.
      </div>

    </div>
  </div>
  `;
};


export const sendOrderStatusMail = async (
  to,
  name,
  orderId,
  status,
  items
) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Evalue Store" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your Order #${orderId} is ${status.toUpperCase()}`,
    html: generateEmailTemplate(name, orderId, status, items),
  });
};
