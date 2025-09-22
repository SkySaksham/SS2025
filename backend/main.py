from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import hashlib
import jwt
import datetime
from contextlib import contextmanager
import os

app = FastAPI(title="SehatSathi API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://sehatsathi-xyoe.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

# Database setup
DATABASE_PATH = "sehat_sathi.db"

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    user_type: str  # 'government', 'pharmacy', 'admin'
    pharmacy_name: Optional[str] = None
    license_number: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class PharmacyStock(BaseModel):
    medicine_name: str
    quantity: int
    price: float
    expiry_date: str
    batch_number: str

class User(BaseModel):
    id: int
    username: str
    email: str
    user_type: str
    is_approved: bool
    pharmacy_name: Optional[str] = None
    license_number: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_token(user_id: int, user_type: str) -> str:
    payload = {
        "user_id": user_id,
        "user_type": user_type,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Database initialization
def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                user_type TEXT NOT NULL,
                is_approved BOOLEAN DEFAULT FALSE,
                pharmacy_name TEXT,
                license_number TEXT,
                address TEXT,
                phone TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Pharmacy stocks table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS pharmacy_stocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pharmacy_id INTEGER NOT NULL,
                medicine_name TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                expiry_date DATE NOT NULL,
                batch_number TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (pharmacy_id) REFERENCES users (id)
            )
        ''')
        
        # Government analytics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS government_analytics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                total_pharmacies INTEGER DEFAULT 0,
                pending_approvals INTEGER DEFAULT 0,
                total_medicines INTEGER DEFAULT 0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()

def create_dummy_data():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if dummy data already exists
        cursor.execute("SELECT COUNT(*) as count FROM users WHERE user_type = 'pharmacy'")
        if cursor.fetchone()["count"] > 0:
            return  # Dummy data already exists
        
        # Indian pharmacy dummy data
        indian_pharmacies = [
            {
                "username": "rajesh_medicals",
                "email": "rajesh@rajeshmedicals.com",
                "password": "pharmacy123",
                "pharmacy_name": "Rajesh Medical Store",
                "license_number": "DL-MH-001-2023",
                "address": "Shop No. 15, Andheri West, Mumbai, Maharashtra 400058",
                "phone": "+91-9876543210"
            },
            {
                "username": "apollo_pharmacy_delhi",
                "email": "manager@apollodelhi.com",
                "password": "pharmacy123",
                "pharmacy_name": "Apollo Pharmacy",
                "license_number": "DL-DL-002-2023",
                "address": "Connaught Place, New Delhi, Delhi 110001",
                "phone": "+91-9876543211"
            },
            {
                "username": "medplus_bangalore",
                "email": "admin@medplusbangalore.com",
                "password": "pharmacy123",
                "pharmacy_name": "MedPlus Health Services",
                "license_number": "DL-KA-003-2023",
                "address": "Koramangala, Bangalore, Karnataka 560034",
                "phone": "+91-9876543212"
            },
            {
                "username": "wellness_pharmacy",
                "email": "contact@wellnesspharmacy.com",
                "password": "pharmacy123",
                "pharmacy_name": "Wellness Pharmacy",
                "license_number": "DL-TN-004-2023",
                "address": "T. Nagar, Chennai, Tamil Nadu 600017",
                "phone": "+91-9876543213"
            },
            {
                "username": "care_medicals",
                "email": "info@caremedicals.com",
                "password": "pharmacy123",
                "pharmacy_name": "Care Medical Store",
                "license_number": "DL-GJ-005-2023",
                "address": "Satellite, Ahmedabad, Gujarat 380015",
                "phone": "+91-9876543214"
            },
            {
                "username": "health_first_kolkata",
                "email": "manager@healthfirstkolkata.com",
                "password": "pharmacy123",
                "pharmacy_name": "Health First Pharmacy",
                "license_number": "DL-WB-006-2023",
                "address": "Park Street, Kolkata, West Bengal 700016",
                "phone": "+91-9876543215"
            },
            {
                "username": "sunrise_medicals",
                "email": "contact@sunrisemedicals.com",
                "password": "pharmacy123",
                "pharmacy_name": "Sunrise Medical Store",
                "license_number": "DL-RJ-007-2023",
                "address": "Malviya Nagar, Jaipur, Rajasthan 302017",
                "phone": "+91-9876543216"
            },
            {
                "username": "city_pharmacy_pune",
                "email": "admin@citypharmacypune.com",
                "password": "pharmacy123",
                "pharmacy_name": "City Pharmacy",
                "license_number": "DL-MH-008-2023",
                "address": "Shivaji Nagar, Pune, Maharashtra 411005",
                "phone": "+91-9876543217"
            }
        ]
        
        # Insert pharmacy users (all approved for demo purposes)
        pharmacy_ids = []
        for i, pharmacy in enumerate(indian_pharmacies):
            is_approved = True  # All existing pharmacies are approved
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, user_type, is_approved, 
                                 pharmacy_name, license_number, address, phone)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                pharmacy["username"], pharmacy["email"], hash_password(pharmacy["password"]),
                "pharmacy", is_approved, pharmacy["pharmacy_name"], pharmacy["license_number"],
                pharmacy["address"], pharmacy["phone"]
            ))
            pharmacy_ids.append(cursor.lastrowid)
        
        # Indian medicine dummy data
        indian_medicines = [
            {"name": "Paracetamol 500mg", "price": 25.50},
            {"name": "Crocin Advance", "price": 45.00},
            {"name": "Dolo 650", "price": 35.75},
            {"name": "Azithromycin 500mg", "price": 125.00},
            {"name": "Amoxicillin 250mg", "price": 85.50},
            {"name": "Cetirizine 10mg", "price": 15.25},
            {"name": "Pantoprazole 40mg", "price": 95.00},
            {"name": "Metformin 500mg", "price": 65.75},
            {"name": "Amlodipine 5mg", "price": 55.25},
            {"name": "Atorvastatin 10mg", "price": 145.00},
            {"name": "Omeprazole 20mg", "price": 75.50},
            {"name": "Losartan 50mg", "price": 105.25},
            {"name": "Aspirin 75mg", "price": 12.50},
            {"name": "Ibuprofen 400mg", "price": 28.75},
            {"name": "Diclofenac 50mg", "price": 22.25},
            {"name": "Ranitidine 150mg", "price": 35.00},
            {"name": "Montelukast 10mg", "price": 185.50},
            {"name": "Levothyroxine 50mcg", "price": 95.75},
            {"name": "Glimepiride 2mg", "price": 125.25},
            {"name": "Telmisartan 40mg", "price": 165.00}
        ]
        
        # Add stocks for all pharmacies
        import random
        for pharmacy_id in pharmacy_ids:  # For all pharmacies
            for medicine in random.sample(indian_medicines, random.randint(8, 15)):
                expiry_date = datetime.date.today() + datetime.timedelta(days=random.randint(30, 730))
                batch_number = f"BATCH{random.randint(1000, 9999)}"
                quantity = random.randint(10, 500)
                
                cursor.execute('''
                    INSERT INTO pharmacy_stocks (pharmacy_id, medicine_name, quantity, price, expiry_date, batch_number)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (pharmacy_id, medicine["name"], quantity, medicine["price"], expiry_date, batch_number))
        
        # Create government user
        cursor.execute('''
            INSERT OR IGNORE INTO users (username, email, password_hash, user_type, is_approved)
            VALUES (?, ?, ?, ?, ?)
        ''', ("govt_admin", "admin@mohfw.gov.in", hash_password("govt123"), "government", True))
        
        conn.commit()

