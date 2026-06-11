# VLT iGaming + PixiJS — Senior Dev Interview Prep
> SG / LnW Context | Canada, Europe & Pennsylvania Markets

---

## 1. Core Concept: Land-Based → iGaming Adaptation

```
Cabinet/VLT → Approved Math → Asset Export → PixiJS/Web → Localization → QA → Certification
```

**Key Mindset:** Tu sirf game port nahi kar raha — tu "cabinet soul" preserve kar raha hai browser mein.

| Aspect | Land-Based Cabinet | iGaming (Browser/Mobile) |
|---|---|---|
| Hardware | Fixed, physical buttons | Touch / mouse / keyboard |
| Pacing | Controlled (physical reel spin) | Must be replicated in code |
| Session | Coin-in / coin-out | Session handling, autoplay |
| Screen | Fixed resolution display | Responsive, multiple viewports |
| Sound | Cabinet speakers | Web Audio API |

---

## 2. "Cabinet Soul" — Jo KABHI Nahi Badlega

Yeh sabse important concept hai. Interviewer yahi sunna chahta hai:

- **Reel rhythm** — reels ka spin timing, deceleration curve exactly same
- **Anticipation timing** — near-miss, held reels ka tension build-up
- **Feature sequencing** — bonus trigger → transition → feature play ka flow
- **Win pacing** — small win vs big win ka celebration duration ratio
- **Core player feel** — agar player ek baar cabinet pe khela hai, to browser mein familiar lagna chahiye

**PixiJS angle:** `gsap` ya custom `Ticker` se reel deceleration curves replicate karo. Easing functions matter — linear nahi chalega, ease-out-back ya custom bezier use karo.

---

## 3. Regulated Market Concepts

### Bet Limits & Win Caps
| Parameter | Typical Value |
|---|---|
| Max Bet | ~$5 (market dependent) |
| Max Win | ~$2500 (market dependent) |
| RTP | Regulated per jurisdiction |

**Why it matters in code:** UI mein max bet enforce karna, win display capping, RTP config per market — sab server-driven hona chahiye, hardcode bilkul nahi.

### Progressive Types
| Type | Full Name | How It Works |
|---|---|---|
| WAP | Wide Area Progressive | Multiple venues/operators ke across shared jackpot pool |
| MLP | Multi Linked Progressive | Ek controlled network ke andar linked machines |

**PixiJS angle:** Progressive meter ek WebSocket/SSE se real-time update hoti hai. Smooth number tween karo (GSAP CountTo ya custom lerp), sudden jump nahi dikhna chahiye.

---

## 4. Feature Parity — QA & Dev Dono ka Concern

Yeh term interview mein zaroor aayega. Matlab:

> "iGaming version mein woh saari features hain jo cabinet mein thi, same behavior ke saath"

**Checklist mentally yaad rakh:**
- [ ] Reel behavior (symbols, weights, stops)
- [ ] Bonus trigger conditions
- [ ] Free spins count & retrigger logic
- [ ] Wild/scatter behavior
- [ ] Win lines / ways calculation
- [ ] Progressive meter contribution
- [ ] Localization (language, currency, date format)
- [ ] RTP config awareness

---

## 5. PixiJS Senior Dev — Expected Knowledge

### Architecture Questions
```
Q: Tumhara slot game architecture kaisa hota hai?

A: Plugin-based feature class system. BaseGame ek core loop run karta hai,
   aur har feature (FreeSpins, Wild, HoldSpin, Cascade) ek alag class mein
   hoti hai jo BaseFeature extend karti hai. State machine se game states
   manage hote hain (IDLE → SPIN → RESULT → FEATURE → IDLE).
```

### State Machine
```javascript
// States
IDLE → SPIN_START → REEL_SPINNING → REEL_STOP → RESULT_EVAL
     → FEATURE_TRIGGER → FEATURE_PLAY → WIN_PRESENTATION → IDLE

// Agar free spins:
FEATURE_PLAY → FREE_SPIN_START → ... → FREE_SPIN_END → IDLE
```

### Reel System
```javascript
// Key concepts:
- Symbol strip (reel strip) — server se aata hai, config driven
- Stop positions — server response mein hote hain
- Tween/animation — GSAP ya custom ticker
- Anticipation — specific stop pe slow down + sound + effect
- Blur shader — spin ke time GLSL fragment shader se motion blur
```

### Performance (FPS)
```
- Object pooling for symbols (destroy mat karo, reuse karo)
- Sprite sheets (TextureAtlas) — individual textures nahi
- GLSL shaders for win effects (glow, shimmer) — CPU se GPU pe offload
- Avoid layout thrashing — ek frame mein saara position update
- renderTexture use karo static backgrounds ke liye
```

### WebSocket / Server Communication
```javascript
// Typical flow:
1. Player hits SPIN
2. Client → Server: { betAmount, gameId, sessionToken }
3. Server → Client: { reelStops, winAmount, features, nextState }
4. Client animate karta hai server response ke according

// NEVER calculate wins client-side — server authoritative hai
```

---

## 6. Localization — Dev Perspective

