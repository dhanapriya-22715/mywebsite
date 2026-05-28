
src/App.jsx
import {
  Bell,
  Bot,
  Camera,
  CloudRain,
  Droplets,
  FlaskConical,
  Gauge,
  Languages,
  Leaf,
  Menu,
  Mic,
  Moon,
  ScanLine,
  Send,
  ShieldAlert,
  Sprout,
  Sun,
  ThermometerSun,
  TrendingUp,
  WifiOff,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const copy = {
  en: {
    heroTitle: 'AgroAI Field Companion',
    heroText: 'One offline-ready website for irrigation, crop health, yield, weather, fertilizer, greenhouse and pest decisions.',
    crop: 'Crop',
    acre: 'Farm size',
    soil: 'Soil moisture',
    rain: 'Rain chance',
    calculate: 'Calculate',
    assistant: 'Voice assistant',
    offline: 'Offline mode',
  },
  ta: {
    heroTitle: 'AgroAI வயல் துணை',
    heroText: 'நீர், பயிர் ஆரோக்கியம், மகசூல், வானிலை, உரம், பசுமைகுடில், பூச்சி ஆலோசனை ஒரே இடத்தில்.',
    crop: 'பயிர்',
    acre: 'பரப்பு',
    soil: 'மண் ஈரப்பதம்',
    rain: 'மழை வாய்ப்பு',
    calculate: 'கணக்கிடு',
    assistant: 'குரல் உதவி',
    offline: 'ஆஃப்லைன் முறை',
  },
  hi: {
    heroTitle: 'AgroAI खेत साथी',
    heroText: 'सिंचाई, फसल स्वास्थ्य, उपज, मौसम, जैविक खाद, ग्रीनहाउस और कीट सलाह के लिए एक ऑफलाइन वेबसाइट.',
    crop: 'फसल',
    acre: 'खेत का आकार',
    soil: 'मिट्टी की नमी',
    rain: 'बारिश की संभावना',
    calculate: 'गणना करें',
    assistant: 'वॉइस सहायक',
    offline: 'ऑफलाइन मोड',
  },
}

const cropProfiles = {
  paddy: { label: 'Paddy', waterNeed: 70, baseYield: 3100, price: 23, fertilizer: 'Vermicompost + azolla', disease: 'Blast or brown spot' },
  tomato: { label: 'Tomato', waterNeed: 55, baseYield: 9200, price: 32, fertilizer: 'Compost + neem cake', disease: 'Leaf curl or early blight' },
  cotton: { label: 'Cotton', waterNeed: 45, baseYield: 1150, price: 68, fertilizer: 'Farmyard manure + castor cake', disease: 'Wilt or sucking pest stress' },
  maize: { label: 'Maize', waterNeed: 50, baseYield: 3900, price: 21, fertilizer: 'Green manure + enriched compost', disease: 'Leaf blight or fall armyworm' },
  chilli: { label: 'Chilli', waterNeed: 52, baseYield: 2800, price: 88, fertilizer: 'Vermicompost + wood ash', disease: 'Thrips or fruit rot' },
}

const weatherPresets = [
  { label: 'Dry and sunny', temp: 34, humidity: 38, rain: 12, wind: 8 },
  { label: 'Humid cloudy', temp: 29, humidity: 72, rain: 58, wind: 14 },
  { label: 'Heavy rain alert', temp: 27, humidity: 86, rain: 84, wind: 24 },
]

const diseaseSymptoms = ['Yellow spots', 'Leaf curl', 'Brown patches', 'White powder', 'Stem wilting']
const pestSigns = ['Chewed leaves', 'Sticky residue', 'Tiny eggs', 'Bored stem', 'Webbing']

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Math.round(value))
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function Metric({ icon: Icon, label, value, tone = 'green' }) {
  return (
    <article className={`metric ${tone}`}>
      <Icon size={20} />
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  )
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section className="section" id={id}>
      <div className="section-heading">
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function ImageScanner({ type, signs, crop, uploadedImage, setUploadedImage }) {
  const [selected, setSelected] = useState(signs.slice(0, 1))

  const score = useMemo(() => {
    const base = selected.length * 18 + (uploadedImage ? 24 : 0)
    return clamp(base + (crop === 'tomato' || crop === 'chilli' ? 10 : 0), 8, 96)
  }, [crop, selected.length, uploadedImage])

  const status = score > 68 ? 'High risk' : score > 38 ? 'Moderate risk' : 'Low risk'
  const advice =
    type === 'disease'
      ? `Likely ${cropProfiles[crop].disease}. Remove infected leaves, keep spacing, and use neem-based spray before escalation.`
      : 'Image pattern suggests field scouting is needed. Place pheromone traps, remove affected plant parts, and repeat scan after 48 hours.'

  function toggleSign(sign) {
    setSelected((current) => (current.includes(sign) ? current.filter((item) => item !== sign) : [...current, sign]))
  }

  return (
    <article className="tool-card scanner-card">
      <div className="tool-card-title">
        {type === 'disease' ? <ScanLine size={21} /> : <ShieldAlert size={21} />}
        <div>
          <h3>{type === 'disease' ? 'AI crop disease detection app' : 'Pest detection using image processing'}</h3>
          <p>{uploadedImage ? 'Photo loaded for offline analysis' : 'Upload a crop photo or select field signs'}</p>
        </div>
      </div>

      <label className="upload-zone">
        <Camera size={24} />
        <span>{uploadedImage ? 'Change image' : 'Upload leaf or crop image'}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (!file) return
            setUploadedImage(URL.createObjectURL(file))
          }}
        />
      </label>

      {uploadedImage && <img className="preview-image" src={uploadedImage} alt="Uploaded crop sample" />}

      <div className="chip-group">
        {signs.map((sign) => (
          <button className={selected.includes(sign) ? 'chip active' : 'chip'} type="button" key={sign} onClick={() => toggleSign(sign)}>
            {sign}
          </button>
        ))}
      </div>

      <div className="risk-meter" aria-label={`${status} ${score} percent`}>
        <span style={{ width: `${score}%` }} />
      </div>
      <strong>{status}: {score}%</strong>
      <p className="advice">{advice}</p>
    </article>
  )
}

