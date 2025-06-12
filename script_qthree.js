// Run after everything loaded
window.addEventListener('load', () => {
  window.jsPDF = window.jspdf.jsPDF;

  const progressBar = document.getElementById("progress-bar");
  const questionCounter = document.getElementById("question-counter");
  const container = document.getElementById("quiz-container");
  const scoreContainer = document.getElementById("score-container");
  const correctSound = document.getElementById("correct-sound");
  const wrongSound = document.getElementById("wrong-sound");
  const startButton = document.getElementById("start-button");
  const alertElement = document.getElementById("alert");

  let currentIndex = 0;
  let score = 0;
  let startTime = 0;
  let timerInterval = null;
  let answeredQuestions = [];
  let soundEnabled = true;

  const quizData = [
    {
    "question": "<div class=\"question\">Which specific compartment configuration is found in the ATR aircraft?</div>",
    "options": ["FWD, Aft, Bulk", "1, 3, 4, 5", "1, 2, 3, 4, 5", "FWD Right, FWD Left, Rear Fwd, Rear Aft"],
    "answer_index": 3,
    "explanation": "The ATR has four compartments labeled FWD Right, FWD Left, Rear Fwd, and Rear Aft, unlike the Airbus configurations."
  },
  {
    "question": "<div class=\"question\">What is the consequence of a sandwich wrapper being left on the ramp?</div>",
    "options": ["It could dirty the aircraft", "It may distract ramp staff", "It could be sucked into a jet engine and cause millions in damage", "It can block drainage systems"],
    "answer_index": 2,
    "explanation": "Even a sandwich wrapper can be sucked into a jet engine, potentially causing severe damage and costly repairs."
  },
  {
    "question": "<div class=\"question\">Why are cones removed when wind exceeds 25 knots?</div>",
    "options": ["They block emergency exits", "They can become projectiles and pose danger", "They interfere with radio signals", "They lose visibility"],
    "answer_index": 1,
    "explanation": "Cones are removed in high winds to prevent them from being blown into aircraft or people, causing serious hazards."
  },
  {
    "question": "<div class=\"question\">Which of the following is not a valid reason to delay approaching an aircraft?</div>",
    "options": ["ACB is still on", "Chocks are not placed", "Engineer has not given the thumbs-up", "Passenger boarding completed"],
    "answer_index": 3,
    "explanation": "Passenger boarding status is not a safety indicator for approaching the aircraft—ACB, chocks, and engineer clearance are critical."
  },
  {
    "question": "<div class=\"question\">What total number of chocks is required for an Airbus A320 during high wind conditions?</div>",
    "options": ["10", "12", "8", "14"],
    "answer_index": 1,
    "explanation": "The Airbus A320 requires 12 chocks during wind speeds over 25 knots—4 extra from the normal 8."
  },
  {
    "question": "<div class=\"question\">What unique structural trait helps identify the A321 compared to A320?</div>",
    "options": ["It has propellers", "It has more lavatories", "It has 6 doors and 5 compartments", "It has a larger cockpit"],
    "answer_index": 2,
    "explanation": "The A321 is 7 meters longer and has 6 doors and 5 cargo compartments, compared to the A320's 4 doors and 4 compartments."
  },
  {
    "question": "<div class=\"question\">What should be done if a FOD bin is missing from a bay area?</div>",
    "options": ["Report to flight crew", "Store FOD in personal kit temporarily", "Use the FOD bin in the passenger ramp", "Leave FOD near aircraft until a bin arrives"],
    "answer_index": 2,
    "explanation": "If the FOD bin is missing from the bay, the ramp crew is instructed to use the one available at the passenger ramp."
  },
  {
    "question": "<div class=\"question\">Which component powers the aircraft systems in Hotel Mode?</div>",
    "options": ["GPU", "Battery", "Main engine", "APU"],
    "answer_index": 2,
    "explanation": "The ATR doesn't have APU (Auxiliary Power Unit), hence it relies on Engine no:2  to power the aircraft's electrical and air systems with propellers  on brake."
  },
{
  "question": "<div class=\"question\">You see an unsafe work practice on the ramp or in the terminal. What should you do?<span class=\"asked-in\"></span></div>",
  "options": ["Report to MOD on shift", "Report to Safety", "Ignore it", "Both A and B"],
  "answer_index": 3,
  "explanation": "The correct action is to report the unsafe work practice to both Safety and the Manager on Duty (MOD). This ensures immediate action and proper documentation to maintain a safe working environment."
},
  {
    "question": "<div class=\"question\">Which of the following components is used by the aircraft for power when A/C engines are off and before connecting a GPU?</div>",
    "options": ["Main avionics", "External lights", "Own APU for power", "Landing gear"],
    "answer_index": 2,
    "explanation": "The aircraft uses its own APU for power, before GPU is connected. If a GPU is connected, the aircraft is drawing power externally."
  },
  {
    "question": "<div class=\"question\">Why is the A321’s door L4 used in 3-door operation instead of L2?</div>",
    "options": ["L2 is smaller", "To reduce crew workload", "A321 has L1,L3,L4 only on portside", "L2 is only for emergencies"],
    "answer_index": 2,
    "explanation": "The A321 is longer, and has L1,L3,L4 only on portside,  L2 does not exist."
  },
  {
    "question": "<div class=\"question\">What minimum distance must be kept behind an active aircraft engine to avoid jet blast danger?</div>",
    "options": ["45 meters", "60 meters", "20 meters", "5.79 meters"],
    "answer_index": 1,
    "explanation": "Jet blast can project debris and knock personnel over; thus, a 60-meter safety distance behind the engine is required."
  },

{
  "question": "<div class=\"question\">What is the most appropriate action if you find a Foreign Object Debris (FOD) on the ramp?<span class=\"asked-in\"></span></div>",
  "options": ["Report it to the nearest supervisor", "Kick it aside to clear the way", "Pick it up and dispose of it in the designated bin", "Ignore it unless it’s in the aircraft path"],
  "answer_index": 2,
  "explanation": "FOD must be picked up and disposed of in the designated FOD bin to prevent damage to aircraft and maintain safety on the ramp."
},
  {
    "question": "<div class=\"question\">How is Hotel Mode different from GPU usage in powering the ATR?</div>",
    "options": ["GPU powers avionics, APU powers hydraulics", "Hotel Mode uses power from Engine 2, GPU is external support", "GPU runs during takeoff", "There is no difference"],
    "answer_index": 1,
    "explanation": "Hotel Mode refers to the ATR using engine 2 to power systems; GPU provides external electrical power instead."
  },
{
    "question": "Why must the head of Human Remains (HUM) face the nose of the aircraft during loading?",
    "options": [
      "To align with airflow and reduce drag",
      "To prevent shifting during turbulence",
      "To maintain dignity and allow bodily fluids to settle away from the head due to aircraft tilt",
      "To ensure proximity to cockpit in emergencies"
    ],
    "answer_index": 2,
    "explanation": "Facing the head toward the nose respects the deceased and accounts for gravity, as the aircraft’s nose is elevated during flight."
  },
  {
    "question": "What distinguishes the Final Loading column in a Load Instruction Report (LIR)?",
    "options": [
      "It is a summary of fuel calculations",
      "It reflects the confirmed load after check-in closes",
      "It only lists passenger numbers",
      "It shows planned cargo before check-in begins"
    ],
    "answer_index": 1,
    "explanation": "Final Loading confirms what has actually been loaded onto the aircraft post check-in, serving as the final cargo record."
  },
  {
    "question": "What immediate action should be taken upon spotting a vehicle parked under an aerobridge?",
    "options": [
      "Move it manually if possible",
      "Inform the PSHD team for follow-up",
      "Notify the Agile team and Safety for removal and documentation",
      "Report it to the airline’s finance department"
    ],
    "answer_index": 2,
    "explanation": "Ramp staff must report vehicles parked under the aerobridge to the Agile team and Safety for quick removal to prevent operational delays or damage."
  },
{
  "question": "<div class=\"question\">Who is responsible for ensuring that Personal Protective Equipment (PPE) is worn correctly on the ramp?<span class=\"asked-in\"></span></div>",
  "options": ["The safety department", "Only the supervisor", "Each individual employee", "The airport authority"],
  "answer_index": 2,
  "explanation": "Each employee is responsible for wearing their PPE correctly to maintain their own safety and comply with regulations."
},
  {
    "question": "What operational response is required at wind speeds of 25–39 knots according to the wind chart?",
    "options": [
      "Shut down all operations",
      "Cease aircraft movement",
      "Secure loose items on the ramp",
      "Evacuate the area immediately"
    ],
    "answer_index": 2,
    "explanation": "At 25–39 knots, loose items must be secured to prevent them from becoming dangerous projectiles in the wind."
  },
  
{
  "question": "<div class=\"question\">For which aircraft is the loading sequence from forward to aft?<span class=\"asked-in\"></span></div>",
  "options": ["ATR", "Airbus A320", "Airbus A321", "All of the above"],
  "answer_index": 3,
  "explanation": "The loading sequence from forward to aft applies to all of the listed aircraft—ATR, Airbus A320, and Airbus A321—to ensure proper weight and balance during loading."
},
  {
    "question": "What is a key procedural difference between Planned Loading and Final Loading in the LIR?",
    "options": [
      "Planned Loading is theoretical; Final Loading is verified and actual",
      "Final Loading includes outbound crew luggage",
      "Planned Loading is optional; Final Loading is not used operationally",
      "Final Loading includes load from the arrival leg"
    ],
    "answer_index": 0,
    "explanation": "Planned Loading is what is intended to go onboard, while Final Loading confirms what physically made it onto the aircraft."
  },
   {
  "question": "<div class=\"question\">What is the difference in wingspan between an Airbus A320 with sharklets and one with winglets?<span class=\"asked-in\"></span></div>",
  "options": ["0.85 meters", "2.00 meters", "1.70 meters", "3.20 meters"],
  "answer_index": 2,
  "explanation": "The Airbus A320 with sharklets has a wingspan that is 1.70 meters wider than the version with standard winglets. Sharklets improve aerodynamic efficiency and fuel savings."
},
{
  "question": "<div class=\"question\">What is the correct action to take during an emergency on the ramp?<span class=\"asked-in\"></span></div>",
  "options": ["Continue working unless instructed otherwise", "Evacuate the area immediately without informing anyone", "Wait for the supervisor’s announcement", "Stop work safely and follow emergency procedures or instructions from the supervisor"],
  "answer_index": 3,
  "explanation": "During an emergency on the ramp, you must stop work safely and follow emergency procedures or instructions from your supervisor. Immediate and correct response is critical to ensure safety."
},
{
    "question": "<div class=\"question\">Which item is NOT listed as part of the required Personal Protective Equipment (PPE) before an airside visit?</div>",
    "options": [
      "Ear plugs",
      "Ramp Safety Jacket",
      "Safety goggles",
      "Rain Boots"
    ],
    "answer_index": 2,
    "explanation": "The module lists ramp safety jacket, ramp safety shoe, ear plugs, safety gloves, cap, face shield, rainwear, and rain boots, but does not mention safety goggles."
  },
 {
  "question": "<div class=\"question\">Which of the following is a correct statement about the ATR aircraft?<span class=\"asked-in\"></span></div>",
  "options": ["The ATR A/C doesn't have seat 1A and 1C.", "The ATR A/C accept stretcher(STCR) customers with charges.", "The ATR A/C accept HUM.", "The ATR accepts weapons."],
  "answer_index": 0,
  "explanation": "The ATR typically does not have seats labeled 1A and 1C due to its seating configuration. This is a distinguishing feature of this regional turboprop aircraft."
},
  {
    "question": "<div class=\"question\">According to the notes, which of the following is a DON’T at the airside?</div>",
    "options": [
      "Use hand signals when needed",
      "Walk under aerobridges when they are in motion",
      "Report hazards or unsafe behavior immediately",
      "Be alert to aircraft and equipment movement"
    ],
    "answer_index": 1,
    "explanation": "Walking under aerobridges when they are in motion is explicitly listed as a ‘Don’t’ for airside safety."
  },
{
  "question": "<div class=\"question\"> During day time, if a wing walker sees an obstruction on the bay as the aircraft approaches, what should they do?<span class=\"asked-in\"></span></div>",
  "options": ["Red wand down", "Red wand up", "Red Baton up", "Red Baton down"],
  "answer_index": 2,
  "explanation": "When a wing walker sees an obstruction, they should raise the red baton straight up to stop A/C immediately and prevent a collision or unsafe condition."
},
{
  "question": "<div class=\"question\">What precautions should be taken while aircraft fueling is in progress?<span class=\"asked-in\"></span></div>",
  "options": ["Operate all electronic equipment freely", "Allow customers to come outside the A/C and click photos with Flight Managers permission", "Ensure no smoking or use of mobile phones near the fueling zone", "Perform maintenance activities near the fuel truck"],
  "answer_index": 2,
  "explanation": "During fueling, it's critical to ensure that there is no smoking, no use of mobile phones, and that all ignition sources are controlled. These precautions prevent potential fire or explosion hazards."
},

{
  "question": "<div class=\"question\">What is the safety gap required between the BFL and the aircraft?<span class=\"asked-in\"></span></div>",
  "options": ["2 inches", "4 inches", "1 inch", "3 inches"],
  "answer_index": 0,
  "explanation": "The safety gap between the BFL and the aircraft should be 2 inches to ensure safe clearance during boarding and loading operations."
},
  {
    "question": "<div class=\"question\">What does the red color marking on the ramp signify?</div>",
    "options": [
      "Service roads with speed limits",
      "Equipment Restraint Area (ERA) and No Standing No Parking zones",
      "Taxiway center lines and stop points",
      "Restricted/Hazardous Zones like fuel stations"
    ],
    "answer_index": 1,
    "explanation": "Red marks Equipment Restraint Areas, Tail Clearance Lines, and No Parking/No Standing Zones such as under the aerobridge."
  },
  {
    "question": "<div class=\"question\">What is the maximum speed limit allowed near the perimeter wall on the ramp?</div>",
    "options": [
      "15 km/h",
      "5 km/h",
      "30 km/h",
      "No Speed limit as its perimeter wall"
    ],
    "answer_index": 2,
    "explanation": "The speed limit near the perimeter wall is 30 km/h, allowing a slightly faster speed compared to service roads."
  },
{
    "question": "<div class=\"question\">What is the primary function of the TUG in airside operations?</div>",
    "options": [
      "It transports passengers between terminal and aircraft",
      "It moves luggage and cargo onto planes",
      "It pushes or pulls aircraft and moves trolleys",
      "It provides power to the plane when engines are off"
    ],
    "answer_index": 2,
    "explanation": "The TUG acts like a tow truck for planes, pushing or pulling them to gates or runways, and also moves trolleys."
  },
  {
    "question": "<div class=\"question\">Why is standing inside a moving aerobridge prohibited?</div>",
    "options": [
      "It is a restricted area with hazardous materials",
      "It is like standing on a moving conveyor belt headed to an airplane, which is unsafe",
      "It interferes with passenger boarding",
      "It causes damage to the aerobridge equipment"
    ],
    "answer_index": 1,
    "explanation": "The instructor compares it to standing on a moving conveyor belt aimed at a plane, making it a dangerous and forbidden zone."
  },
  {
    "question": "<div class=\"question\">What is the correct 'no-touch' distance to maintain from the aircraft door when using the passenger ramp?</div>",
    "options": [
      "2 inches away and 7 inches below the door",
      "5 inches away and 3 inches below the door",
      "3 feet away and 2 feet below the door",
      "No specific distance needed"
    ],
    "answer_index": 0,
    "explanation": "The 'no-touch' policy requires keeping a 2-inch gap away from the door and 7 inches below it to avoid damaging the aircraft."
  },
  {
    "question": "<div class=\"question\">What is the role of a Wing Walker during aircraft pushback?</div>",
    "options": [
      "Guiding passengers safely onto the aircraft",
      "Operating the aircraft’s engines remotely",
      "Keeping 1 meter away from the wingtip and guiding the aircraft to avoid obstacles",
      "Refueling the aircraft before departure"
    ],
    "answer_index": 2,
    "explanation": "The Wing Walker acts as the eyes and ears on the ground, staying 1 meter from the wingtip and ensuring the plane doesn’t hit obstacles."
  },
{
  "question": "<div class=\"question\">Whose approval should an employee take before using a fire extinguisher at airside?<span class=\"asked-in\"></span></div>",
  "options": ["Fire safety officer", "Supervisor on duty", "No approval needed", "Airport security"],
  "answer_index": 2,
  "explanation": "In case of fire emergencies at airside, employees do not need prior approval to use a fire extinguisher. Immediate action is critical to safety."
},

{
    "question": "<div class=\"question\">What distinguishes a Pushback Bay from a Power Out Bay in aircraft parking?</div>",
    "options": [
      "Pushback Bay requires a tug to move the plane, Power Out Bay allows the plane to move on its own power",
      "Pushback Bay is only for cargo planes, Power Out Bay is for passenger planes",
      "Power Out Bay uses wing walkers, Pushback Bay does not",
      "Power Out Bay requires marshaller signals, Pushback Bay does not"
    ],
    "answer_index": 0,
    "explanation": "The Pushback Bay involves moving the plane using a tug, whereas in the Power Out Bay the aircraft taxis out under its own power."
  },
  {
    "question": "<div class=\"question\">When taxiing out from a Power Out Bay, to whom should the wing-walking signal be given?</div>",
    "options": [
      "The marshaller",
      "The air traffic controller",
      "The cockpit crew",
      "The ground engineer"
    ],
    "answer_index": 2,
    "explanation": "In the Power Out Bay, wing-walking signals are communicated to the cockpit crew to ensure safe taxiing."
  },
  {
    "question": "<div class=\"question\">What is the main purpose of the Visual Docking Guidance System (VDGS)?</div>",
    "options": [
      "To remotely control aircraft engines during parking",
      "To provide visual guidance to pilots for precise aircraft parking",
      "To monitor weather conditions on the tarmac",
      "To manage baggage loading automatically"
    ],
    "answer_index": 1,
    "explanation": "VDGS acts like a GPS for aircraft on the ground, helping pilots park exactly in the designated spot."
  },
  {
    "question": "<div class=\"question\">Who is positioned next to the emergency stop button during VDGS operation?</div>",
    "options": [
      "The aircraft captain",
      "The marshaller",
      "The Flight Manager",
      "Apron Controller"
    ],
    "answer_index": 1,
    "explanation": "The marshaller stands beside the emergency stop button during VDGS operation to halt movement if necessary."
  },
  {
    "question": "<div class=\"question\">Which activity is NOT part of the Arrival Activities checklist?</div>",
    "options": [
      "Reporting ETA-15 with flight details",
      "Attending team briefing by Flight Manager",
      "Performing baggage loading for departure",
      "Conducting equipment serviceability and FOD checks"
    ],
    "answer_index": 2,
    "explanation": "Baggage loading for departure is not listed in arrival activities; arrival activities focus on ETA reporting, briefings, and checks."
  },
  {
    "question": "<div class=\"question\">What is a 'bay' in airside terminology?</div>",
    "options": [
      "A parking spot for a single aircraft",
      "The area where planes take off",
      "The public area for passenger check-in",
      "A road for ground vehicles"
    ],
    "answer_index": 0,
    "explanation": "A bay is a designated parking spot where a single aircraft parks for loading, unloading, and refueling."
  },
  {
    "question": "<div class=\"question\">What does the 'apron' refer to in aviation?</div>",
    "options": [
      "The runway for takeoff and landing",
      "The combined area of multiple aircraft bays where planes park and prepare",
      "The public arrivals area",
      "The airport's perimeter wall"
    ],
    "answer_index": 1,
    "explanation": "The apron is the combined area comprising several bays, where aircraft park, get fueled, and prepare for takeoff."
  },
  {
    "question": "<div class=\"question\">What is the Equipment Restraint Area (ERA)?</div>",
    "options": [
      "An area where only certain ground equipment is allowed and must be parked neatly outside the ERA.",
      "The runway for aircraft landing",
      "The passenger boarding bridge",
      "A public waiting zone"
    ],
    "answer_index": 0,
    "explanation": "ERA is a designated zone for specific ground equipment to park safely and orderly,outside the ERA, in normal weather conditions."
  },
  {
    "question": "<div class=\"question\">Where is BFL switched on?</div>",
    "options": [
      "Inside ERA",
      "Outside ERA",
      "Both A & B",
      "IndiGo has discontinued using BFL at airside"
    ],
    "answer_index": 1,
    "explanation": "BFL should be switched on outside the ERA, as activating it near the holds can allow smoke to enter holds. This may trigger the ceiling-mounted smoke detectors and cause a false fire warning on the flight deck."
  },
  {
    "question": "<div class=\"question\">What color marks the service road and what is the speed limit for any vehicles used by ground crew?</div>",
    "options": [
      "Yellow and 5 kmph",
      "Red and no speed limit",
      "White and 15 kmph",
      "Blue and 30 kmph"
    ],
    "answer_index": 2,
    "explanation": "The service road  is marked with white color lines and speed limit is limited to 15 kmph for support vehicles."
  },
 
   {
    "question": "<div class=\"question\">Why are wing walkers necessary during aircraft parking despite the presence of yellow center lines?</div>",
    "options": [
      "Because planes have no side mirrors and wing walkers ensure wings don't hit obstacles",
      "Because yellow lines can be hard to see",
      "Because wing walkers manage the aircraft's speed",
      "Because wing walkers communicate with air traffic control"
    ],
    "answer_index": 0,
    "explanation": "Wing walkers act as extra eyes to watch for obstacles and prevent wing damage since planes lack side mirrors."
  },
  {
    "question": "<div class=\"question\">What is the 'safety diamond' around an aircraft?</div>",
    "options": [
      "An imaginary zone around the plane marked by cones at nose, tail, and wings where speed is limited",
      "A diamond-shaped parking bay for VIP aircraft",
      "The pattern ground vehicles follow around the apron",
      "A decorative lighting arrangement on the aircraft"
    ],
    "answer_index": 0,
    "explanation": "The safety diamond is a cone-marked area around the aircraft where vehicles must move slowly (5 kmph) to maintain safety."
  },
  {
    "question": "<div class=\"question\">What is the main difference between 'airside' and 'landside' in an airport?</div>",
    "options": [
      "Airside is where planes park and move; landside is the public passenger area",
      "Airside is inside the terminal; landside is outside",
      "Airside is for baggage handling; landside is for fueling",
      "Airside is for cargo; landside is for passengers"
    ],
    "answer_index": 0,
    "explanation": "Airside refers to operational areas like bays, aprons, and taxiways, while landside covers public areas like check-in and arrivals."
  },

  {
    "question": "<div class=\"question\">Can Water cart and Toilet cart be handled by same Agile Partner in a particular shift?</div>",
    "options": [
      "With approval from Flight Manager",
      "Yes, no approval required",
      "NO",
      "With approval from Agile Team Leader"
    ],
    "answer_index": 2,
    "explanation": "Due to safety reasons, Water cart and Toilet cart are handeled by different Agile Staff in same shift."
  }


  ];

  // Helper to get current username
  function getCurrentUser() {
    return localStorage.getItem('user') || 'guest';
  }

  // Get attempts for current user
  function getUserAttempts() {
    const user = getCurrentUser();
    return parseInt(localStorage.getItem(`attempts_${user}`) || "0", 10);
  }

  // Set attempts for current user
  function setUserAttempts(count) {
    const user = getCurrentUser();
    localStorage.setItem(`attempts_${user}`, count.toString());
  }

  // Sound toggle function
  window.toggleSound = function () {
    soundEnabled = !soundEnabled;
    correctSound.muted = !soundEnabled;
    wrongSound.muted = !soundEnabled;
    document.getElementById("sound-icon").textContent = soundEnabled ? "🔊" : "🔇";
    document.getElementById("sound-text").textContent = soundEnabled ? "Sound ON" : "Sound OFF";
  };

  function renderQuestion(index) {
    clearInterval(timerInterval);
    alertElement.style.display = "none";

    const q = quizData[index];
    container.innerHTML = `
      <div class="card">
        <div class="header"><div class="timer green" id="timer"></div></div>
        <div class="question">${q.question}</div>
        <div class="options">
          ${q.options.map((opt, i) => `
            <label>
              <input type="radio" name="option" value="${i}">
              ${opt}
            </label>`).join("")}
        </div>
        <button class="btn" id="submit-btn">Submit</button>
      </div>
    `;

    questionCounter.textContent = `Q ${index + 1} / ${quizData.length}`;
    document.getElementById("submit-btn").onclick = () => submitAnswer(index);

    progressBar.style.width = `${(index / quizData.length) * 100}%`;

    startButton.style.display = "none"; // HIDE Home Page button on question pages
    startTimer();
  }

  function submitAnswer(index) {
    if (answeredQuestions[index] === true) return; // Already answered

    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) return; // No option selected

    document.getElementById("submit-btn").disabled = true;
    clearInterval(timerInterval);
    alertElement.style.display = "none";

    const correctIndex = quizData[index].answer_index;
    const allOptions = document.querySelectorAll('input[name="option"]');
    allOptions.forEach(opt => opt.disabled = true);

    const selectedLabel = selected.closest("label");
    const correctLabel = allOptions[correctIndex].closest("label");
    const isCorrect = parseInt(selected.value, 10) === correctIndex;

    if (isCorrect) {
      score++;
      selectedLabel.classList.add("correct");
      answeredQuestions[index] = true;
    } else {
      selectedLabel.classList.add("wrong");
      correctLabel.classList.add("correct");
      answeredQuestions[index] = {
        userAnswer: parseInt(selected.value, 10),
        correctAnswer: correctIndex
      };
    }

    showResult(isCorrect);

    const explanation = quizData[index].explanation;
    const card = document.querySelector(".card");

    const explanationDiv = document.createElement("div");
    explanationDiv.className = "explanation";
    explanationDiv.textContent = `Explanation: ${explanation}`;

    const nextButton = document.createElement("button");
    nextButton.className = "btn";
    nextButton.textContent = currentIndex + 1 < quizData.length ? "Next Question" : "Finish Quiz";
    nextButton.onclick = () => {
      currentIndex++;
      if (currentIndex < quizData.length) {
        renderQuestion(currentIndex);
      } else {
        endQuiz();
      }
    };

    card.appendChild(explanationDiv);
    card.appendChild(nextButton);
    explanationDiv.scrollIntoView({ behavior: "smooth", block: "start" });

    // Update progress bar on answer submit
    progressBar.style.width = `${((currentIndex + 1) / quizData.length) * 100}%`;
  }

  function startTimer() {
    let remainingTime = 60;
    const timer = document.getElementById("timer");
    timer.textContent = `Time: ${remainingTime}s`;
    timer.className = "timer green";
    alertElement.style.display = "none";

    timerInterval = setInterval(() => {
      remainingTime--;
      timer.textContent = `Time: ${remainingTime}s`;

      if (remainingTime <= 10) {
        timer.className = "timer red";
        if (container.style.display === "block") alertElement.style.display = "block";
      } else {
        alertElement.style.display = "none";
      }

      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        alertElement.style.display = "none";

        const selected = document.querySelector('input[name="option"]:checked');
        if (!selected) {
          // No option selected and timer expired
          // Mark as unanswered but DO NOT highlight any answer
          answeredQuestions[currentIndex] = {
            userAnswer: null,
            correctAnswer: quizData[currentIndex].answer_index
          };

          // Automatically move to next question or end quiz
          currentIndex++;
          if (currentIndex < quizData.length) {
            renderQuestion(currentIndex);
          } else {
            endQuiz();
          }
        } else {
          // If user selected an option at last moment, submit answer normally
          submitAnswer(currentIndex);
        }
      }
    }, 1000);
  }

  function showResult(correct) {
    const sound = correct ? correctSound : wrongSound;
    sound.currentTime = 0;
    if (soundEnabled) sound.play();

    if (correct) {
      triggerConfetti();
      setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
      }, 2400);
    }
  }

  const triggerConfetti = throttle(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ff0', '#ff5c5c', '#5c5cff', '#4caf50']
    });
  }, 1000);

  function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return fn(...args);
      }
    };
  }

  // Start quiz - reset and show first question with attempt check
  window.startQuiz = function () {
    const attempts = getUserAttempts();

    if (attempts >= 4) {
      alert("You have used all 4 attempts. The quiz is now locked and you cannot try again.");
      return;
    }

    alert(`Attempt ${attempts + 1} of 4. You have ${4 - attempts} attempts remaining.`);

    score = 0;
    currentIndex = 0;
    answeredQuestions = new Array(quizData.length).fill(false);

    scoreContainer.innerHTML = "";
    container.style.display = "block";
    alertElement.style.display = "none";
    startButton.style.display = "none"; // hide start/home button on quiz start
    questionCounter.textContent = `Q 1 / ${quizData.length}`;
    progressBar.style.width = "0%";

    renderQuestion(currentIndex);
    startTime = Date.now();
  };

  // End quiz - show results and history buttons
  function endQuiz() {
    clearInterval(timerInterval);
    alertElement.style.display = "none";

    const totalQuestions = quizData.length;
    const percentage = ((score / totalQuestions) * 100).toFixed(1);

    const passed = percentage >= 90;  // 90% pass mark

    // Increase attempt count only if user did not pass
    if (!passed) {
      let attempts = getUserAttempts();
      attempts++;
      setUserAttempts(attempts);
    }

    const attempts = getUserAttempts();

    let failMessage = "";
    if (!passed) {
      const failMessages = [
        "You didn’t reach the passing score of 90%. Review your answers and try again",
        "We know it’s tough, but don’t give up. You’re closer than you think—what matters is that you’re trying. And trying leads to success.",
        "Not a pass yet, but every attempt sharpens your skills. Keep at it!",
        "This time didn’t go your way, but your effort matters—and it’s noticed. You're learning with every step forward."
      ];
      failMessage = failMessages[Math.min(attempts - 1, failMessages.length - 1)];
    }

    scoreContainer.innerHTML = `
      <div class="highlight-latest-result">🎉 You scored ${score} / ${totalQuestions} (${percentage}%)</div>
      <div style="font-weight:bold; font-size:1.2em; margin: 10px auto 20px auto; color: ${passed ? 'green' : 'red'}; text-align: center; width: fit-content;">
        ${passed ? "🎉 Congratulations, You Passed!" : failMessage}
      </div>

      <div class="score-display">
        <p>Your Score: ${score} out of ${totalQuestions}</p>
        <p>Percentage: ${percentage}%</p>
        <p>Time Taken: ${Math.floor((Date.now() - startTime) / 1000)} seconds</p>
        <div class="history-actions">
          <button class="btn" onclick="viewHistory()">📖 View History</button>
          <button class="btn" onclick="restartQuiz()">🔄 Restart Quiz</button>
          <button class="btn" onclick="viewIncorrectAnswers()">❌ View Incorrect Answers</button>
          <button class="btn" onclick="generatePDF()">📄 Download History (PDF)</button>
        </div>
      </div>
    `;

    container.style.display = "none";
    progressBar.style.width = "100%";

    saveScore(score, totalQuestions);
    markQuizAsPassedIfEligible(score, totalQuestions);

    startButton.style.display = "block";
    startButton.textContent = "Home Page";
    startButton.style.margin = "20px auto";
    startButton.style.width = "fit-content";
    startButton.onclick = () => {
      window.location.href = "index.html";
    };
  }

  // Restart quiz, but check attempts first
  window.restartQuiz = function () {
    const attempts = getUserAttempts();
    if (attempts >= 4) {
      alert("You have used all 4 attempts. The quiz is now locked and you cannot try again.");
      return;
    }
    startQuiz();
  };

  // Save user score to localStorage for history
  function saveScore(score, totalQuestions) {
    const user = getCurrentUser();
    let history = JSON.parse(localStorage.getItem(`history_${user}`) || "[]");

    history.push({
      date: new Date().toISOString(),
      score,
      total: totalQuestions,
      timeTaken: Math.floor((Date.now() - startTime) / 1000)
    });

    localStorage.setItem(`history_${user}`, JSON.stringify(history));
  }

  // Mark quiz as passed if score >= 90% for current user
  function markQuizAsPassedIfEligible(score, total) {
    const user = getCurrentUser();
    if ((score / total) >= 0.9) {
      localStorage.setItem(`passed_${user}`, "true");
    }
  }

  // View history popup or alert (simplified)
  window.viewHistory = function () {
    const user = getCurrentUser();
    const history = JSON.parse(localStorage.getItem(`history_${user}`) || "[]");

    if (!history.length) {
      alert("No history available.");
      return;
    }

    let msg = "Your Quiz History:\n";
    history.forEach((h, i) => {
      msg += `${i + 1}. Date: ${new Date(h.date).toLocaleString()}, Score: ${h.score}/${h.total}, Time: ${h.timeTaken}s\n`;
    });

    alert(msg);
  };

  // View incorrect answers (simplified alert)
 window.viewIncorrectAnswers = function () {
  function stripHtml(html) {
    let tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  let msg = "Incorrect Answers:\n";

  answeredQuestions.forEach((ans, idx) => {
    if (ans && ans !== true) {
      const q = quizData[idx];
      msg += `Q${idx + 1}: ${stripHtml(q.question)}\nYour Answer: ${q.options[ans.userAnswer] || "No Answer"}\nCorrect Answer: ${q.options[ans.correctAnswer]}\n\n`;
    }
  });

  if (msg === "Incorrect Answers:\n") msg = "No incorrect answers to show.";

  alert(msg);
};


  // Generate PDF from history (simplified)
  window.generatePDF = function () {
    const user = getCurrentUser();
    const history = JSON.parse(localStorage.getItem(`history_${user}`) || "[]");
    if (!history.length) {
      alert("No history available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Quiz History", 10, 10);

    let y = 20;
    history.forEach((h, i) => {
      const line = `${i + 1}. Date: ${new Date(h.date).toLocaleString()}, Score: ${h.score}/${h.total}, Time: ${h.timeTaken}s`;
      doc.text(line, 10, y);
      y += 10;
    });

    doc.save("quiz-history.pdf");
  };

  // Initially hide quiz container
  container.style.display = "none";
  alertElement.style.display = "none";

  // Setup start button click
  startButton.onclick = startQuiz;

  // Initialize sound icon and text
  document.getElementById("sound-icon").textContent = "🔊";
  document.getElementById("sound-text").textContent = "Sound ON";
});