```
Market         Currency    Language    Special Rules
Canada (ON)    CAD         EN/FR       French mandatory
Pennsylvania   USD         EN          PA Gaming Control Board
Europe (DE)    EUR         DE          Cooldown timers mandatory
Europe (UK)    GBP         EN          UKGC — no autoplay in some cases
```

**Code implication:**
- `i18n` library use karo (i18next ya custom)
- Currency formatting: `Intl.NumberFormat` — hardcode `$` nahi
- Responsible gaming: session timer, reality check popup — yeh features required hain regulated markets mein

---

## 7. Responsible Gaming — Jo UI Mein Dalna Padta Hai

Yeh regulated client ke liye must-know hai:

| Feature | Description |
|---|---|
| Session Timer | Kitne time se khel raha hai |
| Reality Check | Periodic popup — net win/loss dikhata hai |
| Autoplay Limits | Max autoplay spins, loss limit, single win limit |
| Bet Limits | Per regulation max bet enforce |
| Self-Exclusion | Game launch pe check karna |

**PixiJS angle:** Yeh sab game ke andar UI layer hoti hai — separate `ResponsibleGamingManager` class banao jo game loop se independent ho.

---

## 8. Animator Expectations (Agar Coordination Karni Padi)

Casino animation = **restraint + clarity**

| Do | Don't |
|---|---|
| Clear win outcome readable | Over-animation / flashy transitions |
| Smooth, trust-building transitions | Particle overload on every spin |
| Reel stop thud + symbol settle | Screen shake on small wins |
| Big win celebration proportional | Same celebration for $1 and $500 win |

---

## 9. Games to Study (Homework)

| Game | Where | What to Notice |
|---|---|---|
| Quick Hit Blitz Blue | https://igaming.lnw.com/games/quick-hit-blitz-blue/ | Reel rhythm, anticipation, win pacing |
| 88 Fortunes | YouTube | Progressive meter animation, feature flow |
| Monopoly WMS | YouTube | Bonus game transition, feature parity example |

**Study karte waqt notes lo:**
1. Reel deceleration curve kaisi hai?
2. Anticipation kab trigger hoti hai?
3. Win celebration kitne seconds ka hai?
4. Autoplay button behavior kaisa hai?
5. Mobile vs desktop koi difference?

---

## 10. Interview Mein Bolne Wali Terms

Yeh terms confidently use karo:

| Term | Matlab |
|---|---|
| Feature parity | iGaming = cabinet ka same behavior |
| Cabinet soul | Core gameplay feel jo preserve karna hai |
| Anticipation | Near-miss tension build-up animation |
| Reel rhythm | Reel spin/stop ka timing pattern |
| Regulated UX | Jurisdiction ke rules ke according UI |
| RTP | Return to Player — math model ka core |
| WAP / MLP | Progressive jackpot network types |
| Server authoritative | Wins server decide karta hai, client nahi |
| Config-driven | Game behavior hardcode nahi, JSON/config se |
| Localization | Market-specific language, currency, rules |

---

## 11. Expected Interview Questions + Answers

**Q: Cabinet se iGaming mein kya preserve karna sabse important hai?**
> Reel rhythm aur anticipation timing. Player ne cabinet pe jo feel experience ki hai, woh muscle memory ban jaati hai. Agar browser mein reel 50ms fast rok de ya anticipation sound late aaye, player immediately notice karta hai — trust toot jaata hai.

**Q: Tumne PixiJS mein performance kaise optimize ki hai?**
> Object pooling for symbols, sprite sheets for texture batching, renderTexture for static backgrounds, aur GPU-accelerated shaders for win effects. Main rule: CPU se jitna ho sake GPU pe offload karo.

**Q: Server-client communication slot game mein kaisi hoti hai?**
> Server authoritative architecture — client sirf animate karta hai. Spin pe client bet send karta hai, server reel stops aur win amount return karta hai. Client-side mein koi win calculation nahi hoti — yeh regulated requirement bhi hai.

**Q: WAP aur MLP mein difference kya hai?**
> WAP wide area progressive hai — multiple operators ya venues ke across ek shared jackpot pool hota hai, isliye jackpot bada hota hai. MLP multi-linked progressive hai — ek controlled network ke andar specific machines linked hoti hain. Development mein dono ke liye real-time meter sync WebSocket se handle hota hai.

**Q: Localization mein kya challenges aate hain?**
> Language sirf text nahi — layout bhi change hota hai (German text longer hota hai, French mein right-to-left nahi but accents hain). Currency formatting `Intl.NumberFormat` se handle karo. Aur kuch markets mein specific RG features mandatory hain jo config se toggle honi chahiye.

---

## 12. 5 Adaptation Risks (Homework Answer)

1. **Reel timing mismatch** — browser frame rate inconsistency se reel feel change ho sakti hai
2. **Audio latency** — Web Audio API cabinet speaker se different hai, anticipation sound timing off ho sakta hai
3. **Responsive UI breaks** — cabinet fixed resolution tha, mobile pe elements overlap kar sakte hain
4. **Progressive meter lag** — WebSocket delay se meter jump dikhta hai (smooth tween required)
5. **Autoplay regulation** — kuch markets mein autoplay restricted hai, cabinet pe tha to iGaming mein remove karna pad sakta hai

---

*Prepared for ZVKY / VLT client context | SG-LnW iGaming*