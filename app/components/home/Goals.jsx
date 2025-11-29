// /app/components/home/Goals.jsx
"use client";

import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router";

/**
 * Single-file multi-step Goals component.
 * - Preserves your original styling & background
 * - Uses Hydrogen / Remix useSearchParams()
 * - Saves answers to localStorage under "onboarding_v1"
 * - No scroll-jump
 */

/* ---------- localStorage helpers ---------- */
const STORAGE_KEY = "onboarding_v1";
function loadSaved() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveKey(k, v) {
  if (typeof window === "undefined") return;
  const cur = loadSaved();
  cur[k] = v;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cur));
}

/* ---------- UI primitives (match your look) ---------- */
const Title = ({children}) => (
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight text-center">
    {children}
  </h1>
);
const Subtitle = ({children}) => (
  <p className="text-lg text-gray-600 font-medium text-center mb-8">{children}</p>
);
const ContinueButton = ({disabled, onClick}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-200 ${
      disabled
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
    }`}
  >
    Continue
  </button>
);
const OptionCard = ({selected, children, onClick}) => (
  <label
    onClick={onClick}
    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
      selected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
    }`}
  >
    <div
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-200 ${
        selected ? "border-purple-500 bg-purple-500" : "border-gray-400"
      }`}
    >
      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
    <span className="text-lg text-gray-800 font-medium">{children}</span>
  </label>
);

/* ---------- Steps Implementation (complete but compact) ---------- */

/* Step 1: Intro / Get Started */
function S1({go}) {
  return (
    <>
      <Title>Explore <span className="text-purple-600">weight loss</span> plan</Title>
      <Subtitle>Learn about treatment options based on your goals, habits, and health history.</Subtitle>
      <ContinueButton onClick={() => go(2)} />
    </>
  );
}

/* Step 2: Goals (your original UI exactly) */
function S2({go}) {
  const options = [
    { id: "lose-weight", label: "Lose weight gradually & safely" },
    { id: "curb-appetite", label: "Curb appetite & reduce cravings" },
    { id: "all-above", label: "All of the above" },
  ];
  const saved = loadSaved();
  const [selected, setSelected] = useState(saved.goal || "");

  useEffect(() => {
    // keep state from saved values
    if (saved.goal && !selected) setSelected(saved.goal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(id) {
    setSelected(id);
    saveKey("goal", id);
  }

  return (
    <>
      <Title>Reach your weight goals with expert care</Title>
      <Subtitle>Tell us your weight goals</Subtitle>

      <div className="space-y-4 mb-8 w-full mx-auto">
        {options.map(opt => (
          <OptionCard key={opt.id} selected={selected === opt.id} onClick={() => choose(opt.id)}>
            {opt.label}
          </OptionCard>
        ))}
      </div>

      <ContinueButton disabled={!selected} onClick={() => go(3)} />
    </>
  );
}

/* Step 3: Gender */
function S3({go, back}) {
  const saved = loadSaved();
  const [gender, setGender] = useState(saved.gender || "");

  return (
    <>
      <Title>Select your gender</Title>
      <Subtitle>This helps our medical team provide the most accurate recommendations and prescriptions.</Subtitle>

      <div className="mb-8">
        <select
          className="w-full border-2 p-4 rounded-lg"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select gender</option>
          <option>Female</option>
          <option>Male</option>
          <option>Prefer not to say</option>
        </select>
      </div>

      <ContinueButton disabled={!gender} onClick={() => { saveKey("gender", gender); go(4); }} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(2)}>Back</button>
    </>
  );
}

/* Step 4: DOB */
function S4({go, back}) {
  const saved = loadSaved();
  const [dob, setDob] = useState(saved.dob || "");

  return (
    <>
      <Title>Enter your date of birth</Title>
      <Subtitle>We ask for your date of birth to confirm eligibility for treatment and ensure safe medical review.</Subtitle>

      <div className="mb-8">
        <input
          type="date"
          className="w-full border-2 p-4 rounded-lg"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>

      <ContinueButton disabled={!dob} onClick={() => { saveKey("dob", dob); go(5); }} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(3)}>Back</button>
    </>
  );
}

/* Step 5: State select (simple but functional) */
function S5({go, back}) {
  const saved = loadSaved();
  const [state, setState] = useState(saved.state || "");

  return (
    <>
      <Title>Select the state you live</Title>
      <Subtitle>This state is where your medication will be shipped to, if prescribed.</Subtitle>

      <div className="mb-8">
        <select
          className="w-full border-2 p-4 rounded-lg"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          <option value="">Select state</option>
          <option>Arizona</option>
          <option>California</option>
          <option>Texas</option>
          <option>Florida</option>
          <option>New York</option>
        </select>
      </div>

      <ContinueButton disabled={!state} onClick={() => { saveKey("state", state); go(6); }} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(4)}>Back</button>
    </>
  );
}

/* Step 6: Goal details text area */
function S6({go, back}) {
  const saved = loadSaved();
  const [detail, setDetail] = useState(saved.goalDetail || "");

  return (
    <>
      <Title>Tell us a little more about your goal</Title>
      <Subtitle>Provide helpful context to tailor your plan.</Subtitle>

      <textarea
        className="w-full border-2 p-4 rounded-lg mb-8 min-h-[120px]"
        placeholder="e.g. I want to lose 30 lbs in 6 months, I have mild hypertension..."
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
      />

      <ContinueButton disabled={!detail} onClick={() => { saveKey("goalDetail", detail); go(7); }} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(5)}>Back</button>
    </>
  );
}

/* Step 7: Treatment plan summary (matching your screenshot) */
function S7({go, back}) {
  return (
    <>
      <Title>Your personalized treatment plan is ready</Title>
      <div className="border-2 rounded-lg p-6 mb-8 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-md" />
          <div>
            <h3 className="font-semibold">Ozempic® (Semaglutide) Treatment Plan</h3>
            <p className="text-sm text-gray-600 mt-1">A once-weekly GLP-1 medication that helps control appetite, reduce cravings, and support long-term weight management.</p>
          </div>
        </div>
      </div>

      <ContinueButton onClick={() => go(8)} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(6)}>Back</button>
    </>
  );
}

/* Step 8: Create account — includes the fields you requested earlier */
function S8({go, back}) {
  const saved = loadSaved();
  const account = saved.account || {};
  const [fullName, setFullName] = useState(account.fullName || "");
  const [email, setEmail] = useState(account.email || "");
  const [password, setPassword] = useState("");
  const [address1, setAddress1] = useState(account.address1 || "");
  const [address2, setAddress2] = useState(account.address2 || "");
  const [phone, setPhone] = useState(account.phone || "");
  const [zip, setZip] = useState(account.zip || "");
  const [dob, setDob] = useState(saved.dob || "");
  const [gender, setGender] = useState(saved.gender || "");

  function submit() {
    // Basic validation
    if (!fullName || !email || !password) {
      alert("Please fill name, email and password");
      return;
    }
    // Save minimal account object
    saveKey("account", { fullName, email, address1, address2, phone, zip });
    go(9);
  }

  return (
    <>
      <Title>Create my account</Title>
      <Subtitle>We’ll use this to manage your prescriptions and orders.</Subtitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input className="w-full border-2 p-3 rounded-lg" placeholder="Full Name" value={fullName} onChange={(e)=>setFullName(e.target.value)} />
        <input className="w-full border-2 p-3 rounded-lg" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border-2 p-3 rounded-lg" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <select className="w-full border-2 p-3 rounded-lg" value={gender} onChange={(e)=>setGender(e.target.value)}>
          <option value="">Gender</option>
          <option>Female</option>
          <option>Male</option>
        </select>
        <input className="col-span-1 md:col-span-2 w-full border-2 p-3 rounded-lg" placeholder="Address Line 1" value={address1} onChange={(e)=>setAddress1(e.target.value)} />
        <input className="col-span-1 md:col-span-2 w-full border-2 p-3 rounded-lg" placeholder="Address Line 2 (optional)" value={address2} onChange={(e)=>setAddress2(e.target.value)} />
        <input className="w-full border-2 p-3 rounded-lg" placeholder="Mobile Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <input className="w-full border-2 p-3 rounded-lg" placeholder="Zip Code" value={zip} onChange={(e)=>setZip(e.target.value)} />
      </div>

      <ContinueButton disabled={!fullName || !email || !password} onClick={submit} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(7)}>Back</button>
    </>
  );
}

/* Step 9: Medical questions (short set) */
function S9({go, back}) {
  const saved = loadSaved();
  const [smoke, setSmoke] = useState(saved.smoke || "");
  const [pregnant, setPregnant] = useState(saved.pregnant || "");

  function next() {
    saveKey("smoke", smoke);
    saveKey("pregnant", pregnant);
    go(10);
  }

  return (
    <>
      <Title>Medical questions</Title>
      <Subtitle>Quick screening questions used by clinicians.</Subtitle>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Do you currently smoke?</label>
          <select value={smoke} onChange={(e)=>setSmoke(e.target.value)} className="w-full border-2 p-3 rounded-lg">
            <option value="">Select</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Are you pregnant or planning pregnancy?</label>
          <select value={pregnant} onChange={(e)=>setPregnant(e.target.value)} className="w-full border-2 p-3 rounded-lg">
            <option value="">Select</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
      </div>

      <ContinueButton disabled={!smoke || !pregnant} onClick={next} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(8)}>Back</button>
    </>
  );
}

/* Step 10: Consent review */
function S10({go, back}) {
  const [accepted, setAccepted] = useState(false);
  return (
    <>
      <Title>Consent</Title>
      <Subtitle>Please review and accept our telehealth consent and privacy policy.</Subtitle>

      <div className="mb-8 text-sm text-gray-700">
        <p className="mb-4">By clicking Continue you accept our Terms & Telehealth Consent and Privacy Policy.</p>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={accepted} onChange={(e)=>setAccepted(e.target.checked)} />
          <span>I agree</span>
        </label>
      </div>

      <ContinueButton disabled={!accepted} onClick={() => go(11)} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(9)}>Back</button>
    </>
  );
}

/* Step 11: Shipping details (confirm address) */
function S11({go, back}) {
  const saved = loadSaved();
  const account = saved.account || {};
  const [address1, setAddress1] = useState(account.address1 || "");
  const [city, setCity] = useState(account.city || "");
  const [zip, setZip] = useState(account.zip || "");

  function nextSave() {
    saveKey("shipping", {address1, city, zip});
    go(12);
  }

  return (
    <>
      <Title>Shipping details</Title>
      <Subtitle>Where should your medication be shipped if prescribed?</Subtitle>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input className="border-2 p-3 rounded-lg" placeholder="Address line 1" value={address1} onChange={(e)=>setAddress1(e.target.value)} />
        <input className="border-2 p-3 rounded-lg" placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} />
        <input className="border-2 p-3 rounded-lg" placeholder="Zip code" value={zip} onChange={(e)=>setZip(e.target.value)} />
      </div>

      <ContinueButton disabled={!address1 || !city || !zip} onClick={nextSave} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(10)}>Back</button>
    </>
  );
}

/* Step 12: Review */
function S12({go, back}) {
  const saved = loadSaved();
  return (
    <>
      <Title>Review summary</Title>
      <Subtitle>Quick review of the main info you provided.</Subtitle>

      <div className="border-2 rounded-lg p-6 mb-8">
        <pre className="whitespace-pre-wrap text-sm text-gray-700">{JSON.stringify(saved, null, 2)}</pre>
      </div>

      <ContinueButton onClick={() => go(13)} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(11)}>Back</button>
    </>
  );
}

/* Step 13: Final confirm & submit */
function S13({go, back}) {
  return (
    <>
      <Title>You're all set!</Title>
      <Subtitle>Submit to finish — a clinician will review your responses.</Subtitle>

      <ContinueButton onClick={() => go(14)} />
      <button className="mt-4 w-full text-center text-sm underline text-gray-600" onClick={() => back(12)}>Back</button>
    </>
  );
}

/* Step 14: Complete */
function S14() {
  return (
    <>
      <Title>Done 🎉</Title>
      <Subtitle>Thanks — your information was saved and will be reviewed by a clinician.</Subtitle>
      <a href="/" className="block text-center w-full py-4 rounded-lg bg-black text-white">Return home</a>
    </>
  );
}

/* ---------- Main component (single-file) ---------- */
export default function Goals() {
  const [searchParams, setSearchParams] = useSearchParams();
  // ensure default step presence client-side
  useEffect(() => {
    if (!searchParams?.get?.("step")) {
      setSearchParams({step: "1"});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // safe getter
  function currentStep() {
    const s = Number(searchParams?.get?.("step") || "1");
    return Number.isFinite(s) && s >= 1 && s <= 14 ? s : 1;
  }
  const step = currentStep();

  function go(n) {
  const nn = Math.max(1, Math.min(14, Number(n)));
  setSearchParams(
    { step: String(nn) },
    { preventScrollReset: true }
  );
}

function back(n) {
  const nn = Math.max(1, Math.min(14, Number(n)));
  setSearchParams(
    { step: String(nn) },
    { preventScrollReset: true }
  );
}


  /* ---------- the outer section MUST match your original exactly ---------- */
  return (
    <section
      className="max-w-7xl mx-auto px-6 py-12 bg-white rounded-md mb-10"
      style={{
        backgroundImage:
          "url(https://cdn.shopify.com/s/files/1/2333/8415/files/gugu.png?v=1763378009)",
        backgroundSize: "100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "600px",
      }}
    >
      <div className="max-w-xl w-full">
      {/* Render only the current step content INSIDE the same container */}
      {step === 1 && <S1 go={go} />}
      {step === 2 && <S2 go={go} />}
      {step === 3 && <S3 go={go} back={back} />}
      {step === 4 && <S4 go={go} back={back} />}
      {step === 5 && <S5 go={go} back={back} />}
      {step === 6 && <S6 go={go} back={back} />}
      {step === 7 && <S7 go={go} back={back} />}
      {step === 8 && <S8 go={go} back={back} />}
      {step === 9 && <S9 go={go} back={back} />}
      {step === 10 && <S10 go={go} back={back} />}
      {step === 11 && <S11 go={go} back={back} />}
      {step === 12 && <S12 go={go} back={back} />}
      {step === 13 && <S13 go={go} back={back} />}
      {step === 14 && <S14 />}
      </div>
    </section>
  );
}
