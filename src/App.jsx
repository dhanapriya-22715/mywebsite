import {
  Bell,
  Bot,
  ChevronRight,
  CloudSun,
  Droplets,
  FlaskConical,
  Home,
  Leaf,
  LineChart,
  Menu,
  Mic,
  RefreshCw,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Waves,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const cropData = {
  paddy: { label: 'Paddy', yield: 8118, price: 22 },
  cotton: { label: 'Cotton', yield: 1450, price: 70 },
  tomato: { label: 'Tomato', yield: 9800, price: 34 },
  maize: { label: 'Maize', yield: 3600, price: 19 },
}

const recommendations = [
  {
    icon: Droplets,
    title: 'Irrigation Advice',
    text: 'Skip irrigation today. Soil moisture sufficient.',
    target: 'tools',
  },
  {
    icon: FlaskConical,
    title: 'Organic Fertilizer',
    text: 'Apply vermicompost 200 kg/acre this week.',
    target: 'tools',
  },
  {
    icon: TrendingUp,
    title: 'Market Update',
    text: 'Paddy prices are up 3.2% in nearby markets.',
    target: 'market',
  },
]

const tools = [
  'Crop Recommendation',
  'Organic Fertilizer',
  'Yield Prediction',
  'Pest & Disease Scan',
  'Government Schemes',
]

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(Math.round(value))
}

function Topbar({ eyebrow, title, action }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {action}
    </header>
  )
}

function IconButton({ label, children }) {
  return (
    <button className="icon-button" type="button" aria-label={label}>
      {children}
    </button>
  )
}

function HomeScreen({ setScreen }) {
  return (
    <section className="screen">
      <Topbar
        eyebrow="Today - Partly cloudy"
        title="AgroAI"
        action={
          <IconButton label="Notifications">
            <Bell size={19} />
          </IconButton>
        }
      />

      <article className="weather-card">
        <div>
          <p>Today - Partly cloudy</p>
          <strong>29</strong>
          <span className="degree"> / 22 deg</span>
          <small>60% rain - 12 km/h</small>
        </div>
        <CloudSun className="weather-icon" size={58} aria-hidden="true" />
        <p className="weather-note">AI: Rain expected tonight. Plan irrigation carefully.</p>
      </article>

      <div className="mini-grid">
        <article className="mini-card">
          <span className="mini-icon">
            <Leaf size={18} />
          </span>
          <p>Crop Health</p>
          <strong>Good</strong>
        </article>
        <article className="mini-card">
          <span className="mini-icon">
            <Waves size={18} />
          </span>
          <p>Soil Moisture</p>
          <strong>48%</strong>
        </article>
      </div>

      <section className="content-block">
        <h2>AI Recommendations</h2>
        {recommendations.map((item) => {
          const Icon = item.icon
          return (
            <button className="list-card" type="button" key={item.title} onClick={() => setScreen(item.target)}>
              <span>
                <Icon size={18} />
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </button>
          )
        })}
      </section>
    </section>
  )
}

function MarketScreen() {
  const prices = [
    ['Paddy', 'Nearby wholesale average', 'Rs 2,180/q'],
    ['Tomato', 'High demand this week', 'Rs 34/kg'],
    ['Cotton', 'Stable movement', 'Rs 7,050/q'],
  ]

  return (
    <section className="screen">
      <Topbar
        eyebrow="Local mandi insights"
        title="Market"
        action={
          <IconButton label="Refresh prices">
            <RefreshCw size={19} />
          </IconButton>
        }
      />

      <section className="content-block">
        <h2>Crop Prices</h2>
        {prices.map(([name, text, price]) => (
          <article className="price-card" key={name}>
            <div>
              <strong>{name}</strong>
              <p>{text}</p>
            </div>
            <span>{price}</span>
          </article>
        ))}
      </section>

      <section className="content-block">
        <h2>Sell Recommendation</h2>
        <article className="soft-panel">
          <strong>Hold paddy for 3-5 days</strong>
          <p>Short-term demand is improving. Expected gain: 2% to 4%.</p>
        </article>
      </section>
    </section>
  )
}

function VoiceScreen() {
  const [active, setActive] = useState(false)

  return (
    <section className="screen">
      <div className="voice-stage">
        <button className={`mic-button ${active ? 'active' : ''}`} type="button" onClick={() => setActive(!active)}>
          <Mic size={42} />
        </button>
        <h1>{active ? 'AI is preparing advice' : 'Listening... speak now'}</h1>
        <p>
          {active
            ? 'For paddy: apply vermicompost before rainfall and avoid excess watering.'
            : 'Tap microphone to simulate a voice query.'}
        </p>
        <div className="wave" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={index}></span>
          ))}
        </div>
      </div>

      <section className="content-block">
        <h2>Recent Conversations</h2>
        <article className="chat user">When should I water my tomato field?</article>
        <article className="chat bot">Based on today's rain forecast, skip irrigation for 2 days.</article>
        <article className="chat user">What fertilizer for paddy this week?</article>
        <article className="chat bot">Apply 200 kg vermicompost per acre before predicted rain.</article>
      </section>
    </section>
  )
}