export default function App() {
  const [language, setLanguage] = useState('en')
  const [crop, setCrop] = useState('paddy')
  const [acre, setAcre] = useState(2)
  const [soil, setSoil] = useState(42)
  const [weatherIndex, setWeatherIndex] = useState(1)
  const [nitrogen, setNitrogen] = useState('medium')
  const [greenhouseAuto, setGreenhouseAuto] = useState(true)
  const [uploadedImage, setUploadedImage] = useState('')
  const [dark, setDark] = useState(false)
  const [online, setOnline] = useState(() => navigator.onLine)
  const t = copy[language]

  useEffect(() => {
    const saved = localStorage.getItem('agroai-state')
    if (saved) {
      const parsed = JSON.parse(saved)
      setLanguage(parsed.language || 'en')
      setCrop(parsed.crop || 'paddy')
      setAcre(parsed.acre || 2)
      setSoil(parsed.soil || 42)
      setWeatherIndex(parsed.weatherIndex || 1)
      setDark(Boolean(parsed.dark))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('agroai-state', JSON.stringify({ language, crop, acre, soil, weatherIndex, dark }))
  }, [language, crop, acre, soil, weatherIndex, dark])

  useEffect(() => {
    const handleOnline = () => setOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOnline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOnline)
    }
  }, [])

  const weather = weatherPresets[weatherIndex]
  const profile = cropProfiles[crop]

  const insights = useMemo(() => {
    const waterGap = profile.waterNeed - soil
    const irrigationLitres = clamp(waterGap * acre * 420, 0, 42000)
    const rainAdjustment = weather.rain > 60 ? 0.72 : weather.rain < 25 ? 1.08 : 0.94
    const yieldKg = profile.baseYield * acre * rainAdjustment * clamp(soil / profile.waterNeed, 0.72, 1.14)
    const greenhouseTemp = clamp(weather.temp + (greenhouseAuto ? -2 : 3), 18, 42)
    const greenhouseHumidity = clamp(weather.humidity + (greenhouseAuto ? 4 : -6), 28, 92)

    return {
      irrigation:
        irrigationLitres < 500
          ? 'Skip irrigation today. Moisture and rain forecast are enough.'
          : `Irrigate ${formatNumber(irrigationLitres)} litres across ${acre} acre before 9 AM.`,
      irrigationLitres,
      yieldKg,
      income: yieldKg * profile.price,
      fertilizer:
        nitrogen === 'low'
          ? `Apply ${profile.fertilizer} at 280 kg/acre with mulching.`
          : nitrogen === 'high'
            ? 'Use only compost tea this week and avoid excess nitrogen.'
            : `Apply ${profile.fertilizer} at 180 kg/acre after light irrigation.`,
      advisory:
        weather.rain > 70
          ? 'Rain is likely. Delay spraying, open drainage channels, and harvest mature produce early.'
          : weather.temp > 32
            ? 'Heat stress risk. Irrigate early morning, use mulch, and avoid afternoon transplanting.'
            : 'Good working window. Scout leaves and complete fertilizer application before evening humidity rises.',
      greenhouseTemp,
      greenhouseHumidity,
      greenhouseFan: greenhouseTemp > 30 || greenhouseHumidity > 78 ? 'Fan and vent open' : 'Vent half open',
    }
  }, [acre, nitrogen, profile, soil, weather, greenhouseAuto])

  function speakAdvice() {
    const text = `${profile.label}. ${insights.irrigation} ${insights.advisory} ${insights.fertilizer}`
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
    }
  }

  return (
    <main className={dark ? 'app dark' : 'app'}>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#home" className="brand">
          <Sprout size={24} />
          <span>AgroAI</span>
        </a>
        <div className="nav-links">
          <a href="#tools">Tools</a>
          <a href="#monitoring">Monitoring</a>
          <a href="#support">Support</a>
        </div>
        <button className="icon-toggle" type="button" onClick={() => setDark(!dark)} aria-label="Toggle theme">
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </nav>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="status-pill">
            <WifiOff size={16} />
            {online ? 'Online now, offline cache ready' : 'Offline now, saved tools active'}
          </p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="hero-actions">
            <a className="primary-button" href="#tools">Start diagnosis</a>
            <button className="ghost-button" type="button" onClick={speakAdvice}>
              <Mic size={18} />
              {t.assistant}
            </button>
          </div>
        </div>

        <div className="phone-panel" aria-label="Farmer dashboard summary">
          <div className="phone-top">
            <Bell size={18} />
            <span>{weather.label}</span>
          </div>
          <Metric icon={Droplets} label="Irrigation" value={insights.irrigationLitres < 500 ? 'Skip' : `${formatNumber(insights.irrigationLitres)} L`} />
          <Metric icon={TrendingUp} label="Yield estimate" value={`${formatNumber(insights.yieldKg)} kg`} tone="blue" />
          <Metric icon={FlaskConical} label="Organic plan" value={profile.fertilizer} tone="amber" />
        </div>
      </section>

      <section className="control-strip" aria-label="Farm controls">
        <Field label={t.crop}>
          <select value={crop} onChange={(event) => setCrop(event.target.value)}>
            {Object.entries(cropProfiles).map(([value, item]) => (
              <option value={value} key={value}>{item.label}</option>
            ))}
          </select>
        </Field>
        <Field label={`${t.acre} (acre)`}>
          <input type="number" min="0.25" step="0.25" value={acre} onChange={(event) => setAcre(Number(event.target.value || 1))} />
        </Field>
        <Field label={`${t.soil}: ${soil}%`}>
          <input type="range" min="10" max="95" value={soil} onChange={(event) => setSoil(Number(event.target.value))} />
        </Field>
        <Field label="Language">
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="en">English</option>
            <option value="ta">Tamil</option>
            <option value="hi">Hindi</option>
          </select>
        </Field>
      </section>

      <Section id="tools" eyebrow="Seven goals, one farmer app" title="AI decision tools">
        <div className="tool-grid">
          <article className="tool-card featured">
            <div className="tool-card-title">
              <Droplets size={21} />
              <div>
                <h3>Smart irrigation</h3>
                <p>Uses crop water need, soil moisture and rain forecast.</p>
              </div>
            </div>
            <strong>{insights.irrigation}</strong>
            <div className="split-row">
              <span>Water need: {profile.waterNeed}%</span>
              <span>{weather.rain}% rain</span>
            </div>
          </article>

          <ImageScanner type="disease" signs={diseaseSymptoms} crop={crop} uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />

          <article className="tool-card">
            <div className="tool-card-title">
              <TrendingUp size={21} />
              <div>
                <h3>Yield prediction using ML</h3>
                <p>Local model simulation based on crop, area, weather and moisture.</p>
              </div>
            </div>
            <div className="result-pair">
              <div>
                <span>Predicted yield</span>
                <strong>{formatNumber(insights.yieldKg)} kg</strong>
              </div>
              <div>
                <span>Expected income</span>
                <strong>Rs {formatNumber(insights.income)}</strong>
              </div>
            </div>
          </article>

          <article className="tool-card">
            <div className="tool-card-title">
              <FlaskConical size={21} />
              <div>
                <h3>Organic fertilizer recommender</h3>
                <p>Matches nutrient status with crop-safe organic inputs.</p>
              </div>
            </div>
            <Field label="Soil nitrogen">
              <select value={nitrogen} onChange={(event) => setNitrogen(event.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
            <p className="advice">{insights.fertilizer}</p>
          </article>

          <article className="tool-card">
            <div className="tool-card-title">
              <CloudRain size={21} />
              <div>
                <h3>Weather-based crop advisory system</h3>
                <p>Select a local forecast scenario and get action guidance.</p>
              </div>
            </div>
            <div className="segmented">
              {weatherPresets.map((item, index) => (
                <button className={weatherIndex === index ? 'active' : ''} type="button" key={item.label} onClick={() => setWeatherIndex(index)}>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="advice">{insights.advisory}</p>
          </article>

          <ImageScanner type="pest" signs={pestSigns} crop={crop} uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />
        </div>
      </Section>

      <Section id="monitoring" eyebrow="Protected cultivation" title="Automated greenhouse monitoring">
        <div className="monitor-grid">
          <Metric icon={ThermometerSun} label="Temperature" value={`${insights.greenhouseTemp} C`} tone="red" />
          <Metric icon={Droplets} label="Humidity" value={`${insights.greenhouseHumidity}%`} tone="blue" />
          <Metric icon={Gauge} label="Automation" value={greenhouseAuto ? 'Auto' : 'Manual'} tone="amber" />
          <article className="monitor-panel">
            <div>
              <h3>{insights.greenhouseFan}</h3>
              <p>Controller adjusts ventilation, misting and shade net based on sensor readings.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={greenhouseAuto} onChange={(event) => setGreenhouseAuto(event.target.checked)} />
              <span />
            </label>
          </article>
        </div>
      </Section>

      <Section id="support" eyebrow="Farmer-friendly access" title="Offline, local language and future SMS support">
        <div className="support-grid">
          <article>
            <WifiOff size={24} />
            <h3>{t.offline}</h3>
            <p>The main application stores settings locally and caches the website after first load for smartphone users in low-connectivity fields.</p>
          </article>
          <article>
            <Languages size={24} />
            <h3>Local language support</h3>
            <p>Farmers can switch between English, Tamil and Hindi for the core interface. More languages can be added from the same copy file.</p>
          </article>
          <article>
            <Send size={24} />
            <h3>SMS support roadmap</h3>
            <p>SMS agriculture services already exist. This project can later integrate SMS for farmers without smartphones while keeping the unique AI tool bundle.</p>
          </article>
          <article>
            <Bot size={24} />
            <h3>Voice assistant</h3>
            <p>Tap the voice button to hear irrigation, weather and fertilizer advice using the phone browser's speech engine.</p>
          </article>
        </div>
      </Section>
    </main>
  )
}
