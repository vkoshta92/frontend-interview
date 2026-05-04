# 🚀 HCL Tech Interview Prep Guide
### .NET Full Stack Developer | Hinglish Notes with Code Examples
📅 **Interview: 4th May 2026 | 10:30 AM | A-22, Sector 60, Noida**

---

# 1. C# — Important Questions

## Q1: Value Type vs Reference Type?

Value types **stack** pe store hote hain, Reference types **heap** pe.

- **Value types:** int, float, bool, char, struct, enum
- **Reference types:** class, string, array, interface, delegate

```csharp
// Value Type — copy banta hai
int a = 10;
int b = a;
b = 20;
Console.WriteLine(a); // 10 (unchanged)

// Reference Type — same object point hota hai
class Person { public string Name; }
Person p1 = new Person { Name = "Ram" };
Person p2 = p1;
p2.Name = "Shyam";
Console.WriteLine(p1.Name); // Shyam (changed!)
```

> 💡 **Boxing** = value type ko object mein convert karna. **Unboxing** = wapas value type mein. Avoid karo — performance hit hota hai.

---

## Q2: Abstract Class vs Interface?

| Feature | Abstract Class | Interface |
|---|---|---|
| Constructor | Ho sakta hai | Nahi hota |
| Fields/State | Ho sakta hai | Nahi (C#8 se default methods allowed) |
| Inheritance | Single only | Multiple implement kar sakte |
| Access Modifiers | Sab allowed | Public by default |
| Use Case | Common base behavior | Contract define karna |

```csharp
public abstract class Animal {
    public string Name { get; set; }           // field allowed
    public abstract void Sound();              // child must implement
    public void Breathe() => Console.WriteLine("Breathing"); // shared method
}

public interface IFlyable {
    void Fly();
}

public class Bird : Animal, IFlyable {
    public override void Sound() => Console.WriteLine("Tweet");
    public void Fly() => Console.WriteLine("Flying!");
}
```

> 💡 Rule: **"IS-A"** relationship = Abstract Class. **"CAN-DO"** behavior = Interface.

---

## Q3: SOLID Principles

```
S — Single Responsibility  → Ek class ka ek kaam
O — Open/Closed            → Extension ke liye open, modification ke liye closed
L — Liskov Substitution    → Child class parent ki jagah kaam kare
I — Interface Segregation  → Chhote specific interfaces better hain
D — Dependency Inversion   → High-level, low-level pe depend na kare (use interfaces)
```

```csharp
// D - Dependency Inversion
public interface IEmailService { void Send(string msg); }

public class OrderService {
    private readonly IEmailService _email;
    public OrderService(IEmailService email) { // inject karo, new mat karo
        _email = email;
    }
    public void PlaceOrder() {
        // logic...
        _email.Send("Order placed!");
    }
}
```

---

## Q4: async / await kya hai?

```csharp
// Synchronous — thread BLOCK hoti hai
public string GetData() {
    Thread.Sleep(3000); // UI freeze!
    return "data";
}

// Asynchronous — thread FREE rehti hai
public async Task<string> GetDataAsync() {
    await Task.Delay(3000); // non-blocking
    return "data";
}

// Calling
var result = await GetDataAsync();
```

> 💡 `async` method always `Task` ya `Task<T>` return karta hai. Avoid `async void` — sirf event handlers mein use karo.

---

## Q5: sealed, readonly, const ka difference?

```csharp
// const — compile time constant, static hota hai
const double PI = 3.14;

// readonly — runtime pe set hota hai (constructor mein)
readonly int _id;
public MyClass(int id) { _id = id; }

// sealed class — inherit nahi ho sakti
public sealed class Logger { }

// sealed method — override nahi ho sakti (base class mein virtual honi chahiye)
public sealed override void MyMethod() { }
```

---

## Q6: Generics kya hain?

```csharp
// Without Generics — type unsafe
ArrayList list = new ArrayList();
list.Add(1);
list.Add("hello"); // koi bhi daal sakte! ❌

// With Generics — type safe ✅
List<int> numbers = new List<int>();
numbers.Add(1);
// numbers.Add("hello"); // Compile error!

// Generic Method
public T GetMax<T>(T a, T b) where T : IComparable<T> {
    return a.CompareTo(b) > 0 ? a : b;
}
int max = GetMax(10, 20); // 20
```

---

## Q7: Exception Handling

```csharp
try {
    int result = 10 / int.Parse("0");
}
catch (DivideByZeroException ex) {
    Console.WriteLine("Zero se divide nahi kar sakte: " + ex.Message);
}
catch (FormatException ex) {
    Console.WriteLine("Wrong format: " + ex.Message);
}
catch (Exception ex) {
    Console.WriteLine("Generic error: " + ex.Message);
}
finally {
    Console.WriteLine("Ye hamesha chalta hai — cleanup karo");
}
```

> 💡 **Custom Exception:** `public class PaymentException : Exception { public PaymentException(string msg) : base(msg) {} }`

---

## Q8: LINQ — Important Queries

```csharp
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Filter
var evens = numbers.Where(n => n % 2 == 0).ToList(); // 2,4,6,8,10

// Transform
var squares = numbers.Select(n => n * n).ToList();

// Aggregate
int sum = numbers.Sum();
int max = numbers.Max();
double avg = numbers.Average();

// Complex
var result = employees
    .Where(e => e.Salary > 50000)
    .OrderByDescending(e => e.Salary)
    .Select(e => new { e.Name, e.Salary })
    .Take(5)
    .ToList();

// GroupBy
var deptGroups = employees
    .GroupBy(e => e.Department)
    .Select(g => new { Dept = g.Key, Count = g.Count() });
```

---

# 2. ASP.NET Core — Important Questions

## Q9: Middleware Pipeline kya hota hai?

```csharp
// Program.cs — order MATTER karta hai!
app.UseExceptionHandler("/error");  // sabse pehle
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthentication();           // pehle auth
app.UseAuthorization();            // baad mein authorize
app.MapControllers();

// Custom Middleware
app.Use(async (context, next) => {
    Console.WriteLine($"Request: {context.Request.Path}");
    await next(); // aage pass karo
    Console.WriteLine($"Response: {context.Response.StatusCode}");
});
```

---

## Q10: Dependency Injection — Lifetimes

```csharp
// Register — Program.cs
builder.Services.AddScoped<IProductRepo, ProductRepo>();   // har request pe naya
builder.Services.AddSingleton<IConfig, AppConfig>();       // ek baar poori app ke liye
builder.Services.AddTransient<IEmailSender, EmailSender>(); // har inject pe naya

// Use in Controller
public class ProductController : ControllerBase {
    private readonly IProductRepo _repo;
    public ProductController(IProductRepo repo) { // Constructor Injection
        _repo = repo;
    }
    [HttpGet]
    public IActionResult GetAll() => Ok(_repo.GetAll());
}
```

| Lifetime | New Object Kab? | Use Karo |
|---|---|---|
| Scoped | Har HTTP Request | DbContext, Repositories |
| Singleton | Ek baar (App start) | Config, Logger, Cache |
| Transient | Har inject hone pe | Stateless, lightweight services |

---

## Q11: Complete REST API CRUD

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase {

    [HttpGet]                          // GET /api/products
    public async Task<IActionResult> GetAll() {
        var products = await _service.GetAllAsync();
        return Ok(products);           // 200
    }

    [HttpGet("{id:int}")]              // GET /api/products/5
    public async Task<IActionResult> GetById(int id) {
        var product = await _service.GetByIdAsync(id);
        if (product == null) return NotFound();  // 404
        return Ok(product);            // 200
    }

    [HttpPost]                         // POST /api/products
    public async Task<IActionResult> Create([FromBody] ProductDto dto) {
        if (!ModelState.IsValid) return BadRequest(ModelState); // 400
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created); // 201
    }

    [HttpPut("{id:int}")]              // PUT /api/products/5
    public async Task<IActionResult> Update(int id, [FromBody] ProductDto dto) {
        await _service.UpdateAsync(id, dto);
        return NoContent();            // 204
    }

    [HttpDelete("{id:int}")]           // DELETE /api/products/5
    public async Task<IActionResult> Delete(int id) {
        await _service.DeleteAsync(id);
        return NoContent();            // 204
    }
}
```

> 💡 HTTP Status Codes yaad rakho: **200** OK, **201** Created, **204** NoContent, **400** BadRequest, **401** Unauthorized, **403** Forbidden, **404** NotFound, **500** Internal Server Error

---

## Q12: JWT Authentication

```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = "myapp",
            ValidAudience = "myusers",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("my-super-secret-key-32chars"))
        };
    });

