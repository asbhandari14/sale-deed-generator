document.getElementById('saleDeedForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    console.log("lkasfjlkdsflkd")
    console.log("Form submitted:", form);
    const formData = new FormData(form);
    console.log("Form data:", formData);

    const data = {
        fullName: form.fullName.value,
        fatherName: form.fatherName.value,
        propertySize: form.propertySize.value,
        saleAmount: form.saleAmount.value,
        date: form.date.value,
    };
    console.log("Form data:", data);
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    const message = document.getElementById('message');

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    loading.style.display = 'inline-block';
    message.style.display = 'none';

    try {
        console.log("Hello I am here");
        console.log("Submitting form data:", data);
        const response = await fetch('http://localhost:3000/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Create a blob from the response
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sale-deed-${data.fullName.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            // Show success message
            showMessage('PDF generated and downloaded successfully!', 'success');

            // Reset form
            form.reset();

        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate PDF');
        }

    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message || 'An error occurred while generating the PDF', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        loading.style.display = 'none';
    }
});

function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';

    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    }
}

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();