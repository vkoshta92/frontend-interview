# Backend Quick Revision Notes (Hinglish)

## Day01 - Intro of Backend
- Backend kya hai: browser ke piche server chal raha code.
- Node.js backend ke liye runtime, JavaScript ko server par chalata.
- `require()` se file/module import karte hain aur code reuse hota.
- Example:
  ```js
  const { sum, sub } = require("./second");
  sum(3,4);
  sub(7,8);
  ```
- `second.js` mein functions define karke export, `first.js` mein import.
- Basic flow: client request bheje, backend response de.

## Day02 - Import & Export in details
- Node module system: commonjs `require()` aur `module.exports`.
- Relative paths: `./second` current folder se, `../` parent folder se.
- Path resolution: `.js` add karna optional hai.
- Example: simple calculator module jisme `sum` aur `sub` export kiye.
- Folder structure ke hisaab se code organized rehna sikhata.

## Day03 - Libuv in Nodejs
- `libuv` Node ka internal engine hai jo event loop aur async I/O manage karta.
- Node single-threaded hota hai, par I/O asynchronous hone se multiple requests handle karta.
- `fs` module file read/write ke liye, callback/promise/async pattern use karein.
- Example se samjho: sync-style code likho, par Node background me I/O handle karta.
- Event loop important hai: timers, pending callbacks, poll, close callbacks.

## Day04 - Create Server
- Native `http` module se basic web server banana.
- `http.createServer` request aur response object provide karta.
- Simple routing: `if (req.url === '/')` aur `res.end()`.
- Example:
  ```js
  const http = require('http');
  const server = http.createServer((req, res) => {
    if (req.url === '/') res.end('Hello Coder Army');
  });
  server.listen(3000);
  ```
- Backend mein server ka entry point yeh hota hai.

## Day05 - How Company Works in Backend
- Company mein backend team data store, security, business logic handle karti.
- Frontend client se request bhejta, backend process karke DB se data laata.
- Response client ko JSON/HTML bhej sakta hai.
- API design, team collaboration, DB schema, deployment yeh sab part hote hain.
- Example: ek restaurant/bookstore API create karna jisme items list hoti.

## Day06 - Intro of Express
- Express Node ke upar framework, routing aur middleware easy banata.
- `const app = express();` se app create hota.
- Route example: `app.get('/detail', handler)`.
- URL params aur query params handle kar sakte hain: `/detail/home/10`.
- Express me `app.listen(3000)` se server chalta.

## Day07 - Postman
- Postman tool se APIs test karte hain.
- GET request se data read, POST request se naya data create.
- Example `BookStore` array se book list ya naya book create test karna.
- API endpoints alag alag HTTP methods use karte.
- Postman se headers, body, auth sab check kar sakte ho.

## Day08 - Middleware
- Middleware function hota jo request handle karne se pehle run hota.
- `app.use()` se common middleware register karte.
- Flow: request -> middleware -> route handler -> response.
- Example: `express.json()` JSON body parse karta hai.
- Custom middleware se logging, auth, validation, error handling kar sakte.

## Day09 - Error Handling & middleware
- HTTP status codes samajhna zaroori: 200 success, 201 created, 400 bad request, 401 unauthorized, 500 server error.
- Errors ko handle karne ke liye middleware likhte hain: `app.use((err, req, res, next)=>{})`.
- Auth middleware se protected routes banate.
- Example: `const {Auth} = require('./middleware/auth')` aur route pe `Auth` apply karna.
- CRUD operations me proper status aur messages dena best practice hai.

## Day11 - Error handling db
- Database error handling: connection fail, query fail, validation fail.
- Middleware se request pe auth aur permission check karna.
- Example: agar DB insert fail ho, to `try/catch` se 500 error ya custom response dena.
- CRUD operations me error handling strong banana backend resilience ke liye zaroori.