// Token Generate karo — Login endpoint
var token = new JwtSecurityToken(
    issuer: "myapp",
    audience: "myusers",
    claims: new[] { new Claim(ClaimTypes.Name, user.Username) },
    expires: DateTime.Now.AddHours(2),
    signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
);

// Protect endpoint
[Authorize]
[HttpGet("profile")]
public IActionResult GetProfile() => Ok(User.Identity.Name);
```

> 💡 **JWT Flow:** Login → Server token deta hai → Client `Authorization: Bearer <token>` header mein bhejta hai → Server verify karta hai

---

## Q13: Action Filters

```csharp
// Custom Filter banana
public class LogActionFilter : ActionFilterAttribute {
    public override void OnActionExecuting(ActionExecutingContext context) {
        Console.WriteLine($"Action start: {context.ActionDescriptor.DisplayName}");
    }
    public override void OnActionExecuted(ActionExecutedContext context) {
        Console.WriteLine("Action complete");
    }
}

// Use on controller or action
[LogActionFilter]
public class ProductsController : ControllerBase { }
```

---

## Q14: Model Validation

```csharp
public class ProductDto {
    [Required(ErrorMessage = "Name required hai")]
    [MaxLength(100)]
    public string Name { get; set; }

    [Range(1, 999999, ErrorMessage = "Price 1 se 999999 ke beech honi chahiye")]
    public decimal Price { get; set; }