# API Routes
@app.on_event("startup")
async def startup_event():
    init_db()
    # Create default admin user
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", ("admin",))
        if not cursor.fetchone():
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, user_type, is_approved)
                VALUES (?, ?, ?, ?, ?)
            ''', ("admin", "admin@sehatsathi.gov.in", hash_password("admin123"), "admin", True))
            conn.commit()
    
    create_dummy_data()

@app.get("/")
async def root():
    return {"message": "SehatSathi API is running"}

@app.post("/api/auth/register")
async def register(user: UserCreate):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE username = ? OR email = ?", (user.username, user.email))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create user
        is_approved = user.user_type == "admin"  # Auto-approve admin users
        cursor.execute('''
            INSERT INTO users (username, email, password_hash, user_type, is_approved, pharmacy_name, license_number, address, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user.username, user.email, hash_password(user.password), user.user_type,
            is_approved, user.pharmacy_name, user.license_number, user.address, user.phone
        ))
        conn.commit()
        
        return {"message": "User registered successfully", "requires_approval": not is_approved}

@app.post("/api/auth/login")
async def login(user: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (user.username,))
        db_user = cursor.fetchone()
        
        if not db_user or not verify_password(user.password, db_user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        if not db_user["is_approved"]:
            raise HTTPException(status_code=403, detail="Account pending approval")
        
        token = create_token(db_user["id"], db_user["user_type"])
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": db_user["id"],
                "username": db_user["username"],
                "user_type": db_user["user_type"],
                "pharmacy_name": db_user["pharmacy_name"]
            }
        }