## Day12 - Internal Db
- Internal DB matlab app ke andar memory data store like simple array/object.
- Temporary data store karna jab real DB available na ho.
- Example: in-memory array se CRUD practice.
- Ye demo/prototype ke liye hota hai, production me persist nahi hota.
- Data structure management aur array methods sikhne ka easiest way.

## Day13 - Mongointernal
- MongoDB se connect karna `MongoClient` ya `mongoose` se.
- Connection string me username, password, cluster details hoti.
- Example: `mongodb+srv://username:password@cluster.mongodb.net/`.
- MongoDB document store; collections aur documents use karte.
- `mongointernal` ka matlab internal Mongo setup aur query ka practice.

## Day14 - BPlus Tree
- B+ Tree database indexing ka data structure hai.
- Large data ke liye fast search aur range queries useful.
- Yeh tree nodes me data store karta aur disk access optimize karta.
- Database engine me B+ Tree se query speed improve hoti.
- Conceptual importance: DB index kaise kaam karta.

## Day16 - Mongo working
- Mongoose se MongoDB connect aur model define karna.
- `const User = require('./Models/users')` se schema model use hota.
- `await mongoose.connect(...)` se DB connect.
- CRUD: create user, read users, update user, delete user.
- Example: `app.post('/info', await User.create(req.body))`.

## Day17 - Data sanitization and schema validation
- Input sanitization se malicious ya adhura data remove karte.
- Schema validation se data format strict rakha jata.
- Mongoose schema me required, type, minLength jaise rules lagte.
- Example: registration me `firstName`, `emailId`, `age` mandatory checks.
- Clean data server ko safe aur predictable banata.

## Day18 - How to store password in DB
- Password plaintext me store nahi karna; security risk.
- `bcrypt` se password hash karte; hash irreversible hota.
- Example: `req.body.password = await bcrypt.hash(req.body.password, 10);`
- Salt se same password bhi har baar different hash banega.
- Login me `bcrypt.compare(plain, hash)` se verify karte.

## Day19 - Digital signature and bcrypt code authentication
- Authentication flow: user register, password hash store, login, password verify.
- `bcrypt.compare()` se password match check hota.
- Backend me secure login aur token-based auth ka foundation.
- Example: login ke baad valid credentials par token generate.

## Day20 - JWT token and cookies
- JWT (JSON Web Token) sign aur verify karne ke liye use hota.
- Cookies ke liye `cookie-parser` use karte.
- Example: `const token = jwt.sign({_id:people._id}, secret, {expiresIn:'7d'})`.
- Server `req.cookies.token` se token read karke `jwt.verify()` karta.
- Protected routes me cookie-based auth allow karta.

## Day21 - Refresh token and middleware
- Access token short-lived, refresh token long-lived.
- Jab access token expire ho jaye to refresh token se naya access token len.
- Middleware `userAuth` route access pe token verify karta.
- Example: protected routes `app.get('/user', userAuth, ...)`.
- Security: refresh token safe store aur revoke karna important.

