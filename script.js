// ===== ELEMENTS =====
const becomePartnerBtn = document.getElementById('becomePartnerBtn');
const paymentOverlay = document.getElementById('paymentOverlay');
const formStep = document.getElementById('formStep');
const optionsStep = document.getElementById('optionsStep');
const partnershipForm = document.getElementById('partnershipForm');
const welcomeMsg = document.getElementById('welcomeMsg');
const backBtn = document.getElementById('backBtn');
const ussdBtn = document.getElementById('ussdBtn');
const ussdOverlay = document.getElementById('ussdOverlay');
const ussdOptions = document.querySelectorAll('.ussd-option');
const copyBtn = document.querySelector('.btn-copy');
const paypalBtn = document.getElementById('paypalBtn');
const toast = document.getElementById('toast');
const thankyouScreen = document.getElementById('thankyouScreen');
const returnBtn = document.getElementById('returnBtn');
const thankyouBackBtn = document.getElementById('thankyouBackBtn');
let paymentCompleted = false;
const heroLanding = document.getElementById('heroLanding');

// ===== SMOOTH OVERLAY SHOW =====
becomePartnerBtn.addEventListener('click', () => {
  heroLanding.classList.add('hidden');
  paymentOverlay.classList.remove('hidden');
  
  setTimeout(() => {
    paymentOverlay.classList.add('show');
    formStep.classList.remove('hidden');
    optionsStep.classList.add('hidden');
  }, 10);
});

// ===== FORM SUBMISSION =====
partnershipForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  if (!fullName || !email) {
    showToast('Please fill in all required fields');
    return;
  }
  
  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address');
    return;
  }
  
  sessionStorage.setItem('partnerName', fullName);
  sessionStorage.setItem('partnerEmail', email);
  if (phone) sessionStorage.setItem('partnerPhone', phone);
  
  const firstName = fullName.split(' ')[0];
  welcomeMsg.textContent = `Welcome, ${firstName}! Choose your payment method.`;
  
  formStep.classList.add('hidden');
  formStep.classList.add('fade-out');
  
  setTimeout(() => {
    formStep.classList.add('hidden');
    formStep.classList.remove('fade-out');

    optionsStep.classList.remove('hidden');
    optionsStep.classList.add('fade-in');
    setTimeout(() => optionsStep.classList.remove('fade-in'), 500);
  }, 500);
});

// ===== BACK BUTTON =====
backBtn.addEventListener('click', () => {
  optionsStep.classList.add('fade-out');
  setTimeout(() => {
    optionsStep.classList.add('hidden');
    optionsStep.classList.remove('fade-out');
    
    formStep.classList.remove('hidden');
    formStep.classList.add('fade-in');
    setTimeout(() => formStep.classList.remove('fade-in'), 500);
  }, 500);
});

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ===== SAVE PARTNER DATA TO GOOGLE SHEETS =====
async function savePartnerData(paymentMethod) {
  const fullName = sessionStorage.getItem('partnerName');
  const email = sessionStorage.getItem('partnerEmail');
  const phone = sessionStorage.getItem('partnerPhone') || '';
  
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzrdMz_sx8too5CiMHueD8XofkhL3KL0swU19ULTVrPcxYnAHuOpDQ07bsx7b_BMo6x/exec';
  
  try {
    await fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        paymentMethod
      })
    });
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

function completePayment(paymentMethod) {
  savePartnerData(paymentMethod);
  showThankYouScreen();
}

// ===== COPY TO CLIPBOARD =====
copyBtn.addEventListener('click', () => {
  const number = copyBtn.dataset.copy;

  navigator.clipboard.writeText(number)
    .then(() => {
      showToast('MoMo number copied!');
      setTimeout(() => completePayment('Mobile Money - Manual Transfer'), 1200);
    })
    .catch(() => {
      showToast('Failed to copy. Please try again.');
    });
});

// ===== COPY BANK DETAILS =====
document.querySelectorAll('.btn-copy-inline').forEach(btn => {
  btn.addEventListener('click', () => {
    const textToCopy = btn.dataset.copy;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showToast('Bank account details copied!');
        setTimeout(() => completePayment('Bank Transfer'), 1200);
      })
      .catch(() => {
        showToast('Failed to copy. Please try again.');
      });
  });
});

// ===== USSD MODAL =====
ussdBtn.addEventListener('click', () => {
  ussdOverlay.classList.remove('hidden');
});

ussdOverlay.addEventListener('click', (e) => {
  if (e.target === ussdOverlay) {
    ussdOverlay.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ussdOverlay.classList.add('hidden');
  }
});

ussdOptions.forEach(option => {
  option.addEventListener('click', () => {
    const ussdCode = option.dataset.ussd;
    ussdOverlay.classList.add('hidden');
    
    completePayment('Mobile Money - USSD');
    
    window.location.href = `tel:${ussdCode}`;
  });
});

// ===== PAYPAL BUTTON =====
paypalBtn.addEventListener('click', (e) => {
  e.preventDefault();
  completePayment('PayPal');

  setTimeout(() => {
    window.open(paypalBtn.href, '_blank', 'noopener');
  }, 300);
});

// ===== SHOW THANK YOU SCREEN =====
function showThankYouScreen() {
  paymentOverlay.classList.remove('show');
  paymentOverlay.classList.add('hidden');
  
  thankyouScreen.classList.remove('hidden');
  thankyouScreen.classList.add('show');
}

// ===== THANK YOU BACK BUTTON =====
thankyouBackBtn.addEventListener('click', () => {
  thankyouScreen.classList.add('fade-out');
  setTimeout(() => {
    thankyouScreen.classList.add('hidden');
    thankyouScreen.classList.remove('fade-out');

    paymentOverlay.classList.remove('hidden');
    paymentOverlay.classList.add('show');

    optionsStep.classList.remove('hidden');
    formStep.classList.add('hidden');

    heroLanding.classList.add('hidden');
  }, 500);
});

// ===== RETURN TO HOME BUTTON =====
returnBtn.addEventListener('click', () => {
  thankyouScreen.classList.add('fade-out');
  setTimeout(() => {
    thankyouScreen.classList.add('hidden');
    thankyouScreen.classList.remove('fade-out');

    optionsStep.classList.add('hidden');
    formStep.classList.remove('hidden');
    partnershipForm.reset();

    heroLanding.classList.remove('hidden'); // show landing
  }, 500);
});

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }, 3000);
}

// ===== PREVENT BODY SCROLL WHEN OVERLAY IS OPEN =====
const observer = new MutationObserver(() => {
  if (paymentOverlay.classList.contains('show')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

observer.observe(paymentOverlay, {
  attributes: true,
  attributeFilter: ['class']
});

// ===== INITIALIZE =====
console.log('Kofi Karikari Ministries Payment Gateway Ready');