@app.post("/login")
async def login_simple(user: UserLogin):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (user.username,))
        db_user = cursor.fetchone()
        
        if not db_user or not verify_password(user.password, db_user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Allow login even if not approved - frontend will handle access control
        
        token = create_token(db_user["id"], db_user["user_type"])
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": db_user["user_type"],  # Frontend expects 'role' not 'user_type'
            "user": {
                "id": db_user["id"],
                "username": db_user["username"],
                "user_type": db_user["user_type"],
                "pharmacy_name": db_user["pharmacy_name"],
                "is_approved": db_user["is_approved"]
            }
        }

@app.get("/api/users/pending")
async def get_pending_users(token_data: dict = Depends(verify_token)):
    if token_data["user_type"] not in ["government", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE is_approved = FALSE AND user_type = 'pharmacy'")
        users = cursor.fetchall()
        
        return [dict(user) for user in users]

@app.post("/api/users/{user_id}/approve")
async def approve_user(user_id: int, token_data: dict = Depends(verify_token)):
    if token_data["user_type"] not in ["government", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET is_approved = TRUE WHERE id = ?", (user_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "User approved successfully"}

@app.post("/pharmacy/signup")
async def pharmacy_signup(pharmacy_data: dict):
    try:
        print(f"Received pharmacy signup data: {pharmacy_data}")
        
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if pharmacy already exists
            cursor.execute("SELECT * FROM users WHERE email = ?", (pharmacy_data.get("email"),))
            existing_user = cursor.fetchone()
            if existing_user:
                raise HTTPException(status_code=400, detail="Pharmacy already registered with this email")
            
            # Generate username and password
            base_username = pharmacy_data.get("name", "").lower().replace(" ", "_")
            username = base_username
            password = pharmacy_data.get("password", "password123")  # Use custom password or default
            
            # Ensure username is unique
            counter = 1
            while True:
                cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
                if not cursor.fetchone():
                    break
                username = f"{base_username}_{counter}"
                counter += 1
            
            print(f"Creating pharmacy user: {username}")
            
            # Create pharmacy user (pending approval)
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, user_type, is_approved, 
                                 pharmacy_name, license_number, address, phone)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                username,
                pharmacy_data.get("email"),
                hash_password(password),
                "pharmacy",
                False,  # Requires approval
                pharmacy_data.get("name"),
                pharmacy_data.get("license"),
                pharmacy_data.get("location"),
                pharmacy_data.get("phone")
            ))
            conn.commit()
            
            print(f"Pharmacy user created successfully: {username}")
            
            return {
                "message": "Pharmacy registration submitted successfully. Awaiting government approval.",
                "credentials": {
                    "username": username,
                    "password": password,
                    "pharmacy_name": pharmacy_data.get("name")
                }
            }
    except HTTPException:
        # Re-raise HTTP exceptions (like 400 for duplicate email)
        raise
    except Exception as e:
        import traceback
        print(f"Error in pharmacy signup: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/pharmacy/stocks")