    [EmailAddress]
    public string ContactEmail { get; set; }
}

// Controller mein auto validate hota hai [ApiController] se
// Ya manually check karo:
if (!ModelState.IsValid) return BadRequest(ModelState);
```

---

# 3. SQL Server — Important Questions

## Q15: Stored Procedure vs Function

```sql
-- Stored Procedure
CREATE PROCEDURE GetEmployeesByDept
    @DeptId INT,
    @MinSalary DECIMAL = 0
AS BEGIN
    SELECT Name, Salary FROM Employees
    WHERE DeptId = @DeptId AND Salary >= @MinSalary
    ORDER BY Salary DESC
END
EXEC GetEmployeesByDept @DeptId = 3, @MinSalary = 50000

-- Scalar Function
CREATE FUNCTION GetFullName(@First NVARCHAR(50), @Last NVARCHAR(50))
RETURNS NVARCHAR(100)
AS BEGIN
    RETURN @First + ' ' + @Last
END
SELECT dbo.GetFullName(FirstName, LastName) FROM Employees
```

| | Stored Procedure | Function |
|---|---|---|
| Call kaise | EXEC | SELECT mein |
| DML (INSERT/UPDATE) | ✅ Allowed | ❌ Not allowed |
| Return | Multiple/Table | Single value |
| Transaction | ✅ | ❌ |

---

## Q16: Index — Types aur Use

```sql
-- Clustered Index (table ka physical order — PK pe auto banta hai)
CREATE CLUSTERED INDEX IX_Emp_Id ON Employees(Id);

-- Non-Clustered (separate structure — WHERE/JOIN columns pe lagao)
CREATE NONCLUSTERED INDEX IX_Emp_Email ON Employees(Email);
CREATE NONCLUSTERED INDEX IX_Emp_Dept ON Employees(DeptId) INCLUDE (Name, Salary);

-- Index check karo
EXEC sp_helpindex 'Employees';
```

> 💡 **Kab lagao:** High cardinality columns (Email, Phone), WHERE/JOIN mein frequently use hone wale columns
> **Kab na lagao:** Columns jahan bahut INSERT/UPDATE ho, small tables pe

---

## Q17: All Important JOINs

```sql
-- INNER JOIN — dono mein match chahiye
SELECT e.Name, d.DeptName
FROM Employees e INNER JOIN Departments d ON e.DeptId = d.Id;