function ToolsScreen() {
  const [farmSize, setFarmSize] = useState(1)
  const [crop, setCrop] = useState('paddy')
  const [rainfall, setRainfall] = useState(60)

  const result = useMemo(() => {
    const cropInfo = cropData[crop]
    const rainFactor = rainfall / 60
    const predictedYield = cropInfo.yield * farmSize * Math.min(1.2, Math.max(0.65, rainFactor))
    return {
      yield: formatNumber(predictedYield),
      income: formatNumber(predictedYield * cropInfo.price),
    }
  }, [crop, farmSize, rainfall])

  return (
    <section className="screen">
      <Topbar eyebrow="Planning tools" title="Agro Tools" />

      <section className="content-block">
        <h2>Yield Prediction</h2>
        <form className="calculator">
          <label>
            Farm Size (acre)
            <input
              type="number"
              value={farmSize}
              min="0.1"
              step="0.1"
              onChange={(event) => setFarmSize(Number(event.target.value || 1))}
            />
          </label>
          <label>
            Crop
            <select value={crop} onChange={(event) => setCrop(event.target.value)}>
              {Object.entries(cropData).map(([value, item]) => (
                <option value={value} key={value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Expected Rainfall
            <input type="range" min="10" max="100" value={rainfall} onChange={(event) => setRainfall(Number(event.target.value))} />
          </label>
        </form>

        <div className="result-grid">
          <article className="result-card">
            <span>
              <Sprout size={18} />
            </span>
            <p>Predicted Yield</p>
            <strong>{result.yield} kg</strong>
          </article>
          <article className="result-card">
            <span>Rs</span>
            <p>Income</p>
            <strong>Rs {result.income}</strong>
          </article>
        </div>
      </section>

      <section className="content-block">
        <h2>Organic Fertilizer Suggestions</h2>
        {[
          [FlaskConical, 'Vermicompost', '200 kg / acre, 2 weeks before sowing.'],
          [Leaf, 'Green Manure', 'Plough into soil at flowering stage.'],
          [ShieldCheck, 'Neem Oil Spray', '5 ml/l water, weekly pest prevention.'],
        ].map(([Icon, title, text]) => (
          <article className="list-card static" key={title}>
            <span>
              <Icon size={18} />
            </span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>
    </section>
  )
}

function MoreScreen({ setScreen, darkMode, setDarkMode }) {
  return (
    <section className="screen">
      <Topbar eyebrow="Tools and settings" title="More" />

      <section className="dark-panel">
        <h2>Tools</h2>
        {tools.map((tool) => (
          <button className="dark-row" type="button" key={tool} onClick={() => setScreen('tools')}>
            {tool}
            <ChevronRight size={18} />
          </button>
        ))}
      </section>

      <section className="dark-panel">
        <h2>Settings</h2>
        <label className="dark-row switch-row">
          Dark Mode
          <input type="checkbox" checked={darkMode} onChange={(event) => setDarkMode(event.target.checked)} />
        </label>
        <button className="dark-row" type="button">
          Language <span>English</span>
        </button>
        <button className="dark-row" type="button">
          Notifications <span>On</span>
        </button>
        <button className="dark-row" type="button">
          Offline Mode <span>Auto</span>
        </button>
      </section>
    </section>
  )
}

function BottomNav({ screen, setScreen }) {
  const items = [
    ['home', Home, 'Home'],
    ['market', LineChart, 'Market'],
    ['voice', Mic, 'Voice'],
    ['more', Menu, 'More'],
  ]

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(([name, Icon, label]) => (
        <button className={`nav-item ${screen === name ? 'active' : ''}`} type="button" key={name} onClick={() => setScreen(name)}>
          <Icon size={20} />
          {label}
        </button>
      ))}
    </nav>
  )
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [darkMode, setDarkMode] = useState(false)

  return (
    <main className={`app-shell ${darkMode ? 'dark' : ''}`} aria-label="AgroAI mobile website">
      {screen === 'home' && <HomeScreen setScreen={setScreen} />}
      {screen === 'market' && <MarketScreen />}
      {screen === 'voice' && <VoiceScreen />}
      {screen === 'tools' && <ToolsScreen />}
      {screen === 'more' && <MoreScreen setScreen={setScreen} darkMode={darkMode} setDarkMode={setDarkMode} />}

      <button className="fab" type="button" onClick={() => setScreen('voice')} aria-label="Open assistant">
        <Bot size={22} />
      </button>
      <BottomNav screen={screen} setScreen={setScreen} />
    </main>
  )
}
