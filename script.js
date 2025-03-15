document.addEventListener('DOMContentLoaded', function() {
    // IMT Calculator
    const calculateButton = document.getElementById('calculate');
    if (calculateButton) {
        calculateButton.addEventListener('click', function() {
            const weightInput = document.getElementById('weight');
            const heightInput = document.getElementById('height');
            const weight = parseFloat(weightInput.value);
            const height_cm = parseFloat(heightInput.value); // Height in cm
            const age = parseInt(document.getElementById('age').value);
            const gender = document.querySelector('input[name="gender"]:checked');

            // Data Validation
            if (!weight || weight <= 0) {
                alert('Please enter a valid weight (greater than 0).');
                weightInput.focus();
                return;
            }
            if (!height_cm || height_cm < 50 || height_cm > 250) {
                alert('Please enter a valid height (between 50cm and 250cm).');
                heightInput.focus();
                return;
            }

            if (weight && height_cm && age && gender) {
                const height = height_cm / 100; // Convert cm to meters
                const imt = weight / (height * height);
                let interpretation = '';
                let targetWeight;
                let weightDifference;

                if (imt < 18.5) {
                    interpretation = 'Underweight';
                    targetWeight = 18.5 * (height * height);
                    weightDifference = targetWeight - weight;
                    document.getElementById('weight-loss-target').textContent = `To reach an ideal BMI, aim to gain approximately ${weightDifference.toFixed(2)} kg.`;
                } else if (imt < 25) {
                    interpretation = 'Ideal';
                    document.getElementById('weight-loss-target').textContent = 'Your weight is already within the ideal BMI range.';
                } else if (imt < 30) {
                    interpretation = 'Overweight';
                    targetWeight = 24.9 * (height * height);
                    weightDifference = weight - targetWeight;
                    document.getElementById('weight-loss-target').textContent = `To reach an ideal BMI, aim to lose approximately ${weightDifference.toFixed(2)} kg.`;
                } else {
                    interpretation = 'Obese';
                    targetWeight = 24.9 * (height * height);
                    weightDifference = weight - targetWeight;
                    document.getElementById('weight-loss-target').textContent = `To reach an ideal BMI, aim to lose approximately ${weightDifference.toFixed(2)} kg.`;
                }

                document.getElementById('imt-result').textContent = imt.toFixed(2);
                document.getElementById('imt-interpretation').textContent = interpretation;

                // Create/Update the BMI graph
                createBMIGraph(height, weight);

            } else {
                alert('Please fill in all data.');
            }
        });
}

    // --- Workout Recommendations for Diabetes Patients ---
    function showWorkoutRecommendations() {
        const section = document.getElementById('diagnosis-tool-3-content');
        if (section) {
            section.style.display = 'block';
            const sections = ['welcome', 'features', 'imt-calculator', 'food-recommendation-section', 'nutrition-analysis-section', 'faq-section', 'diagnosis', 'hepatitis-b-diagnosis', 'glucose-screening-section'];
            sections.forEach(id => {
                const otherSection = document.getElementById(id);
                if (otherSection) {
                    otherSection.style.display = 'none';
                }
            });
        }
    }

    // Event listener for diagnosis tool 3 button
    document.getElementById('diagnosis-tool-3').addEventListener('click', showWorkoutRecommendations);


    // 1. Blood Glucose Recommendations
    const bloodGlucoseInput = document.getElementById('blood-glucose');
    const glucoseRecommendationDiv = document.getElementById('glucose-recommendation');

    if (bloodGlucoseInput) {
        bloodGlucoseInput.addEventListener('input', function() {
            const glucoseLevel = parseFloat(this.value);

            if (isNaN(glucoseLevel)) {
                glucoseRecommendationDiv.textContent = 'Please enter a valid blood glucose level.';
                return;
            }

            let recommendation = '';

            if (glucoseLevel < 90) {
                recommendation = 'Consume 15–30g of fast-acting carbohydrates before exercising (if moderate-intensity and prolonged). Short, high-intensity workouts may not require additional intake.';
            } else if (glucoseLevel < 150) {
                recommendation = 'Start consuming 0.5–1.0 g/kg body mass per hour of carbohydrates depending on activity type and insulin levels.';
            } else if (glucoseLevel < 250) {
                recommendation = 'Exercise can begin, but carbohydrate consumption should be delayed until levels drop below 150 mg/dL.';
            } else if (glucoseLevel < 350) {
                recommendation = 'Test for ketones. If moderate-to-large ketones are present, do not exercise. Start with mild to moderate intensity exercise. Avoid intense workouts until levels drop below 250 mg/dL.';
            } else {
                recommendation = 'Test for ketones. If ketones are moderate-to-large, do not exercise. If ketones are negative, consider insulin correction before starting mild-to-moderate exercise. Avoid intense workouts.';
            }
            glucoseRecommendationDiv.innerHTML = `<p>${recommendation}</p>`;

        });
    }


    // 2. Insulin Adjustment Recommendations
    const exerciseIntensitySelect = document.getElementById('exercise-intensity');
    const exerciseDurationSelect = document.getElementById('exercise-duration');
    const insulinAdjustmentDiv = document.getElementById('insulin-adjustment-recommendation');

    if (exerciseIntensitySelect && exerciseDurationSelect) {
        function updateInsulinAdjustment() {
            const intensity = exerciseIntensitySelect.value;
            const duration = exerciseDurationSelect.value;
            let adjustment = '';

            if (intensity === 'mild') {
                adjustment = duration === '30' ? '-25%' : '-50%';
            } else if (intensity === 'moderate') {
                adjustment = duration === '30' ? '-50%' : '-75%';
            } else if (intensity === 'heavy') {
                adjustment = duration === '30' ? '-75%' : 'N/A';
            } else if (intensity === 'intense') {
                adjustment = 'No reduction recommended';
            }
            insulinAdjustmentDiv.innerHTML = `<p>Recommended insulin dose adjustment: <strong>${adjustment}</strong></p>`;
        }
      exerciseIntensitySelect.addEventListener('change', updateInsulinAdjustment);
      exerciseDurationSelect.addEventListener('change', updateInsulinAdjustment);
      // Initial calculation on page load:
      updateInsulinAdjustment();
    }

    // 3. Medication Considerations
     const medicationCheckboxes = document.querySelectorAll('#medication-considerations input[type="checkbox"]');
    const medicationRecommendationDiv = document.getElementById('medication-recommendation');

    if (medicationCheckboxes.length > 0) {
        medicationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateMedicationRecommendations);
        });
    }

    function updateMedicationRecommendations() {
        let recommendations = '';

        // Diabetes Medications
        if (document.getElementById('med-insulin').checked) {
            recommendations += '<p><strong>Insulin:</strong> - Deficiency: Hyperglycemia, ketoacidosis<br>- Excess: Hypoglycemia during & after exercise<br><strong>Exercise Consideration:</strong> - Increase insulin dose pre- & post-exercise if deficient<br>- Decrease prandial/basal doses if excess insulin is present</p>';
        }
        if (document.getElementById('med-secretagogues').checked) {
            recommendations += '<p><strong>Insulin Secretagogues:</strong> Exercise-induced hypoglycemia<br><strong>Exercise Consideration:</strong> Reduce dose on exercise days if hypoglycemia occurs</p>';
        }
        if (document.getElementById('med-metformin').checked) {
            recommendations += '<p><strong>Metformin:</strong> No direct effects<br><strong>Exercise Consideration:</strong> Generally safe; no dose adjustment needed</p>';
        }
        if (document.getElementById('med-sglt2').checked) {
            recommendations += '<p><strong>SGLT2 Inhibitors:</strong> - Alone: No major risk<br>- With insulin/sulfonylureas: May increase hypoglycemia risk<br><strong>Exercise Consideration:</strong> Generally safe; no dose adjustment needed</p>';
        }
      if (document.getElementById('med-dpp4').checked) {
            recommendations += '<p><strong>Dipeptidyl Peptidase-4 Inhibitors (DPP-4 inhibitors):</strong> Slight risk of congestive heart failure (with saxagliptin, alogliptin)<br><strong>Exercise Consideration:</strong> Generally safe; no dose adjustment needed</p>';
        }
      if (document.getElementById('med-glp1').checked) {
          recommendations += '<p><strong>Glucagon-Like Peptide-1 Receptor Agonists (GLP-1 RAs):</strong> - Alone: No major risk<br>- With insulin/sulfonylureas: May increase hypoglycemia risk<br><strong>Exercise Consideration:</strong> Generally safe; no dose adjustment needed but insulin/sulfonylurea dose may need reduction</p>';
      }
        if(document.getElementById('med-thiazolidinediones').checked){
            recommendations += '<p><strong>Thiazolidinediones:</strong> Fluid retention<br><strong>Exercise Consideration:</strong> Generally safe; no dose adjustment needed</p>';
        }

        // Hypertension Medications
        if (document.getElementById('med-beta-blockers').checked) {
            recommendations += '<p><strong>β-Blockers:</strong> - Hypoglycemia unawareness & unresponsiveness<br>- May reduce maximal exercise capacity<br><strong>Exercise Consideration:</strong> - Monitor blood glucose pre- & post-exercise<br>- Treat hypoglycemia with glucose</p>';
        }
      if (document.getElementById('med-other-antihypertensive').checked){
        recommendations += '<p><strong>Other Antihypertensive Agents:</strong> - Exercise may naturally lower blood pressure<br>- Some medications may cause dehydration<br><strong>Exercise Consideration:</strong> - Doses may need adjustment to match exercise-related improvements & prevent dehydration</p>';
      }

      // Cholesterol Medications
      if (document.getElementById('med-statins').checked){
        recommendations += '<p><strong>Statins:</strong> May cause muscle weakness, discomfort, cramping (in some users)<br><strong>Exercise Consideration:</strong> Generally safe; no dose adjustment needed</p>';
      }
      if (document.getElementById('med-fibric-acid').checked){
        recommendations += '<p><strong>Fibric Acid Derivatives:</strong> - Rare myositis or rhabdomyolysis<br>- Higher risk with gemfibrozil + statin combination<br><strong>Exercise Consideration:</strong> Avoid exercise if muscle conditions develop</p>';
      }

        medicationRecommendationDiv.innerHTML = recommendations;
    }

    // Function to calculate ideal weight range based on height (in meters)
    function calculateIdealWeightRange(height) {
        const minIdealWeight = 18.5 * (height * height);
        const maxIdealWeight = 24.9 * (height * height);
        return { min: minIdealWeight, max: maxIdealWeight };
    }

    // Function to calculate weight loss target
    function calculateWeightLossTarget(currentWeight, idealWeight) {
        return currentWeight - idealWeight;
    }

    function getFoodRecommendations(latitude, longitude) {
        // Placeholder function to simulate fetching food recommendations
        let cityName = 'Example City Name';
        let foodRecommendation = 'Sorry, food recommendations are not available for your current location.';

        document.getElementById('city-name').textContent = cityName;
        document.getElementById('food-recommendation').textContent = foodRecommendation;
    }

    // Food Recommendation
    const detectLocationButton = document.getElementById('detect-location');
    if (detectLocationButton) {
        detectLocationButton.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const locationInfo = `Latitude: ${latitude}, Longitude: ${longitude}`;
                    document.getElementById('location-info').textContent = locationInfo;

                    // Construct search query URL
                    const searchQuery = `https://www.google.com/search?q=healthy+food+recommendations+near+${latitude},${longitude}`;

                    // Open search query in new tab
                    window.open(searchQuery, '_blank');

                }, function(error) {
                    document.getElementById('location-info').textContent = 'Failed to get location.';
                });
            } else {
                document.getElementById('location-info').textContent = 'Geolocation is not supported by your browser.';
            }
        });
    }