-- LEFT JOIN — left ke saare + matching right (NULL agar match nahi)
SELECT e.Name, d.DeptName
FROM Employees e LEFT JOIN Departments d ON e.DeptId = d.Id;

-- SELF JOIN — same table se join (hierarchy)
SELECT e.Name AS Employee, m.Name AS Manager
FROM Employees e LEFT JOIN Employees m ON e.ManagerId = m.Id;

-- GROUP BY + HAVING
SELECT DeptId, COUNT(*) AS EmpCount, AVG(Salary) AS AvgSal
FROM Employees
GROUP BY DeptId
HAVING COUNT(*) > 5
ORDER BY AvgSal DESC;
```

---

## Q18: CTE aur Window Functions

```sql
-- CTE (Common Table Expression)
WITH TopEarners AS (
    SELECT Name, Salary, DeptId,
           ROW_NUMBER() OVER (PARTITION BY DeptId ORDER BY Salary DESC) AS Rank
    FROM Employees
)
SELECT * FROM TopEarners WHERE Rank <= 3; -- Har dept ke top 3

-- Window Functions
SELECT
    Name,
    Salary,
    RANK() OVER (ORDER BY Salary DESC) AS SalaryRank,
    SUM(Salary) OVER (PARTITION BY DeptId) AS DeptTotalSalary,
    LAG(Salary) OVER (ORDER BY HireDate) AS PrevEmpSalary
FROM Employees;
```

---

## Q19: Transactions aur ACID

```sql
BEGIN TRANSACTION
    BEGIN TRY
        UPDATE Accounts SET Balance = Balance - 1000 WHERE Id = 1;
        UPDATE Accounts SET Balance = Balance + 1000 WHERE Id = 2;
        COMMIT TRANSACTION;
        PRINT 'Transfer successful';
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        PRINT 'Error: ' + ERROR_MESSAGE();
    END CATCH
```

```
ACID Properties:
A — Atomicity   → Ya saara kaam ho ya kuch nahi
C — Consistency → Data hamesha valid state mein rahe
I — Isolation   → Ek transaction doosre ko affect na kare
D — Durability  → Committed data permanent rahe
```

---

## Q20: Normalization

```
1NF → Har column atomic hona chahiye (no repeating groups)
2NF → 1NF + No partial dependency (composite PK wale tables mein)
3NF → 2NF + No transitive dependency (non-key columns independent hon)
```

> 💡 Real interview answer: "Hamare project mein 3NF follow kiya tha — redundancy reduce hui aur data integrity improve hua. Kuch cases mein performance ke liye intentional denormalization bhi kiya."

---

# 4. React — Important Questions

## Q21: useState aur useEffect

```jsx
import React, { useState, useEffect } from 'react';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // [] = sirf mount pe ek baar chale
        fetch('/api/products')
            .then(res => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then(data => setProducts(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));

        // Cleanup function (unmount pe chalta hai)
        return () => console.log('Component unmounted');
    }, []); // dependency array

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ul>
            {products.map(p => <li key={p.id}>{p.name} - ₹{p.price}</li>)}
        </ul>
    );
}
```

---

## Q22: Props vs State

```jsx
// Props — Parent se aata hai, child read-only
function ProductCard({ name, price, onAddToCart }) {
    return (
        <div>
            <h3>{name}</h3>
            <p>₹{price}</p>
            <button onClick={() => onAddToCart(name)}>Add to Cart</button>
        </div>
    );
}

// State — Component ka apna data
function ShoppingCart() {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    const addToCart = (item) => {
        setCartItems(prev => [...prev, item]); // always use prev state!
    };

    return (
        <div>
            <ProductCard name="Laptop" price={50000} onAddToCart={addToCart} />
            <p>Items: {cartItems.length}</p>
        </div>
    );
}
```

---

## Q23: useCallback, useMemo, React.memo

```jsx
import React, { useState, useCallback, useMemo, memo } from 'react';

// React.memo — child re-render rokta hai agar props change nahi hue
const ExpensiveChild = memo(({ onClick, items }) => {
    console.log('Child rendered');
    return <button onClick={onClick}>Click ({items.length})</button>;
});

