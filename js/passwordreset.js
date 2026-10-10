const auth = firebase.auth();

        // Get the OOB code from the URL (Firebase puts this in the link when you click the email)
        const urlParams = new URLSearchParams(window.location.search);
        const oobCode = urlParams.get('oobCode');

        const resetFormView = document.getElementById('resetFormView');
        const successView = document.getElementById('successView');
        const authAlert = document.getElementById('authAlert');

        function showAlert(message) {
            authAlert.innerText = message;
            authAlert.classList.remove('hidden');
        }

        // If there is no code in the URL, the link is broken
        if (!oobCode) {
            showAlert("Invalid or expired link. Please request a new password reset.");
        }

        document.getElementById('resetBtn').addEventListener('click', async () => {
            const btn = document.getElementById('resetBtn');
            const newPassword = document.getElementById('newPassword').value;
            
            if(!newPassword || newPassword.length < 6) {
                showAlert("Password must be at least 6 characters long.");
                return;
            }

            btn.innerText = 'Updating...'; btn.disabled = true;

            try {
                // Tell Firebase to verify the code and set the new password
                await auth.confirmPasswordReset(oobCode, newPassword);
                
                // Show success screen
                resetFormView.classList.add('hidden');
                successView.classList.remove('hidden');
            } catch (err) {
                showAlert("Error: The link may have expired. Please try resetting your password again.");
                btn.innerText = 'Update Password'; btn.disabled = false;
            }
        });
