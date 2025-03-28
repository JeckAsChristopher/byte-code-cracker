async function startCracking() {
    let inputField = document.getElementById("inputBytes");
    let output = document.getElementById("output");
    let progressBar = document.getElementById("progressBar");
    let estimateTime = document.getElementById("estimateTime"); // New estimated time display

    let inputBytes = inputField.value.trim().split(/\s+/); // Split input

    if (!inputBytes.every(byte => /^[01]{8}$/.test(byte))) {
        output.innerText = "Please enter valid 8-bit binary values.";
        return;
    }

    output.innerText = "Cracking...";
    progressBar.style.width = "0%";
    progressBar.innerText = "0%";

    // Estimate time dynamically (0.05s per byte as a base estimate)
    let estimatedSeconds = (inputBytes.length * 0.05).toFixed(2);
    estimateTime.innerText = `Estimated to crack: ~${estimatedSeconds}s`;

    try {
        const response = await fetch('https://nepal-yen-del-italic.trycloudflare.com/crack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hashArray: inputBytes })
        });

        const data = await response.json();

        if (data.success) {
            output.innerText = `Cracked Text: '${data.plainText}'`;

            // Smooth progress animation
            let start = 0;
            let countdown = parseFloat(estimatedSeconds);

            function animateProgress() {
                if (start <= 100) {
                    progressBar.style.width = start + "%";
                    progressBar.innerText = start + "%";

                    if (countdown > 0) {
                        estimateTime.innerText = `Estimated to crack: ~${countdown.toFixed(1)}s`;
                        countdown -= 0.1; // Update countdown every frame
                    } else {
                        estimateTime.innerText = "Cracking complete!";
                    }

                    start += 5;
                    requestAnimationFrame(animateProgress);
                }
            }

            animateProgress();
        } else {
            output.innerText = "Cracking failed.";
            estimateTime.innerText = "";
        }
    } catch (error) {
        output.innerText = "Error contacting server.";
        estimateTime.innerText = "";
        console.error(error);
    }
}