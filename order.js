// Order Form JavaScript - Validation and Submission

// Form elements
const orderForm = document.getElementById('orderForm');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const successBtn = document.getElementById('successBtn');

// Form fields
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const occasion = document.getElementById('occasion');
const deliveryAddress = document.getElementById('deliveryAddress');
const deliveryDate = document.getElementById('deliveryDate');
const deliveryTime = document.getElementById('deliveryTime');
const budget = document.getElementById('budget');
const message = document.getElementById('message');
const charCount = document.getElementById('charCount');
const referenceImage = document.getElementById('referenceImage');
const fileUploadText = document.getElementById('fileUploadText');
const imagePreview = document.getElementById('imagePreview');

// Set minimum date for delivery (tomorrow)
if (deliveryDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    deliveryDate.setAttribute('min', minDate);
}

// Character counter for message
if (message && charCount) {
    message.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
}

// File upload handling
if (referenceImage) {
    referenceImage.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Slika je prevelika. Največja dovoljena velikost je 5 MB.');
                this.value = '';
                return;
            }

            // Update file name
            fileUploadText.textContent = file.name;

            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `
                    <div class="image-preview-wrapper">
                        <img src="${e.target.result}" alt="Preview">
                        <button type="button" class="remove-image" id="removeImage">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                `;
                imagePreview.classList.add('show');
                lucide.createIcons();

                // Add remove functionality
                document.getElementById('removeImage').addEventListener('click', function() {
                    referenceImage.value = '';
                    fileUploadText.textContent = 'Izberite sliko ali povlecite sem';
                    imagePreview.classList.remove('show');
                    imagePreview.innerHTML = '';
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag and drop for file upload
    const fileUploadLabel = document.querySelector('.file-upload-label');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadLabel.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadLabel.addEventListener(eventName, function() {
            this.style.borderColor = 'var(--dusty-rose)';
            this.style.background = 'var(--white)';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadLabel.addEventListener(eventName, function() {
            this.style.borderColor = '';
            this.style.background = '';
        }, false);
    });

    fileUploadLabel.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        referenceImage.files = files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        referenceImage.dispatchEvent(event);
    }, false);
}

// Validation functions
function validateField(field, errorElementId, validationFn, errorMessage) {
    const errorElement = document.getElementById(errorElementId);
    
    if (!validationFn(field.value)) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
        return false;
    } else {
        field.classList.remove('error');
        errorElement.classList.remove('show');
        return true;
    }
}

function isRequired(value) {
    return value.trim() !== '';
}

function isValidPhone(value) {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return value.length >= 9 && phoneRegex.test(value);
}

function isValidEmail(value) {
    if (value === '') return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

// Add real-time validation
if (firstName) {
    firstName.addEventListener('blur', function() {
        validateField(this, 'firstNameError', isRequired, 'Prosimo vnesite svoje ime');
    });
}

if (lastName) {
    lastName.addEventListener('blur', function() {
        validateField(this, 'lastNameError', isRequired, 'Prosimo vnesite svoj priimek');
    });
}

if (phone) {
    phone.addEventListener('blur', function() {
        validateField(this, 'phoneError', isValidPhone, 'Prosimo vnesite veljaven telefonski številki');
    });
}

if (email) {
    email.addEventListener('blur', function() {
        validateField(this, 'emailError', isValidEmail, 'Prosimo vnesite veljaven e-poštni naslov');
    });
}

if (occasion) {
    occasion.addEventListener('change', function() {
        validateField(this, 'occasionError', isRequired, 'Prosimo izberite priložnost');
    });
}

if (deliveryAddress) {
    deliveryAddress.addEventListener('blur', function() {
        validateField(this, 'deliveryAddressError', isRequired, 'Prosimo vnesite naslov dostave');
    });
}

if (deliveryDate) {
    deliveryDate.addEventListener('change', function() {
        validateField(this, 'deliveryDateError', isRequired, 'Prosimo izberite datum dostave');
    });
}

if (deliveryTime) {
    deliveryTime.addEventListener('change', function() {
        validateField(this, 'deliveryTimeError', isRequired, 'Prosimo izberite časovni okvir');
    });
}

if (budget) {
    budget.addEventListener('change', function() {
        validateField(this, 'budgetError', isRequired, 'Prosimo izberite željen znesek');
    });
}

// Form submission
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all required fields
        let isValid = true;

        isValid &= validateField(firstName, 'firstNameError', isRequired, 'Prosimo vnesite svoje ime');
        isValid &= validateField(lastName, 'lastNameError', isRequired, 'Prosimo vnesite svoj priimek');
        isValid &= validateField(phone, 'phoneError', isValidPhone, 'Prosimo vnesite veljaven telefonski številki');
        isValid &= validateField(email, 'emailError', isValidEmail, 'Prosimo vnesite veljaven e-poštni naslov');
        isValid &= validateField(occasion, 'occasionError', isRequired, 'Prosimo izberite priložnost');
        isValid &= validateField(deliveryAddress, 'deliveryAddressError', isRequired, 'Prosimo vnesite naslov dostave');
        isValid &= validateField(deliveryDate, 'deliveryDateError', isRequired, 'Prosimo izberite datum dostave');
        isValid &= validateField(deliveryTime, 'deliveryTimeError', isRequired, 'Prosimo izberite časovni okvir');
        isValid &= validateField(budget, 'budgetError', isRequired, 'Prosimo izberite željen znesek');

        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector('.form-input.error, .form-select.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader"></i> Pošiljam...';
        lucide.createIcons();

        // Collect form data
        const formData = new FormData(orderForm);
        const orderData = Object.fromEntries(formData.entries());

        console.log('Order submitted:', orderData);

        // Simulate API call
        setTimeout(() => {
            // Show success modal
            successModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            lucide.createIcons();

            // Reset form
            orderForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="send"></i> Oddaj naročilo';
            lucide.createIcons();

            // Reset image preview
            if (imagePreview) {
                imagePreview.classList.remove('show');
                imagePreview.innerHTML = '';
                fileUploadText.textContent = 'Izberite sliko ali povlecite sem';
            }

            // Reset character count
            if (charCount) {
                charCount.textContent = '0';
            }
        }, 1500);
    });
}

// Success modal close
if (successBtn) {
    successBtn.addEventListener('click', function() {
        successModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        window.location.href = 'index.html';
    });
}

// Close modal on background click
if (successModal) {
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            this.classList.remove('show');
            document.body.style.overflow = 'auto';
            window.location.href = 'index.html';
        }
    });
}

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
