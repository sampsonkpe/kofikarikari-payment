// ===== ELEMENTS =====
const heroLanding = document.getElementById('heroLanding');
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
const impactSection = document.getElementById('impactSection');
const toast = document.getElementById('toast');

// ===== SMOOTH OVERLAY SHOW =====
becomePartnerBtn.addEventListener('click', () => {
  paymentOverlay.classList.remove('hidden');
  
  // Trigger smooth fade-in and scale animation
  setTimeout(() => {
    paymentOverlay.classList.add('show');
  }, 10);
});

// ===== FORM SUBMISSION =====
partnershipForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  
  // Validation
  if (!fullName || !email) {
    showToast('Please fill in all required fields');
    return;
  }
  
  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address');
    return;
  }
  
  // Store user data
  sessionStorage.setItem('partnerName', fullName);
  sessionStorage.setItem('partnerEmail', email);
  if (phone) sessionStorage.setItem('partnerPhone', phone);
  
  // Show personalized welcome message
  const firstName = fullName.split(' ')[0];
  welcomeMsg.textContent = `Welcome, ${firstName}! Choose your payment method.`;
  
  // Switch to payment options step
  formStep.classList.add('hidden');
  optionsStep.classList.remove('hidden');
});

// ===== BACK BUTTON =====
backBtn.addEventListener('click', () => {
  optionsStep.classList.add('hidden');
  formStep.classList.remove('hidden');
});

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ===== COPY TO CLIPBOARD =====
copyBtn.addEventListener('click', () => {
  const number = copyBtn.dataset.copy;
  
  navigator.clipboard.writeText(number)
    .then(() => {
      showToast('Mobile Money number copied!');
    })
    .catch(err => {
      console.error('Copy failed:', err);
      showToast('Failed to copy. Please try again.');
    });
});

// ===== USSD MODAL =====
ussdBtn.addEventListener('click', () => {
  ussdOverlay.classList.remove('hidden');
});

// Close USSD overlay when clicking outside
ussdOverlay.addEventListener('click', (e) => {
  if (e.target === ussdOverlay) {
    ussdOverlay.classList.add('hidden');
  }
});

// Close USSD overlay on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ussdOverlay.classList.add('hidden');
  }
});

// USSD option selection
ussdOptions.forEach(option => {
  option.addEventListener('click', () => {
    const ussdCode = option.dataset.ussd;
    ussdOverlay.classList.add('hidden');
    
    showToast('Initiating USSD dial...');
    
    setTimeout(() => {
      window.location.href = `tel:${ussdCode}`;
    }, 500);
    
    // Show impact section after USSD interaction
    setTimeout(() => {
      showImpactSection();
    }, 2000);
  });
});

// ===== PAYPAL BUTTON - Show Impact After Click =====
paypalBtn.addEventListener('click', () => {
  showToast('Redirecting to PayPal...');
  
  // Show impact section after brief delay
  setTimeout(() => {
    showImpactSection();
  }, 1500);
});

// ===== SHOW IMPACT SECTION =====
function showImpactSection() {
  // Hide payment overlay
  paymentOverlay.classList.remove('show');
  setTimeout(() => {
    paymentOverlay.classList.add('hidden');
  }, 500);
  
  // Hide hero landing
  heroLanding.style.display = 'none';
  
  // Show impact section with smooth animation
  impactSection.classList.remove('hidden');
  setTimeout(() => {
    impactSection.classList.add('show');
  }, 100);
  
  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
console.log('Kofi Karikari Ministries Payment Gateway Ready ✅');