## Day22 - Methods in Mongoose and environment variable
- Mongoose methods: `find`, `findOne`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`, `updateOne`, `deleteOne`.
- Router organization use karte: `routes/auth`, `routes/user`, `routes/comment`.
- `dotenv` package se `.env` file load karte: `process.env.PORT`, DB connection string.
- Secrets code me hardcode na karein.
- Modular structure se code clean aur maintainable banta.

## Day23 - Logout feature and Redis
- Logout me user session end karte, token invalid karte.
- Cookie delete karna ya token blacklist karna common.
- Redis in-memory store ka use session data aur token blacklist ke liye.
- Example: `res.clearCookie('token')` aur Redis se session/refresh token manage karna.
- Redis fast hota, isliye session/cache operations me use.

## Day24 - Redis in detail
- Redis ek in-memory database hai, bahut fast.
- Use cases: cache, session store, rate limiting, pub/sub.
- Data types: string, list, hash, set, sorted set.
- Example: login session ya token data Redis me store karna.
- Server initialization me Redis aur MongoDB dono connect karte hain.

## Day25 - Rate-limiter
- Rate limiting se API abuse rokte hain.
- Client ko limited requests per time frame allow karte.
- Example: ek IP ko 100 requests per minute.
- Agar limit cross ho to `429 Too Many Requests` send karte.
- Protects service from DDoS aur overload.

## Day26 - Rate-limiter sliding window
- Sliding window algorithm time window continuously move hoti.
- Fixed window se zyada smooth limit enforcement milta.
- Example: last 60 seconds me request count check karo.
- Ye approach burst traffic better handle karta.
- Important concept: time-based counters aur Redis store use.

## Day28 - AI Chatting
- Express server me CORS enable karke frontend requests allow karte.
- `chattingHistory` object se per-user conversation history manage.
- Chat endpoint request leke Google GenAI service call karta.
- Example: prompt message history ke saath AI response generate.
- Model response store karke next requests me context maintain karte.

## Day30 - Google GenAI
- `@google/genai` se Google AI services integrate karte.
- CLI input lene ke liye `readline-sync` use karte.
- Prompt engineering me user query ko structured JSON me banana important.
- Example: model ko weather requests parse karne ke liye JSON format specify karna.
- `getWeather()` helper se actual weather API lekare model ko data provide karte.

## Day31 - Google GenAI continuation
- AI workflow ko extend karta hai: prompt -> model -> parse -> API call -> summary.
- LLM se strict JSON output expect karna debugging easy banata.
- Weather API response ko LLM ko feed karke user-friendly summary banate.
- Example: `weather_details_needed` flag se decision flow control hota.
- Focus: real-world AI integration pattern aur response orchestration.

## WebRTC - Real-time Video Call
- WebRTC peer-to-peer video/audio stream ke liye use hota.
- Signaling server se offer/answer/candidate exchange hoti hai.
- `socket.io` se signaling messages relay kiye gaye.
- Server example:
  ```js
  const io = socketIO(server);
  io.on('connection', socket => {
    const relay = event => socket.on(event, data => socket.broadcast.emit(event, data));
    relay('offer');
    relay('answer');
    relay('candidate');
  });
  ```
- Client side flow:
  1. `navigator.mediaDevices.getUserMedia()` se camera/mic access.
  2. `new RTCPeerConnection({ iceServers })` create.
  3. Caller `createOffer()`, callee `createAnswer()`.
  4. `pc.onicecandidate` pe candidate server bhejna.
  5. `pc.ontrack` se remote video set karna.
- Twilio STUN/TURN config browser se direct peer connection better banata.
- Accept/reject flow aur hangup button se call control implement hota.

## WebSocket - Socket.io Basic Chat
- WebSocket real-time duplex communication allow karta.
- `socket.io` abstraction use karke chat banana easy.
- Server side example:
  ```js
  io.on('connection', socket => {
    socket.on('message', data => io.emit('new-message', data));
  });
  ```
- `io.emit` sab connected clients ko message bhejta.
- Simple broadcast chat app me use hota.
- Client send message, server broadcast, sab clients receive.

## WebSocket - Room-based Messaging
- `socket.join(room)` se room banate aur group messages bhejte.
- `socket.to(room).emit('new-message', msg)` se only room clients receive karte.
- Personal chat me room ko user id ya socket id bana sakte.
- Example:
  ```js
  socket.on('join-room', room => socket.join(room));
  socket.on('message', ({room,msg}) => socket.to(room).emit('new-message', msg));
  ```
- Ye room concept private chat, group chat, channel model ko implement karta.

---

> Note: Workspace me `Day10`, `Day15`, `Day27` folders available nahi the, isliye unko skip kiya gaya hai. Baaki days aur realtime folders ke content ke basis par summary banayi gayi hai.
