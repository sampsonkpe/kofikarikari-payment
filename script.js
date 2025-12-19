// ===== ELEMENTS =====
const becomePartnerBtn = document.getElementById('becomePartnerBtn');
const paymentOverlay = document.getElementById('paymentOverlay');
const formStep = document.getElementById('formStep');
const optionsStep = document.getElementById('optionsStep');
const partnershipForm = document.getElementById('partnershipForm');
const welcomeMsg = document.getElementById('welcomeMsg');
const backBtn = document.querySelector('.btn-back');
const ussdBtn = document.getElementById('ussdBtn');
const ussdOverlay = document.getElementById('ussdOverlay');
const ussdOptions = document.querySelectorAll('.ussd-option');
const copyBtns = document.querySelectorAll('.btn-copy');
const copyInlineBtns = document.querySelectorAll('.btn-copy-inline');
const paypalBtn = document.getElementById('paypalBtn');
const toast = document.getElementById('toast');
const thankyouScreen = document.getElementById('thankyouScreen');
const returnBtn = document.getElementById('returnBtn');
const thankyouBackBtn = document.getElementById('thankyouBackBtn');
const heroLanding = document.getElementById('heroLanding');

// ===== SHOW PAYMENT OVERLAY =====
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== SAVE PARTNER DATA =====
async function savePartnerData(paymentMethod) {
  const fullName = sessionStorage.getItem('partnerName');
  const email = sessionStorage.getItem('partnerEmail');
  const phone = sessionStorage.getItem('partnerPhone') || '';
  
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzrdMz_sx8too5CiMHueD8XofkhL3KL0swU19ULTVrPcxYnAHuOpDQ07bsx7b_BMo6x/exec';
  
  try {
    await fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phone, paymentMethod })
    });
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// ===== COMPLETE PAYMENT =====
function completePayment(paymentMethod) {
  savePartnerData(paymentMethod);
  showThankYouScreen();
}

// ===== COPY BUTTONS =====
copyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const number = btn.dataset.copy;
    navigator.clipboard.writeText(number)
      .then(() => {
        showToast('MoMo number copied!');
        setTimeout(() => completePayment('Mobile Money - Manual Transfer'), 1200);
      })
      .catch(() => showToast('Failed to copy. Please try again.'));
  });
});

copyInlineBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast('Bank account details copied!');
        setTimeout(() => completePayment('Bank Transfer'), 1200);
      })
      .catch(() => showToast('Failed to copy. Please try again.'));
  });
});

// ===== USSD MODAL =====
ussdBtn.addEventListener('click', () => ussdOverlay.classList.remove('hidden'));

ussdOverlay.addEventListener('click', e => {
  if (e.target === ussdOverlay) ussdOverlay.classList.add('hidden');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') ussdOverlay.classList.add('hidden');
});

ussdOptions.forEach(option => {
  option.addEventListener('click', e => {
    e.stopPropagation();
    const ussdCode = option.dataset.ussd;
    
    navigator.clipboard.writeText(ussdCode)
      .then(() => showToast(`USSD code copied: ${ussdCode}`))
      .catch(() => showToast('Failed to copy USSD code'));
    
    ussdOverlay.classList.add('hidden');
    
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.location.href = `tel:${ussdCode}`;
    }
    
    completePayment('Mobile Money - USSD');
  });
});

// ===== PAYPAL BUTTON =====
paypalBtn.addEventListener('click', e => {
  e.preventDefault();
  completePayment('PayPal');
  setTimeout(() => window.open(paypalBtn.href, '_blank', 'noopener'), 300);
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

    heroLanding.classList.remove('hidden');
  }, 500);
});

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 3000);
}

// ===== PREVENT BODY SCROLL WHEN OVERLAY OPEN =====
const observer = new MutationObserver(() => {
  document.body.style.overflow = paymentOverlay.classList.contains('show') ? 'hidden' : '';
});

observer.observe(paymentOverlay, { attributes: true, attributeFilter: ['class'] });

// ===== INITIALIZE =====
console.log('Kofi Karikari Ministries Payment Gateway Ready');