function showHepatitisComparison() {
  const section = document.getElementById('hepatitis-comparison-section');
  if (section) {
    section.style.display = 'block';
     const sections = ['welcome', 'features', 'imt-calculator', 'food-recommendation-section', 'nutrition-analysis-section', 'faq-section', 'diagnosis', 'hepatitis-b-diagnosis', 'glucose-screening-section'];
        sections.forEach(id => {
            const otherSection = document.getElementById(id);
            if (otherSection) {
                otherSection.style.display = 'none';
            }
        });
  }
}

    // Function to show/hide sections
    function showSection(sectionId) {
        console.log('showSection called with:', sectionId);
        const sections = ['welcome', 'features', 'imt-calculator', 'food-recommendation-section', 'nutrition-analysis-section', 'faq-section', 'diagnosis', 'hepatitis-b-diagnosis', 'glucose-screening-section', 'hba1c-screening-section', 'hepatitis-comparison-section'];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                if (sectionId === 'welcome') {
                    section.style.display = (id === 'welcome' || id === 'features' || id === 'diagnosis') ? 'block' : 'none';
                    // Explicitly hide diagnosis-tool-3-content
                    const workoutSection = document.getElementById('diagnosis-tool-3-content');
                    if (workoutSection) {
                        workoutSection.style.display = 'none';
                    }
                } else if (sectionId === 'glucose-screening-section') {
                    // Show both glucose screening and hba1c screening sections
                    section.style.display = (id === 'glucose-screening-section' || id === 'hba1c-screening-section') ? 'block' : 'none';
                }
                else {
                    section.style.display = (id === sectionId) ? 'block' : 'none';
                }
            }
        });
    }

    // Event listeners for buttons to show sections
    document.getElementById('imt-calculator-button').addEventListener('click', () => showSection('imt-calculator'));
    document.getElementById('food-recommendation-button').addEventListener('click', () => showSection('food-recommendation-section'));
    document.getElementById('nutrition-analysis-button').addEventListener('click', () => showSection('nutrition-analysis-section'));
    document.getElementById('faq-button').addEventListener('click', () => showSection('faq-section'));

    // Add event listeners for diagnosis buttons
    document.getElementById('diagnosis-tool-1').addEventListener('click', () => showSection('hepatitis-b-diagnosis'));
    document.getElementById('diagnosis-tool-2').addEventListener('click', () => showSection('glucose-screening-section')); // Modified to show glucose-screening-section
    document.getElementById('diagnosis-tool-3').addEventListener('click', () => showWorkoutRecommendations());
    document.getElementById('diagnosis-tool-4').addEventListener('click', () => {
        window.open('https://aistudio.google.com/u/2/prompts/new_chat', '_blank');
    });

    // Home link functionality
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', () => showSection('welcome'));
    }

    const hbvDiagnoseButton = document.getElementById('hbv-diagnose');
    if (hbvDiagnoseButton) {
        hbvDiagnoseButton.addEventListener('click', function() {
            const age = parseInt(document.getElementById('hbv-age').value);
            const vaccination = document.querySelector('input[name="vaccination"]:checked');
            const riskFactors = document.getElementById('risk-factors').value;

            let result = '';
            let recommendation = '';

            if (age && vaccination && riskFactors) {
                if (age < 1 || age > 100) {
                    result = 'Invalid age.';
                    recommendation = 'Please enter a valid age.';
                } else {
                    let riskLevel = 'low';
                    if (riskFactors.toLowerCase().includes('blood transfusion') || riskFactors.toLowerCase().includes('injection drug use')) {
                        riskLevel = 'high';
                    }

                    if (vaccination.value === 'unvaccinated' && riskLevel === 'high') {
                        result = 'High risk of Hepatitis B infection.';
                        recommendation = 'It is recommended to immediately undergo HBsAg testing with RDT and consult with a specialist doctor.';
                    } else if (vaccination.value === 'unvaccinated' && riskLevel === 'low') {
                        result = 'Low risk, but still potential for Hepatitis B infection.';
                        recommendation = 'It is recommended to undergo HBsAg testing and consider Hepatitis B vaccination.';
                    } else {
                        result = 'Low risk of Hepatitis B infection.';
                        recommendation = 'Maintain personal hygiene and avoid risk factors. Consider rescreening if there is new risk exposure.';
                    }
                }
            } else {
                result = 'Please fill in all data.';
                recommendation = 'Please complete all required information.';
            }

            document.getElementById('hbv-result').textContent = result;
            document.getElementById('hbv-recommendation').textContent = recommendation;
        });
    }


    function calculateGlucoseRisk() {
        const gdpInput = document.getElementById('gdp');
        const gdsInput = document.getElementById('gds');
        const ttgoInput = document.getElementById('ttgo');
        const classicSymptoms = document.getElementById('classic-symptoms').checked;
        const resultDiv = document.getElementById('glucose-result');

        // Unhide the results div
        resultDiv.style.display = 'block';

        const gdp = parseFloat(gdpInput.value);
        const gds = parseFloat(gdsInput.value);
        const ttgo = parseFloat(ttgoInput.value);

        // Check if all inputs are empty
        if (isNaN(gdp) && isNaN(gds) && isNaN(ttgo)) {
            resultDiv.innerHTML = `<p><strong>Diagnosis:</strong> No Result</p><p><strong>Action:</strong></p>`;
            return; // Exit the function
        }

        let result = '';
        let action = '';

        if (classicSymptoms) {
            // Classic Diabetes Symptoms (+)
            if ((!isNaN(gdp) && gdp >= 126) || (!isNaN(gds) && gds >= 200)) {
                result = 'Diabetes Mellitus';
                action = 'Evaluate nutritional status, evaluate DM complications, and evaluate meal planning as needed.';
            } else {
                // TTGO examination is needed if FPG < 126 or RPG < 200 and clinical complaints (+)
                if (!isNaN(ttgo)) {
                    if (ttgo >= 200) {
                        result = 'Diabetes Mellitus';
                        action = 'Evaluate nutritional status, evaluate DM complications, and evaluate meal planning as needed.';
                    } else if (ttgo >= 140 && ttgo <= 199) {
                        result = 'IGT (Impaired Glucose Tolerance)';
                        action = 'General advice, meal planning, physical exercise, ideal body weight, and no need for glucose-lowering medication yet.';
                    } else if (ttgo < 140) {
                        result = 'IFG (Impaired Fasting Glucose) / Normal';
                        action = 'General advice, meal planning, physical exercise, ideal body weight, and no need for glucose-lowering medication yet.';
                    }
                } else {
                    result = 'Repeat FPG/RPG examination, if FPG <126 or RPG <200, perform OGTT examination and enter the results';
                    action = '';
                }
            }
        } else {
            // Classic Symptoms (-)
            if ((!isNaN(gdp) && gdp < 100) || (!isNaN(gds) && gds < 140)) {
                result = 'Normal';
                action = 'No specific action required.';
            }
        else if ((!isNaN(gdp) && gdp >= 126) || (!isNaN(gds) && gds >= 200)) {
            result = 'Diabetes Mellitus. Repeat RPG or FPG, if RPG ≥200 or FPG ≥126 then diagnosed with diabetes, if not, perform OGTT examination.';
            action = ''; // Empty action
             // Check for TTGO even if initial diagnosis is DM
            if (!isNaN(ttgo)) {
                if (ttgo >= 200) {
                    result = 'Diabetes Mellitus';
                    action = 'Evaluate nutritional status, evaluate DM complications, and evaluate meal planning as needed.';
                } else if (ttgo >= 140 && ttgo <= 199) {
                    result = 'IGT (Impaired Glucose Tolerance)';
                    action = 'General advice, meal planning, physical exercise, ideal body weight, and no need for glucose-lowering medication yet.';
                } else if (ttgo < 140) {
                    result = 'IFG (Impaired Fasting Glucose) / Normal';
                    action = 'General advice, meal planning, physical exercise, ideal body weight, and no need for glucose-lowering medication yet.';
                }
            }
        }

         else if ((!isNaN(gdp) && gdp >= 100 && gdp <= 125) || (!isNaN(gds) && gds >= 140 && gds <= 199)) {
            // Check OGTT
            if (!isNaN(ttgo)) {
                if (ttgo >= 200) {
                    result = 'Diabetes Mellitus';
                    action = 'Evaluate nutritional status, evaluate DM complications, and evaluate meal planning as needed.';
                } else if (ttgo >= 140 && ttgo <= 199) {
                    result = 'IGT (Impaired Glucose Tolerance)';
                    action = 'General advice, meal planning, physical exercise, ideal body weight, and no need for glucose-lowering medication yet.';
                } else if (ttgo < 140) {
                    result = 'IFG (Impaired Fasting Glucose) / Normal';
                    action = 'General advice, meal planning, physical exercise, ideal body weight, and no need for glucose-lowering medication yet.';
                }
            } else {
                result = 'Need 2-hour OGTT examination.';
                action = 'Enter OGTT value.';
            }
        } else {
          // Check OGTT
            if (!isNaN(ttgo)) {
                if (ttgo >= 200) {
                    result = 'Diabetes Mellitus';
                    action = 'Evaluate nutritional status, evaluate DM complications, and evaluate meal planning as needed.';
                } else if (ttgo >= 140 && ttgo <= 199) {
                    result = 'IGT (Impaired Glucose Tolerance)';
                    action = 'General advice, meal planning, physical exercise, ideal body weight, and no need for glucose-lowering medication yet.';
                } else if (ttgo < 140) {
                    result = 'IFG (Impaired Fasting Glucose) / Normal';
                    action = 'General advice, meal planning, physical exercise, ideal body weight, and no need for glucose-lowering medication yet.';
                }
            }
            else {
              result = 'Need 2-hour OGTT examination.';
              action = 'Enter OGTT value.';
            }
        }
    }

        resultDiv.innerHTML = `<p><strong>Diagnosis:</strong> ${result}</p><p><strong>Action:</strong> ${action}</p>`;
    }

    // Event listener for the new calculate button
    document.getElementById('calculate-glucose').addEventListener('click', calculateGlucoseRisk);

    // --- HbA1c Screening ---
    const hba1cInput = document.getElementById('hba1c');
    const bgMgdlInput = document.getElementById('bg-mgdl');
    const bgMmolInput = document.getElementById('bg-mmol');
    const calculateHba1cButton = document.getElementById('calculate-hba1c');
    const hba1cResultDiv = document.getElementById('hba1c-result');

    // Helper function to categorize HbA1c
    function categorizeHbA1c(hba1c) {
        if (hba1c >= 9.0 && hba1c <= 14.0) return 'red';
        if (hba1c >= 7.0 && hba1c < 9.0) return 'yellow';
        if (hba1c >= 4.0 && hba1c < 7.0) return 'green';
        return 'invalid'; // Handle out-of-range values
    }

    // Helper function to categorize Blood Glucose (mg/dL)
    function categorizeBgMgdl(bgMgdl) {
        if (bgMgdl >= 215 && bgMgdl <= 380) return 'red';
        if (bgMgdl >= 150 && bgMgdl < 215) return 'yellow';
        if (bgMgdl >= 50 && bgMgdl < 150) return 'green';
        return 'invalid';
    }

    // Helper function to categorize Blood Glucose (mmol/L)
    function categorizeBgMmol(bgMmol) {
        if (bgMmol >= 11.9 && bgMmol <= 21.1) return 'red';
        if (bgMmol >= 8.2 && bgMmol < 11.9) return 'yellow';
        if (bgMmol >= 2.6 && bgMmol < 8.2) return 'green';
        return 'invalid';
    }

    // Decision rules implementation
    function classifyRisk(hba1cZone, mgdlZone, mmolZone) {
      const zones = [hba1cZone, mgdlZone, mmolZone].filter(zone => zone !== 'invalid' && zone !== undefined);

      if (zones.length === 0) {
        return {classification: 'No Data', message: 'Please enter at least one value.', color: 'black'};
      }

      if (zones.every(zone => zone === zones[0])) {
        // All entered values in the same zone
        let classification = '';
        let message = '';
        let color = zones[0];
        if (color === 'red') {
          classification = 'Action Suggested';
          message = 'Your glucose levels are high! Consider consulting a healthcare provider and adjusting your diet or medication.';
        } else if (color === 'yellow') {
          classification = 'Good';
          message = 'Your glucose control is good, but there’s room for improvement!';
          color = 'black'; // Override color to black
        } else if (color === 'green') {
          classification = 'Excellent';
          message = 'Great job! Your blood sugar control is excellent.';
        }
        return { classification, message, color};
      }

      // Check for inconsistent data
      if(zones.includes('green') && zones.includes('red')){
        return { classification: 'Inconsistent Data', message: 'Further Evaluation Needed', color: 'black'};
      }

      // If not all the same, return highest risk
      if (zones.includes('red')) return { classification: 'Action Suggested', message: 'Your glucose levels are high! Consider consulting a healthcare provider and adjusting your diet or medication.', color: 'red'};
      if (zones.includes('yellow')) return { classification: 'Good', message: 'Your glucose control is good, but there’s room for improvement!', color: 'black' }; // Set color to black
      return { classification: 'Excellent', message: 'Great job! Your blood sugar control is excellent.', color: 'green'}
    }


  if (calculateHba1cButton){
    calculateHba1cButton.addEventListener('click', function() {
        const hba1cValue = parseFloat(hba1cInput.value);
        const bgMgdlValue = parseFloat(bgMgdlInput.value);
        const bgMmolValue = parseFloat(bgMmolInput.value);

        const hba1cZone = isNaN(hba1cValue) ? undefined : categorizeHbA1c(hba1cValue);
        const mgdlZone = isNaN(bgMgdlValue) ? undefined : categorizeBgMgdl(bgMgdlValue);
        const mmolZone = isNaN(bgMmolValue) ? undefined : categorizeBgMmol(bgMmolValue);

        const result = classifyRisk(hba1cZone, mgdlZone, mmolZone);

        hba1cResultDiv.innerHTML = `<p style="color: ${result.color};"><strong>${result.classification}:</strong> ${result.message}</p>`;
        hba1cResultDiv.style.display = 'block';
    });
  }
});

    // Add this line at the top of your script to include Chart.js from CDN
    // <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    let bmiChartInstance = null; // Store the chart instance

    function createBMIGraph(height, weight) {
        // const minIdealWeight = 18.5 * (height * height);
        // const maxIdealWeight = 24.9 * (height * height);

        // Generate data points for the ideal weight range
        const idealWeightData = [];
        const heightRange = []; // Array to store height values for the x-axis
        for (let h = 1.5; h <= 2.0; h += 0.01) { // Example height range (in meters)
            heightRange.push(h.toFixed(2)); // Add height to the array, formatted to 2 decimal places
            // idealWeightData.push(21.7 * (h * h)); // Use 21.7 as the "ideal" BMI - REMOVED
        }

        const ctx = document.getElementById('bmi-chart').getContext('2d');

        console.log("Height:", height, "Weight:", weight); // Debugging

         // Destroy previous chart instance if it exists
        if (bmiChartInstance) {
            bmiChartInstance.destroy();
        }

        bmiChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: heightRange, // Use heightRange for x-axis labels
                datasets: [{
                    label: 'Your BMI',
                    data: [{x: height, y: weight}], // Current weight and height as a single point
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    fill: false,
                    type: 'scatter', // Use scatter type for a single point
                    showLine: false, // Hide the line for the scatter point
                },
                {
                    label: 'Lower Ideal Limit (BMI 18.5)',
                    data: heightRange.map(h => ({x: h, y: 18.5 * (h * h)})),
                    borderColor: 'rgba(0, 255, 0, 0.5)',
                    fill: '+1', // Fill area below this line
                    showLine: true,
                },
                {
                    label: 'Upper Ideal Limit (BMI 24.9)',
                    data: heightRange.map(h => ({x: h, y: 24.9 * (h * h)})),
                    borderColor: 'rgba(0, 255, 0, 0.5)',
                    fill: false, // Don't fill area below this line
                    showLine: true,
                },
            ]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear', // Specify linear scale for x-axis
                        title: {
                            display: true,
                            text: 'Height (m)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Weight (kg)'
                        },
                        min: 40, // Adjust as needed
                        max: 150, // Adjust as needed
                    }
                }
            }
        });
}

// Get the modal
var nutritionModal = document.getElementById("nutrition-modal");

// Get the button that opens the modal
var btn = document.getElementById("show-nutrition-modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-button")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    nutritionModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    nutritionModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == nutritionModal) {
        nutritionModal.style.display = "none";
    }
}

// Get the modal
var faqModal = document.getElementById("faq-modal");

// Get the button that opens the modal
var btn = document.getElementById("show-faq-modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-button")[1]; // The second close button

// When the user clicks the button, open the modal
btn.onclick = function() {
    faqModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    faqModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == faqModal) {
        faqModal.style.display = "none";
    }
}
