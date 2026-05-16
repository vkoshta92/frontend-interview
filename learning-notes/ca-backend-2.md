# Backend Interview Prep Notes

## 1. Repo Overview
Ye repo backend interview preparation ke liye bahut acha hai. Isme:
- `Day01` se `Day31` tak backend fundamentals aur advanced topics hain.
- `webrtc`, `websocket-1`, `websocket-2`, `webrtc-2` real-time communication code hai.
- `PROJECT` aur `LeetCode-Project` me full-stack backend projects aur problem solution structure hai.
- `all notes` folder me 16 DSA PDF resources hain: `WEEK_01` se `WEEK_16`.
- Images/diagram files har day folder ke andar milti hain, jisse architecture/flow samajhna easy hota hai.
- Video files repo me nahi mile, lekin code + diagrams + PDFs interview prep ke liye kaafi hain.

## 2. Important Resource Files
### DSA PDFs
- `all notes/WEEK_01-LEARN DSA WITH C++.pdf`
- `all notes/WEEK_02-LEARN DSA WITH C++.pdf`
- ...
- `all notes/WEEK_16-LEARN DSA WITH C++.pdf`

### Diagrams / Images
- `Day01 Intro of Backend/NodeFirst.png`
- `Day02 Import & Expoer in details/Untitled-2025-01-03-2201.excalidraw.png`
- `Day03 Libuv in Nodejs/Untitled-2025-01-03-2201.excalidraw.png`
- `Day04 Create Server/Untitled-2025-01-03-2201.excalidraw.png`
- `Day05 How Company Works in Backend/Untitled-2025-01-03-2201.excalidraw.png`
- `Day06 Intro of Express/Untitled-2025-01-03-2201.excalidraw.png`
- `Day08 Middleware/Untitled-2025-01-03-2201.excalidraw.png`
- `Day09 Error Handling & middleware/Untitled-2025-01-03-2201.excalidraw.png`
- `Day11 eroor handling db/Untitled-2025-01-03-2201.excalidraw.png`
- `Day12 Internal Db/Day12.png`
- `Day13 mongointernal/Untitled-2025-03-19-1654.excalidraw.png`
- `Day14 bplus tree/Untitled-2025-03-19-1654.excalidraw.png`
- `Day16 mongo working/Untitled-2025-03-19-1654.excalidraw.png`
- `Day19 digital signature and bcrypt code suthentication/curr.png`
- `Day20 jwt token and cookies/20.png`
- `Day21 refresh token and middleware/21.png`
- `Day25 rate-limiter/Untitled-2025-01-03-2201.excalidraw.png`
- `Day26 rate-limiter sliding window/26.png`
- `29/DAY29.png`

## 3. Topic Summary with Code
### Day01: Backend Intro + Modules
- Backend samajhne ke liye Node.js runtime aur module system important hai.
- Example:
```js
const { sum, sub } = require("./second");
sum(3, 4);
sub(7, 8);
```
- `Day01` me `second.js` aur `first.js` se basic import/export sikha gaya.

### Day02: Import / Export Details
- CommonJS `module.exports` aur `require()` ka use.
- `./` current directory, `../` parent directory, path resolution optional `.js`.
- Example folder `Today/calculator` me `sum.js`, `sub.js`, `mul.js`, `index.js` structure bani hai.

### Day03: Libuv + Event Loop
- Node single-threaded hai, par I/O asynchronous `libuv` se handle hota hai.
- `fs`, callbacks, event loop phases interview me discuss karne ke liye best topics.

### Day04: Create Server
- Native HTTP server, request/response handling, routing.
- Example:
```js
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/') res.end('Hello Coder Army');
});
server.listen(3000);
```

### Day05: Company Backend Flow
- Backend team business logic, data store, security handle karti hai.
- Request -> process -> DB -> response flow samjho.
- Example restaurant/bookstore API structure yahan diya gaya.

### Day06: Express Intro
- `express()` app create karna.
- `app.get()`, route handler, request params, query params.
- Sample: `app.get('/book/:id')` aur `req.query.author`.

### Day07: Postman + CRUD
- Postman se API testing.
- `GET`, `POST`, `PATCH`, `PUT`, `DELETE` method practice.
- `BookStore` array CRUD example interview me demo dene ke liye useful.

### Day08: Middleware + Routing
- `app.use(express.json())` JSON parsing.
- Custom middleware concept aur `req.query`, `req.params` use.
- Example:
```js
app.use(express.json());
app.get('/book', (req, res) => {
  const Book = BookStore.filter(info => info.author === req.query.author);
  res.send(Book);
});
app.patch('/book', (req, res) => {
  const Book = BookStore.find(info => info.id === req.body.id);
  if (req.body.author) Book.author = req.body.author;
  res.send('Patch updated');
});
```

### Day09: Error Handling + Auth Middleware
- Protected routes, error status codes, `try/catch`.
- Middleware example:
```js
const {Auth} = require('./middleware/auth');
app.post('/admin', Auth, (req,res)=>{ FoodMenu.push(req.body); res.status(201).send('Item Added Succesfully'); });
```
- `Auth` dummy token check se authorization concept cover hota hai.

### Day11: DB Error Handling
- DB CRUD + error handling using `try/catch`.
- Example in `Day11 eroor handling db/index.js`.

### Day12: Internal DB
- In-memory array as temporary database.
- Use case: prototype/testing before real DB.