async def get_pharmacy_stocks(token_data: dict = Depends(verify_token)):
    if token_data["user_type"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM pharmacy_stocks WHERE pharmacy_id = ?", (token_data["user_id"],))
        stocks = cursor.fetchall()
        
        return [dict(stock) for stock in stocks]

@app.post("/api/pharmacy/stocks")
async def add_pharmacy_stock(stock: PharmacyStock, token_data: dict = Depends(verify_token)):
    if token_data["user_type"] != "pharmacy":
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if pharmacy is approved
        cursor.execute("SELECT is_approved FROM users WHERE id = ?", (token_data["user_id"],))
        user = cursor.fetchone()
        if not user or not user["is_approved"]:
            raise HTTPException(status_code=403, detail="Pharmacy account must be approved by government before adding medicines")
        
        cursor.execute('''
            INSERT INTO pharmacy_stocks (pharmacy_id, medicine_name, quantity, price, expiry_date, batch_number)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (token_data["user_id"], stock.medicine_name, stock.quantity, stock.price, stock.expiry_date, stock.batch_number))
        conn.commit()
        
        return {"message": "Stock added successfully"}

@app.get("/api/admin/all-stocks")
async def get_all_stocks(token_data: dict = Depends(verify_token)):
    if token_data["user_type"] not in ["admin", "government"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT ps.*, u.pharmacy_name, u.address 
            FROM pharmacy_stocks ps 
            JOIN users u ON ps.pharmacy_id = u.id
            WHERE u.is_approved = TRUE
        ''')
        stocks = cursor.fetchall()
        
        return [dict(stock) for stock in stocks]

@app.get("/api/government/dashboard")
async def get_government_dashboard(token_data: dict = Depends(verify_token)):
    if token_data["user_type"] not in ["government", "admin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Get statistics
        cursor.execute("SELECT COUNT(*) as total FROM users WHERE user_type = 'pharmacy' AND is_approved = TRUE")
        total_pharmacies = cursor.fetchone()["total"]
        
        cursor.execute("SELECT COUNT(*) as pending FROM users WHERE user_type = 'pharmacy' AND is_approved = FALSE")
        pending_approvals = cursor.fetchone()["pending"]
        
        cursor.execute("SELECT COUNT(*) as total FROM pharmacy_stocks")
        total_medicines = cursor.fetchone()["total"]
        
        # Get low stock medicines
        cursor.execute('''
            SELECT ps.medicine_name, ps.quantity, u.pharmacy_name, u.address
            FROM pharmacy_stocks ps 
            JOIN users u ON ps.pharmacy_id = u.id
            WHERE ps.quantity < 50 AND u.is_approved = TRUE
            ORDER BY ps.quantity ASC
            LIMIT 10
        ''')
        low_stock_medicines = cursor.fetchall()
        
        # Get expiring medicines (within 30 days)
        cursor.execute('''
            SELECT ps.medicine_name, ps.expiry_date, u.pharmacy_name, u.address
            FROM pharmacy_stocks ps 
            JOIN users u ON ps.pharmacy_id = u.id
            WHERE ps.expiry_date <= date('now', '+30 days') AND u.is_approved = TRUE
            ORDER BY ps.expiry_date ASC
            LIMIT 10
        ''')
        expiring_medicines = cursor.fetchall()
        
        # Get recent pharmacy registrations
        cursor.execute('''
            SELECT username, pharmacy_name, address, created_at, is_approved
            FROM users 
            WHERE user_type = 'pharmacy' 
            ORDER BY created_at DESC 
            LIMIT 10
        ''')
        recent_pharmacies = cursor.fetchall()
        
        # Get top medicines by availability
        cursor.execute('''
            SELECT ps.medicine_name, SUM(ps.quantity) as total_quantity, COUNT(*) as pharmacy_count
            FROM pharmacy_stocks ps 
            JOIN users u ON ps.pharmacy_id = u.id
            WHERE u.is_approved = TRUE
            GROUP BY ps.medicine_name
            ORDER BY total_quantity DESC
            LIMIT 10
        ''')
        top_medicines = cursor.fetchall()
        
        return {
            "statistics": {
                "total_pharmacies": total_pharmacies,
                "pending_approvals": pending_approvals,
                "total_medicines": total_medicines,
                "low_stock_count": len(low_stock_medicines),
                "expiring_soon_count": len(expiring_medicines)
            },
            "recent_pharmacies": [dict(pharmacy) for pharmacy in recent_pharmacies],
            "low_stock_medicines": [dict(medicine) for medicine in low_stock_medicines],
            "expiring_medicines": [dict(medicine) for medicine in expiring_medicines],
            "top_medicines": [dict(medicine) for medicine in top_medicines]
        }

if __name__ == "__main__":
    import uvicorn
    import os

    port = int(os.environ.get("PORT", 8000))  # default to 8000 locally
    uvicorn.run(app, host="0.0.0.0", port=port)