function Parent() {
    const [count, setCount] = useState(0);
    const [items] = useState([1, 2, 3, 4, 5]);

    // useCallback — function reference stable rakho
    const handleClick = useCallback(() => {
        console.log('clicked');
    }, []); // empty = never recreate

    // useMemo — expensive calculation cache karo
    const total = useMemo(() => {
        return items.reduce((sum, n) => sum + n, 0);
    }, [items]); // sirf items change hone pe recalculate

    return (
        <div>
            <ExpensiveChild onClick={handleClick} items={items} />
            <p>Total: {total} | Count: {count}</p>
            <button onClick={() => setCount(c => c + 1)}>Increment</button>
        </div>
    );
}
```

---

## Q24: useContext — Prop Drilling avoid karo

```jsx
// Context create karo
const AuthContext = React.createContext(null);

// Provider — top level pe wrap karo
function App() {
    const [user, setUser] = useState({ name: 'Raj', role: 'admin' });

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <Dashboard />
        </AuthContext.Provider>
    );
}

// Kisi bhi child mein direct access
function UserProfile() {
    const { user } = useContext(AuthContext);
    return <div>Hello, {user.name}!</div>;
}
```

---

## Q25: Custom Hook banana

```jsx
// useFetch — reusable data fetching hook
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(url)
            .then(res => res.json())
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [url]);

    return { data, loading, error };
}