### Day13: Mongo Internal
- Mongo connection and data modeling concept.
- Interview focus: why document DB, collections, schema flexibility.

### Day14: B+ Tree Concept
- DB indexing, B+ tree structure, range query optimization.
- Interview topic: indexing vs full scan.

### Day16: Mongoose CRUD
- Mongoose model + MongoDB CRUD.
- Example:
```js
app.get('/info', async (req,res)=>{ const ans = await User.find({}); res.send(ans); });
app.post('/info', async(req,res)=>{ await User.create(req.body); res.send('Succesfully Updated'); });
```

### Day17: Data Sanitization + Validation
- Required fields check, schema validation.
- Example: `firstName`, `emailId`, `age` mandatory validation before save.

### Day18: Password Storage
- Password hashing with bcrypt.
- Example:
```js
req.body.password = await bcrypt.hash(req.body.password, 10);
```
- Interview point: never store plaintext passwords.

### Day19: Authentication Flow
- Register, login, bcrypt compare.
- Example:
```js
const IsAllowed = await bcrypt.compare(req.body.password, people.password);
if(!IsAllowed) throw new Error('Invalid credentials');
```

### Day20: JWT + Cookies
- JWT generate and verify.
- Example:
```js
const token = jwt.sign({_id:people._id, emailId:people.emailId}, 'Rohit@13412$', {expiresIn:'7d'});
res.cookie('token', token);
```
- Interview point: token storage, cookie security, expiry.

### Day21: Refresh Tokens + Middleware
- Protected route example with `userAuth` middleware.
- Flow: login -> token -> protected GET/DELETE/PATCH.
- Interview focus: token renewal and secure route access.

### Day22: Mongoose Methods + dotenv
- Common methods: `find`, `findOne`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`.
- `dotenv` use to store secrets like `PORT`, DB URI.
- Good interview note: avoid hard-coding secrets.

### Day23: Logout + Redis
- Logout flow and session invalidation.
- Redis use case for session/cache and token blacklisting.

### Day24: Redis in Detail
- Redis as in-memory data store.
- Use cases: cache, session store, rate limiting, pub/sub.
- Example: Redis connection and faster session handling.

### Day25: Rate Limiter
- API rate limiting to prevent abuse.
- Interview focus: request quotas, status `429`, server protection.

### Day26: Sliding Window Rate Limiter
- Sliding window algorithm for smoother request limiting.
- Better than fixed window for burst traffic.

### Day28: AI Chatting
- Express + CORS + chat endpoint.
- `Day28/aiChatting.js` me Google GenAI integration.
- Useful interview topic: prompt history and context maintenance.

### Day30 & Day31: Google GenAI Workflows
- CLI-based GenAI prompt handling.
- Real-world LLM flow: parse user query, request weather API, produce JSON response.
- Interview note: prompt engineering and data orchestration.

### WebRTC: Real-time Video Call
- Signaling server using `socket.io`.
- Example server relay:
```js
io.on('connection', socket => {
  const relay = event => socket.on(event, data => socket.broadcast.emit(event, data));
  relay('offer'); relay('answer'); relay('candidate');
});
```
- Client-side flow: `getUserMedia`, `RTCPeerConnection`, `createOffer`, `createAnswer`, `onicecandidate`, `ontrack`.

### WebSocket: Socket.io Chat
- Basic broadcast chat example:
```js
socket.on('message', data => io.emit('new-message', data));
```
- Room-based messaging example:
```js
socket.on('join-room', room => socket.join(room));
socket.on('message', ({room,msg}) => socket.to(room).emit('new-message', msg));
```

## 4. Project & Interview Practice Strategy
### Top areas to practice
1. **Node.js fundamentals**: event loop, callback, async behavior.
2. **Express APIs**: CRUD, query params, route params, body parsing.
3. **Middleware & auth**: custom middleware, validation, authorization.
4. **MongoDB + Mongoose**: schema design, CRUD, validation, `updateOne`, `findByIdAndUpdate`.
5. **Security**: bcrypt hashing, JWT auth, cookies, refresh tokens.
6. **Caching / Redis**: session store, rate limiting.
7. **Real-time**: WebSocket vs WebRTC basics.
8. **AI integration**: prompt flow and external API orchestration.

### How to use repo for interview prep
- Read `notes.md` and `interview_prep_notes.md` together.
- Open each day folder and run example code to understand behavior.
- Use the PDFs in `all notes` for DSA practice.
- Review diagram images along with corresponding day code.
- For projects, inspect `PROJECT/Day01..Day04` and `LeetCode-Project` to see real backend architecture.

## 5. Quick Interview Answer Points
- `require()` / `module.exports` for CommonJS modules.
- `app.use(express.json())` is middleware for parsing JSON body.
- `jwt.sign(payload, secret, options)` se token banta hai.
- `bcrypt.hash(password, 10)` se password secure store hota hai.
- `redis` is fast in-memory storage useful for session and rate-limit counters.
- `socket.io` realtime server-client messaging ke liye simple abstraction hai.
- `WebRTC` offers peer-to-peer audio/video with ICE candidates and signaling.

---

> Note: Is file me repo ke sabhi backend topics, code examples, DSA PDFs, aur diagrams ka summary diya gaya hai. Interview prep ke liye is file ko `notes.md` ke saath ek saath padhna aur code kholke run karna best rahega.
