const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const STL_PRODUCTS = {
  'prod_Tp9cFKYPRjcIN1': {
    name: 'Personal Use License',
    file: 'BAAS_SDS100_GlowKnob_Personal.zip'
  },
  'prod_Tp9dxSaBSQsnZW': {
    name: 'Support the Channel',
    file: 'BAAS_SDS100_GlowKnob_Supporter.zip'
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    for (const item of lineItems.data) {
      const productId = item.price.product;
      
      if (STL_PRODUCTS[productId]) {
        await sendDownloadEmail(
          session.customer_details.email,
          session.customer_details.name,
          STL_PRODUCTS[productId]
        );
      }
    }
  }

  res.json({ received: true });
};

async function sendDownloadEmail(email, name, product) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const downloadLink = `https://github.com/tfs2006/baas-stl-files/raw/main/${product.file}`;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `Your ${product.name} STL Download - Boy and a Scanner`,
    text: `Hi ${name || 'there'},

Thanks for supporting Boy and a Scanner! 🎉

Your ${product.name} STL file is ready to download:

📥 Download: ${downloadLink}

WHAT'S INCLUDED:
- STL file for 3D printing
- LICENSE.txt with usage terms
- README.txt with print settings

LICENSE REMINDER:
✓ Personal use only
✗ No commercial use or reselling
✗ No file redistribution
✓ Attribution required for public posts

Tag me when you print it: @boyandascanner

Happy printing!
- Boy and a Scanner (BAAS)

P.S. Check out my other scanner mods at boyandascanner.com!`
  });
}