// Use karo kisi bhi component mein
function Products() {
    const { data: products, loading } = useFetch('/api/products');
    if (loading) return <div>Loading...</div>;
    return <ul>{products?.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

---

# 5. Entity Framework Core

## Q26: Code First Setup aur Migration

```csharp
// 1. Model
public class Product {
    public int Id { get; set; }
    [Required][MaxLength(200)]
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } // Navigation property
}

// 2. DbContext
public class AppDbContext : DbContext {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder mb) {
        mb.Entity<Product>()
          .Property(p => p.Price).HasColumnType("decimal(18,2)");
        mb.Entity<Product>()
          .HasOne(p => p.Category)
          .WithMany(c => c.Products)
          .HasForeignKey(p => p.CategoryId);
    }
}

// 3. Program.cs
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// 4. Terminal mein:
// Add-Migration InitialCreate
// Update-Database
```

---

## Q27: Eager vs Lazy Loading

```csharp
// Eager Loading — .Include() use karo (1 query mein sab)
var orders = await context.Orders
    .Include(o => o.Customer)
    .Include(o => o.Items)
        .ThenInclude(i => i.Product)  // nested include
    .Where(o => o.Status == "Active")
    .ToListAsync();

// Lazy Loading — access pe load (N+1 problem!)
// Package: Microsoft.EntityFrameworkCore.Proxies
// services.AddDbContext + .UseLazyLoadingProxies()
var order = await context.Orders.FirstAsync();
var name = order.Customer.Name; // yahan extra query jati hai!

// Explicit Loading — manual control
var order = await context.Orders.FindAsync(id);
await context.Entry(order).Reference(o => o.Customer).LoadAsync();
```

> 💡 **N+1 Problem:** 1 query orders ke liye + N queries har order ke customer ke liye. Always use `.Include()` jab navigation properties chahiye!

---

## Q28: Repository Pattern

```csharp
// Interface
public interface IRepository<T> where T : class {
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> GetByIdAsync(int id);
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

// Implementation
public class ProductRepository : IRepository<Product> {
    private readonly AppDbContext _context;
    public ProductRepository(AppDbContext context) { _context = context; }

    public async Task<IEnumerable<Product>> GetAllAsync() =>
        await _context.Products.Include(p => p.Category).ToListAsync();

    public async Task AddAsync(Product product) {
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
    }
    // ... other methods
}

// DI Register
builder.Services.AddScoped<IRepository<Product>, ProductRepository>();
```

---

# 6. Angular — Important Questions

## Q29: Component Lifecycle Hooks

```typescript
import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-product',
    template: `<div>{{product?.name}}</div>`
})
export class ProductComponent implements OnInit, OnDestroy, OnChanges {
    @Input() productId: number;
    product: Product;

    constructor(private productService: ProductService) {
        // Constructor — sirf DI ke liye, logic mat likho
    }

    ngOnInit() {
        // Component initialize hone ke baad — API calls yahan karo
        this.loadProduct();
    }

    ngOnChanges(changes: SimpleChanges) {
        // Input property change hone pe
        if (changes['productId']) {
            this.loadProduct();
        }
    }

    ngOnDestroy() {
        // Cleanup — subscriptions unsubscribe karo
        this.subscription?.unsubscribe();
    }

    loadProduct() {
        this.productService.getById(this.productId)
            .subscribe(p => this.product = p);
    }
}
```

---

## Q30: Observable vs Promise

```typescript
// Promise — single value, eager
const promise = fetch('/api/products').then(r => r.json());
// Cancel nahi kar sakte ❌

// Observable — multiple values, lazy, cancellable ✅
import { Observable, Subject } from 'rxjs';
import { map, filter, catchError, takeUntil } from 'rxjs/operators';

private destroy$ = new Subject<void>();

this.productService.getProducts()
    .pipe(
        map(products => products.filter(p => p.active)),
        catchError(err => {
            console.error(err);
            return of([]); // empty array return karo error pe
        }),
        takeUntil(this.destroy$) // component destroy pe auto-unsubscribe
    )
    .subscribe(products => this.products = products);

ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
}
```

---

## Q31: Angular Services aur HTTP

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
    private apiUrl = 'https://api.example.com/products';

    constructor(private http: HttpClient) {}

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    create(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    update(id: number, product: Product): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
```

---

# 7. Design Patterns

## Q32: Commonly Asked Patterns

```csharp
// SINGLETON — ek hi instance poori app mein
public class DatabaseConnection {
    private static DatabaseConnection _instance;
    private static readonly object _lock = new object();

    private DatabaseConnection() {} // private constructor

    public static DatabaseConnection Instance {
        get {
            lock (_lock) {
                _instance ??= new DatabaseConnection();
                return _instance;
            }
        }
    }
}

// FACTORY — object creation logic separate karo
public interface IPayment { void Pay(decimal amount); }
public class CreditCardPayment : IPayment { public void Pay(decimal a) => Console.WriteLine($"Card: {a}"); }
public class UpiPayment : IPayment { public void Pay(decimal a) => Console.WriteLine($"UPI: {a}"); }

public class PaymentFactory {
    public static IPayment Create(string type) => type switch {
        "card" => new CreditCardPayment(),
        "upi"  => new UpiPayment(),
        _      => throw new ArgumentException("Unknown type")
    };
}

// Use:
var payment = PaymentFactory.Create("upi");
payment.Pay(500); // UPI: 500
```

---

# 8. System Design & Architecture

## Q33: Microservices vs Monolith

| | Monolith | Microservices |
|---|---|---|
| Deployment | Single unit | Independent services |
| Scaling | Poora scale karna padta | Sirf needed service scale karo |
| Development | Simple | Complex (distributed) |
| Best for | Small teams, startups | Large scale, big teams |

> 💡 **Interview mein bolo:** "Hamara project monolith se shuru hua, phir high traffic wale modules (Order, Payment) ko microservices mein migrate kiya. API Gateway use kiya routing ke liye."

---

## Q34: Caching Strategy

```csharp
// In-Memory Cache
builder.Services.AddMemoryCache();

public class ProductService {
    private readonly IMemoryCache _cache;

    public async Task<List<Product>> GetAllAsync() {
        var cacheKey = "all_products";
        if (!_cache.TryGetValue(cacheKey, out List<Product> products)) {
            products = await _repo.GetAllAsync();
            _cache.Set(cacheKey, products, TimeSpan.FromMinutes(10));
        }
        return products;
    }
}

// Distributed Cache (Redis)
builder.Services.AddStackExchangeRedisCache(options => {
    options.Configuration = "localhost:6379";
});
```

---

# 9. HR / Behavioral Questions

## Q35: Tell me about yourself

**Structure (2 minute max):**
```
"Main [X] saal se .NET Full Stack development kar raha hoon.
Pehle [Company] mein kaam kiya jahan [specific achievement — performance improve kiya / feature build kiya].
Currently [current work].
Ab main HCL jaise reputed company mein apna contribution dena chahta hoon
jahan challenging projects aur growth ke opportunities hon."
```

---

## Q36: Apna Sabse Bada Challenge?

**STAR Method use karo:**
- **S**ituation: "Hamare production system mein performance issue tha, 10 second response time"
- **T**ask: "Mujhe 2 weeks mein fix karna tha"
- **A**ction: "SQL queries optimize ki, indexes add kiye, caching implement ki"
- **R**esult: "Response time 10s se 800ms aa gayi — 92% improvement"

---

## Q37: Why HCL Tech?

```
✅ "HCL globally reputed company hai with strong .NET ecosystem"
✅ "Full stack role mera exact skillset match karti hai — C#, React, SQL"
✅ "HCL ke projects large scale hote hain jahan real challenges milte hain"
✅ "Learning aur growth culture ke baare mein bahut suna hai"
```

---

## Q38: 5 Years mein kahan dekhte ho?

```
"Next 2-3 saal mein technical depth build karna chahta hoon —
distributed systems, cloud architecture (Azure/AWS).
Phir team lead ya architect role mein junior developers ko mentor karna.
Long term mein large scale enterprise systems design karna — 
HCL ke global projects is ke liye perfect platform hai."
```

---

## Q39: Weakness poochhe toh?

**Formula: Real weakness + Improvement steps**
```
"Pehle mein documentation ko seriously nahi leta tha.
Lekin ek project mein onboarding issue aane ke baad
Maine Confluence use karna start kiya aur har feature ka
proper API documentation likhna shuru kiya. Ab ye habit ban gayi hai."
```

---

# 10. ⚡ Last Minute Quick Revision

## C# Cheat Sheet
```
string        → immutable, heap pe
StringBuilder → mutable, use in loops
is / as       → type check/cast
?.            → null conditional operator
??            → null coalescing
=>            → lambda / expression body
nameof()      → refactor-safe string names
IDisposable   → using() block se auto-dispose
```

## ASP.NET Quick Points
```
[ApiController]    → auto model validation, automatic 400 response
[FromBody]         → JSON body read karo
[FromQuery]        → URL query params
[FromRoute]        → URL route params
[Produces("application/json")] → response type specify
[ProducesResponseType(200)]    → Swagger documentation
```

## SQL Quick Reference
```
TRUNCATE vs DELETE:
  TRUNCATE — faster, no WHERE, no trigger, no rollback
  DELETE   — slow, WHERE allowed, triggers fire, rollback possible

UNION vs UNION ALL:
  UNION     — duplicates remove karta hai
  UNION ALL — duplicates rakhta hai (faster)

HAVING vs WHERE:
  WHERE  — row filter (GROUP BY se pehle)
  HAVING — group filter (GROUP BY ke baad)
```

## React Cheat Sheet
```
useState    → component ka local state
useEffect   → side effects (API calls, subscriptions)
useContext  → global state access
useRef      → DOM access, mutable value (no re-render)
useMemo     → expensive value cache
useCallback → function reference stable rakho
React.memo  → component memoize (props same = no re-render)
key prop    → list mein unique identifier (index avoid karo!)
```

## Status Codes Yaad Karo
```
200 — OK (GET success)
201 — Created (POST success)
204 — No Content (PUT/DELETE success)
400 — Bad Request (validation fail)
401 — Unauthorized (login required)
403 — Forbidden (permission nahi)
404 — Not Found
409 — Conflict (duplicate entry)
500 — Internal Server Error
```

---

## 🎯 Interview Day Checklist

- [ ] Resume ke 2 printed copies
- [ ] Government ID (Aadhar/PAN)
- [ ] Laptop ya notepad (code likhne ke liye)
- [ ] 10:15 AM tak pahuncho (15 min early)
- [ ] Contact: Prabha / Rohit Verma
- [ ] Email: prabha.kumari@hcltech.com

---

> ## 🍀 All the Best! You've Got This!
> **"Confidence ke saath bolo, code clearly explain karo, real examples do — HCL mein aapka swagat hoga!"**

---
*HCL Tech | A-22, Block A, Sector 60, Noida 201301 | 10:30 AM onwards*